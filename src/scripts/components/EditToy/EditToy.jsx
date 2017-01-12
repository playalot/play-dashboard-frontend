import React,{ Component } from 'react'
import Request from 'superagent'
import Dropzone from 'react-dropzone'
import {
	Row, Col, FromControl, Modal,
} from 'react-bootstrap'
import CDN from '../../widgets/cdn'
import Switch from 'rc-switch'
import {RIEInput, RIEToggle, RIETextArea, RIENumber, RIETags} from 'riek'
export default class EditToy extends Component {
	constructor(props) {
	  	super(props)

	  	this.state = {
			cover: '',
			name: '',
			nameRaw: '',
			release:'',
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
					name:res.body.name || '',
					nameRaw:res.body.nameRaw || '',
					release:res.body.release || '',
					currency:res.body.info.currency || 'rmb',
					money:res.body.info.money || 0,
					scale:res.body.info.scale || '',
					company:res.body.info.company || '',
					character:res.body.info.character || '',
					artist:res.body.info.artist || '',
					series:res.body.info.series || '',
					origin:res.body.info.origin || '',
					detail: res.body.info.detail || '',
					isR18:res.body.isR18,
					otherInfo: res.body.otherInfo,
					images: res.body.images
				})
			})
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
				url: `/api/upload?key=toy/img/${this.props.params.id}_${(Date.now().toString()+index)}_(size).${image.name.split('.').pop()}`,
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
					const uploadKey = 'toy/cover/'+_this.props.params.id+Date.now()+'_w_'+img.width+'_h_'+img.height+'.'+file.name.split('.').pop();
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
		Object.keys(data).forEach(key => data[key]=== '' ? delete data[key] : '')
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
							<Col sm={12} className="edit-toy-item no-border">
								<input type="text" className="text-input title" onChange={(e) => this.setState({name:e.target.value})} value={this.state.name}/>
							</Col>
							<Col sm={12} className="edit-toy-item">
								<span className="toy-label">原名:</span>
								<input type="text" className="text-input" onChange={(e) => this.setState({nameRaw:e.target.value})} value={this.state.nameRaw}/>
							</Col>
							<Col sm={6} className="edit-toy-item">
								<span className="toy-label">发售日:</span>
								<input type="text" className="text-input" onChange={(e) => this.setState({release:e.target.value})} value={this.state.release}/>
							</Col>
							<Col sm={6} className="edit-toy-item">
								<span className="toy-label">价格:</span>
								<input type="number" className="text-input" onChange={(e) => this.setState({money:e.target.value})} value={this.state.money}/>
								<select className="text-select" value={this.state.currency} onChange={(e) => this.setState({currency:e.target.value})}>
									<option value="rmb">人民币</option>
									<option value="yen">日元</option>
									<option value="dollar">美元</option>
									<option value="euro">欧元</option>
								</select>
							</Col>
							<Col sm={6} className="edit-toy-item">
								<span className="toy-label">公司:</span>
								<input type="text" className="text-input" onChange={(e) => this.setState({company:e.target.value})} value={this.state.company}/>
							</Col>
							<Col sm={6} className="edit-toy-item">
								<span className="toy-label">比例:</span>
								<input type="text" className="text-input" onChange={(e) => this.setState({scale:e.target.value})} value={this.state.scale}/>
							</Col>
							<Col sm={6} className="edit-toy-item">
								<span className="toy-label">系列:</span>
								<input type="text" className="text-input" onChange={(e) => this.setState({series:e.target.value})} value={this.state.series}/>
			          		</Col>
							<Col sm={6} className="edit-toy-item">
								<span className="toy-label">角色:</span>
								<input type="text" className="text-input" onChange={(e) => this.setState({character:e.target.value})} value={this.state.character}/>
			          		</Col>
							<Col sm={6} className="edit-toy-item">
								<span className="toy-label">原著:</span>
								<input type="text" className="text-input" onChange={(e) => this.setState({origin:e.target.value})} value={this.state.origin}/>
							</Col>
			          		<Col sm={6} className="edit-toy-item">
								<span className="toy-label">原型师:</span>
								<input type="text" className="text-input" onChange={(e) => this.setState({artist:e.target.value})} value={this.state.artist}/>
			          		</Col>
			          		<Col sm={6} className="edit-toy-item">
								<span className="toy-label">R18:</span>
	        		  			<Switch onChange={value => this.setState({isR18:value})}
						        	checked={this.state.isR18}
						        	style={{margin:5}}
						      	/>
			          		</Col>
			          		<Col sm={12} className="edit-toy-item no-border">
	        		  			<span className="toy-direction">详细描述:</span>
	        		  			<textarea 
		        		  			className="text-area" 
		        		  			onChange={(e) => this.setState({detail:e.target.value})} 
		        		  			value={this.state.detail}>
		        		  		</textarea>
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
