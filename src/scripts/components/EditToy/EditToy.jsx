import React,{ Component } from 'react'
import Request from 'superagent'
import Dropzone from 'react-dropzone'
import {
	Row, Col, FromControl, Modal,
} from 'react-bootstrap'
import CDN from '../../widgets/cdn'
import {RIEInput, RIEToggle, RIETextArea, RIENumber, RIETags} from 'riek'
export default class EditToy extends Component {
	constructor(props) {
	  	super(props)

	  	this.state = {
			cover: '',
			name: '',
			nameRaw: '',
			release: '',
			money: 0,
			currency: '',
			scale: '',
			detail: '',
			company: '',
			character: '',
			artist: '',
			series: '',
			origin: '',
			isR18: false,
			otherInfo: [],
			images: [],
			newKey: '',
			newValue: '',
			showModal: false,
			showImage:null,
		}
	  	this.changeCurrency = (e) => this.setState({currency:e.target.value})
	  	this.virtualServerCallback = this._virtualServerCallback.bind(this)
	  	this.removeOtherInfo = this._removeOtherInfo.bind(this)
	  	this.addOtherInfo = this._addOtherInfo.bind(this)
	  	this.changeNewKey = (e) => this.setState({newKey:e.target.value})
	  	this.changeNewValue = (e) => this.setState({newValue:e.target.value})
	  	this.onDropOfficialImage = this._onDropOfficialImage.bind(this)
	  	this.onDropCover = this._onDropCover.bind(this)

	  	this.submit = this._submit.bind(this)
	  	this.removeImg = this._removeImg.bind(this)
	  	this.upImg = this._upImg.bind(this)
	  	this.downImg = this._downImg.bind(this)
	  	this.openModal = (img) => {
	  		this.setState({
	  			showImage:CDN.show(img),
	  			showModal:true,
	  		})
	  	}
	  	this.closeModal = () => this.setState({
	  		showModal:false,
	  		showImage:null
	  	})
	}
	componentWillMount() {
		Request
			.get(`/api/toy/${this.props.params.id}`)
			.end((err,res) => {
				this.setState({
					cover:res.body.cover,
					name:res.body.name ? res.body.name : '空',
					nameRaw:res.body.nameRaw ? res.body.nameRaw : '空',
					release:res.body.release ? res.body.release : '空',
					currency:res.body.info.currency ? res.body.info.currency : 'rmb',
					money:res.body.info.money ? res.body.info.money : 0,
					scale:res.body.info.scale ? res.body.info.scale : '空',
					company:res.body.info.company ? res.body.info.company : '空',
					character:res.body.info.character ? res.body.info.character : '空',
					artist:res.body.info.artist ? res.body.info.artist : '空',
					series:res.body.info.series ? res.body.info.series : '空',
					origin:res.body.info.origin ? res.body.info.origin : '空',
					detail: res.body.info.detail ? res.body.info.detail : '空',
					isR18:res.body.isR18,
					otherInfo: res.body.otherInfo,
					images: res.body.images
				})
			})
	}
	_virtualServerCallback(newState) {
		this.setState(newState)
  	}
	isNumber(num) {
		let re = /^[0-9]+(\.[0-9]+)?$/
		console.info(re.test(num))
		return re.test(num)
	}
	isEmpty(text) {
		return text.trim()
	}
	_removeOtherInfo(i) {
		let tmpArr = this.state.otherInfo
		tmpArr.splice(i,1)
		this.setState({
			otherInfo: tmpArr
		})
	}
	_addOtherInfo() {
		if(!this.state.newKey.trim() || !this.state.newValue.trim()){
			return alert('字段不能为空')
		}
		let tmpArr = this.state.otherInfo
		tmpArr.push({
			key:this.state.newKey,
			value:this.state.newValue
		})
		this.setState({
			otherInfo:tmpArr
		},() => {
			this.setState({
				newKey:'',
				newValue:''
			})
		})
	}
	_onDropOfficialImage(images) {
		images.forEach((image,index) => {
			let formData = new FormData()
			formData.append('file', image)
			$.ajax({
				url: `/api/upload?key=toy/img/${this.props.params.id}_(size).${image.name.split('.').pop()}`,
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: function(data) {
					this.state.images.push(data)
					this.setState({
						images: this.state.images
					})
				}.bind(this)
			})
		})
	}
	_onDropCover(images) {
		let _this = this
		Request.get('/api/uptoken')
			.withCredentials()
			.end(function(err, res) {
				let uploadToken = res.body.uptoken
				const file = images[0]
				const img = new Image()
				img.onload = () => {
					const uploadKey = 'toy/cover/'+_this.props.params.id+'_w_'+img.width+'_h_'+img.height+'.'+file.name.split('.').pop();
					Request
						.post('http://upload.qiniu.com/')
						.field('key', uploadKey)
						.field('token', uploadToken)
						.field('x:filename', file.name)
						.field('x:size', file.size)
						.attach('file', file, file.name)
						.set('Accept', 'application/json')
						.end(function(err, res) {
							_this.setState({
								cover: uploadKey
							});
						});
				}
				img.src = file.preview
			})
	}
	_removeImg(index) {
		if (confirm('删除这个图片?')) {
			let tmpImg = this.state.images
	        tmpImg.splice(index,1)
	        this.setState({
	            images: tmpImg
	        })
		}
    }
    _upImg(index) {
    	if(index <= 0){ return }
    	let tmpImg = this.state.images
    	let tmp = tmpImg[index-1]
    	tmpImg[index-1] = tmpImg[index]
    	tmpImg[index] = tmp
    	this.setState({
            images: tmpImg
        })
    }
    _downImg(index) {
		if(index >= (this.state.images.length - 1)){ return }
    	let tmpImg = this.state.images
    	let tmp = tmpImg[index+1]
    	tmpImg[index+1] = tmpImg[index]
    	tmpImg[index] = tmp
    	this.setState({
            images: tmpImg
        })
    }
	_submit() {
	  	let {
			cover,
			name,
			nameRaw,
			release,
			money,
			currency,
			scale,
			detail,
			company,
			character,
			artist,
			series,
			origin,
			isR18,
			otherInfo,
			images
	    } = this.state

		const data = {
			cover,
			name,
			nameRaw,
			release,
			money,
			currency,
			scale,
			detail,
			company,
			character,
			artist,
			series,
			origin,
			isR18,
			otherInfo,
			images
		}
		data.money = parseInt(data.money)
		Object.keys(data).forEach(key => data[key] === '空' || data[key] === 0 ? delete data[key] : '')
  		Request
	  		.post(`/api/toy/${this.props.params.id}`)
	  		.send(data)
	  		.end((err,res) => {
					if (err || !res.ok) {
						console.log(err)
			 			alert('保存失败!')
			 		} else {
			 			alert('保存成功.')
	  			}
	  		})
	}
	render() {
		return(
			<div className="content">
        	  <div className="box box-solid">
          		<div className="box-body">
	     			<Row>
	     			  	<Dropzone onDrop={this.onDropCover} className="col-sm-3 edit-toy-cover">
		                	<img className="img-responsive" src={this.state.cover?CDN.show(this.state.cover):''}/>
		                	<div className="edit-toy-cover-text">
		                		<span>更换封面</span>
		                	</div>
		              	</Dropzone>
	      				<Col sm={9}>
							<Col sm={12}>
								<RIEInput
									value={this.state.name}
									change={this.virtualServerCallback}
									classInvalid="edit-toy-invalid"
									validate={this.isEmpty}
									propName="name"
									className="edit-toy-title"
								/>
							</Col>
							<Col sm={12} className="edit-toy-item">
			          			<span>原名:&nbsp;&nbsp;</span>
			          			<RIEInput
									value={this.state.nameRaw}
									change={this.virtualServerCallback}
									validate={this.isEmpty}
									classInvalid="edit-toy-invalid"
									propName="nameRaw"
								/>
							</Col>
							<Col sm={6} className="edit-toy-item">
								<span >发售日:&nbsp;&nbsp;</span>
								<RIEInput
									value={this.state.release}
									change={this.virtualServerCallback}
									validate={this.isEmpty}
									classInvalid="edit-toy-invalid"
									propName="release"
								/>
							</Col>
							<Col sm={6} className="edit-toy-item">
								<span>价格:&nbsp;&nbsp;</span>
			 					<RIENumber
										value={this.state.money}
										change={this.virtualServerCallback}
										propName="money"
								/>&nbsp;
								<select value={this.state.currency} onChange={this.changeCurrency}>
									<option value=""></option>
									<option value="rmb">人民币</option>
									<option value="yen">日元</option>
									<option value="dollar">美元</option>
									<option value="euro">欧元</option>
								</select>
							</Col>
							<Col sm={6} className="edit-toy-item">
								<span>公司:&nbsp;&nbsp;</span>
								<RIEInput
									value={this.state.company}
									change={this.virtualServerCallback}
									validate={this.isEmpty}
									classInvalid="edit-toy-invalid"
									propName="company"
								/>
							</Col>
							<Col sm={6} className="edit-toy-item">
								<span>比例:&nbsp;&nbsp;</span>
								<RIEInput
									value={this.state.scale}
									change={this.virtualServerCallback}
									validate={this.isEmpty}
									classInvalid="edit-toy-invalid"
									propName="scale"
								/>
							</Col>
							<Col sm={6} className="edit-toy-item">
			          			<span>系列:&nbsp;&nbsp;</span>
			          			<RIEInput
									value={this.state.series}
									change={this.virtualServerCallback}
									validate={this.isEmpty}
									classInvalid="edit-toy-invalid"
									propName="series"
								/>
			          		</Col>
							<Col sm={6} className="edit-toy-item">
		          		  		<span>角色:&nbsp;&nbsp;</span>
		          		  		<RIEInput
									value={this.state.character}
									change={this.virtualServerCallback}
									validate={this.isEmpty}
									classInvalid="edit-toy-invalid"
									propName="character"
								/>
			          		</Col>
							<Col sm={6} className="edit-toy-item">
								<span>原著:&nbsp;&nbsp;</span>
								<RIEInput
									value={this.state.origin}
									change={this.virtualServerCallback}
									validate={this.isEmpty}
									classInvalid="edit-toy-invalid"
									propName="origin"
								/>
							</Col>
			          		<Col sm={6} className="edit-toy-item">
	        		  			<span>原型师:&nbsp;&nbsp;</span>
	        		  			<RIEInput
									value={this.state.artist}
									change={this.virtualServerCallback}
									validate={this.isEmpty}
									classInvalid="edit-toy-invalid"
									propName="artist"
								/>
			          		</Col>
			          		<Col sm={6} className="edit-toy-item">
	        		  			<span>R18:&nbsp;&nbsp;</span>
	        		  			<RIEToggle
								  value={this.state.isR18}
								  change={this.virtualServerCallback}
								  propName="isR18"
								/>
			          		</Col>
			          		<Col sm={12} className="edit-toy-item">
	        		  			<span>详细描述:&nbsp;&nbsp;</span>
	        		  			<RIETextArea
									rows={30}
									cols={60}
								  	value={this.state.detail}
								  	change={this.virtualServerCallback}
								  	validate={this.isEmpty}
								  	classInvalid="edit-toy-invalid"
								  	propName="detail"
								/>
			          		</Col>
						</Col>
	      			</Row>
      			  	<legend>其他信息</legend>
      		  		{
      		  			this.state.otherInfo.map((info,i) => {
      		  				return (
      		  					<Row key={`otherInfo_${i}`} >
	          		  				<Col  xs={2} smOffset={3}>
	          		  					<span>{info.key}</span>
	          		  				</Col>
	          		  				<Col xs={2} >
	          		  					<span>{info.value}</span>
	          		  				</Col>
	          		  				<Col  xs={2} smOffset={1} xsOffset={1}>
	          		  					<span onClick={() => this.removeOtherInfo(i)} className="fa fa-minus-circle"></span>
	          		  				</Col>
      		  					</Row>
      		  				)
      		  			})
      		  		}
          		  	<Row>
          		  		<Col xs={2} smOffset={3}>
          		  			<input  className="form-control" type="text" value={this.state.newKey} onChange={this.changeNewKey} placeholder="key"></input>
          		  		</Col>
          		  		<Col xs={2} >
	                      <input  className="form-control"  type="text" value={this.state.newValue} onChange={this.changeNewValue} placeholder="value"></input>
  		  				</Col>
  		  				<Col  xs={2} smOffset={1} xsOffset={1}>
	                      <button className="btn btn-primary" onClick={this.addOtherInfo}>添加</button>
  		  				</Col>
	                </Row>
      			  	<legend>官方图片</legend>
      			  	<div>
              		<Dropzone onDrop={this.onDropOfficialImage}  className="col-sm-2 edit-toy-image-box" style={{height:100, borderWidth: 2, borderColor: '#666', borderStyle: 'dashed'}}>
                		<p>将图片拖入该区域</p>
                	</Dropzone>
                	{
                		this.state.images.map((img,index) => {
		                    return (
		                      <div className="pull-left edit-toy-image-box" key={'img_'+img}>
		                        <img className="img-responsive" onClick={() => this.openModal(img)} src={img?CDN.show(img):''}/>
		                        <span className="fa fa-close delete" onClick={() => this.removeImg(index)}></span>
		                        <span className="fa fa-angle-left left" onClick={() => this.upImg(index)}></span>
		                        <span className="fa fa-angle-right right" onClick={() => this.downImg(index)}></span>
		                      </div>
		                    )
		                })
                	}
            		</div>
              	<legend style={{paddingTop:'15px'}}></legend>
                <button className="btn btn-primary col-xs-offset-3" onClick={this.submit}>Submit</button>
                {
                	<Modal show={this.state.showModal} onHide={this.closeModal}>
		                <Modal.Body>
		               		<img className="image-modal" src={this.state.showImage}/>
		                </Modal.Body>
		            </Modal>
                }
          		</div>
          	  </div>
          	</div>
		)
	}
}
