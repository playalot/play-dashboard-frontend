import React,{ Component } from 'react'
import Request from 'superagent'
import Dropzone from 'react-dropzone'
import { Row, Col, Modal,InputGroup,FormControl } from 'react-bootstrap'
import CDN from '../../widgets/cdn'
import PlaySwitch from '../Common/playSwitch'
import Select from 'react-select'
// import PlayHtmlEditor from '../Common/PlayHtmlEditor'

import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc'
const SortableItem = SortableElement(({img,onRemove,index,i}) =>
	<div style={{margin:'0 5px 5px 0'}}>
		<button type="button" className="close" aria-label="Close" onClick={() => onRemove(i)}>
			<span aria-hidden="true">&times;</span>
		</button>
		<img style={{height:100}} className="img-responsive" src={CDN.show(img)}/>
	</div>
)

const SortableList = SortableContainer(({items,onRemove}) => {
  	return (
		<div className="d-flex flex-wrap">
			{
				items.map((img, index) => <SortableItem onRemove={onRemove} key={`toy-img-${index}`} i={index} index={index} img={img} />)
			}
		</div>
  	)
})


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
			companys:[
				{ value: '万代', label: '万代' },
				{ value: '眼镜厂', label: '眼镜厂' },
				{ value: '寿屋', label: '寿屋' },
				{ value: '良笑社', label: '良笑社' },
				{ value: 'MegaHouse', label: 'MegaHouse' },
				{ value: '世嘉', label: '世嘉' },
				{ value: 'FuRyu', label: 'FuRyu' },
				{ value: '大气工业', label: '大气工业' }
			]
		}
		this.onSortEnd = ({oldIndex, newIndex}) => {
			this.setState({
				images: arrayMove(this.state.images, oldIndex, newIndex),
			});
		}
	  	this.removeOtherInfo = this._removeOtherInfo.bind(this)
	  	this.addOtherInfo = this._addOtherInfo.bind(this)
	  	this.changeNewKey = (e) => this.setState({newKey:e.target.value})
	  	this.changeNewValue = (e) => this.setState({newValue:e.target.value})
	  	this.onDropOfficialImage = this._onDropOfficialImage.bind(this)
	  	this.onDropCover = this._onDropCover.bind(this)

	  	this.submit = this._submit.bind(this)
	  	this.removeImg = this._removeImg.bind(this)
	}
	componentWillMount() {
		Request
			.get(`/api/toy/${this.props.match.params.id}`)
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
					images: res.body.images,
				})
			})
	}
	_removeOtherInfo(i) {
		const otherInfo = this.state.otherInfo
		otherInfo.splice(i,1)
		this.setState({ otherInfo })
	}
	_addOtherInfo() {
		const { newKey, newValue } = this.state
		if(!newKey.trim() || !newValue.trim()){
			return alert('字段不能为空')
		}
		this.state.otherInfo.push({ key:newKey, value:newValue })
		this.setState({ newKey:'', newValue:'' })
	}
	_onDropOfficialImage(images) {
		images.forEach((image,index) => {
			let formData = new FormData()
			formData.append('file', image)
			$.ajax({
				url: `/api/upload?key=toy/img/${this.props.match.params.id}_${(Date.now().toString()+index)}_(size).${image.name.split('.').pop()}`,
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: (data) => {
					this.state.images.push(data)
					this.setState({
						images: this.state.images
					})
				}
			})
		})
	}
	_onDropCover(images) {
		Request.get('/api/uptoken')
			.withCredentials()
			.end((err, res) => {
				let uploadToken = res.body.uptoken
				const file = images[0]
				const img = new Image()
				img.onload = () => {
					const uploadKey = 'toy/cover/'+this.props.match.params.id+Date.now()+'_w_'+img.width+'_h_'+img.height+'.'+file.name.split('.').pop();
					Request
						.post('http://upload.qiniu.com/')
						.field('key', uploadKey)
						.field('token', uploadToken)
						.field('x:filename', file.name)
						.field('x:size', file.size)
						.attach('file', file, file.name)
						.set('Accept', 'application/json')
						.end((err, res) => {
							this.setState({ cover: uploadKey })
						})
				}
				img.src = file.preview
			})
	}
	_removeImg(index) {
		if (confirm('删除这个图片?')) {
			const images = this.state.images
	        images.splice(index,1)
	        this.setState({ images })
		}
    }
	_submit() {
	  	let { cover, name, nameRaw, release, money, currency, scale, detail, company,
			character, artist, series, origin, isR18, otherInfo, images } = this.state
		const data = { cover, name, nameRaw, release, money:parseInt(money), currency,
			scale, detail, company, character, artist, series, isR18, otherInfo, images }
		if(name.trim() === ''){
			return alert('名字不能为空')
		}
		if(!release.match(/\d{4}\/\d{1,2}/)){
			return alert('发售日期格式不对')
		}
		Object.keys(data).forEach(key => data[key]=== '' ? delete data[key] : '')
  		Request
	  		.post(`/api/toy/${this.props.match.params.id}`)
	  		.send(data)
	  		.end((err,res) => {
					if (err || !res.ok) {
			 			alert('保存失败!')
			 		} else {
			 			alert('保存成功.')
	  			}
	  		})
	}
	render() {
		return(
			<div className="portlet bordered light">
				<div className="portlet-title tabbable-line">
					<div className="caption caption-md">
						<span className="caption-subject font-blue-sharp bold uppercase pr-3">玩具</span>
						<input type="text" className="edit-toy-title" placeholder="玩具名称" onChange={(e) => this.setState({name:e.target.value})} value={this.state.name}/>
					</div>
					<ul className="nav nav-tabs">
						<li className="active">
							<a href="#edit_toy_1" data-toggle="tab">玩具信息</a>
						</li>
						<li>
							<a href="#edit_toy_2" data-toggle="tab">详细描述</a>
						</li>
						
					</ul>
				</div>
				<div className="portlet-body">
					<div className="tab-content pb-3">
						<div className="tab-pane active" id="edit_toy_1">
							<Row>
								<Dropzone onDrop={this.onDropCover} className="col-sm-3 edit-toy-cover">
									<img className="img-responsive" src={this.state.cover?CDN.show(this.state.cover):''}/>
									<div className="edit-toy-cover-text">
										<span>更换封面</span>
									</div>
								</Dropzone>
								<Col sm={9}>
									<Row className="my-1">
										<Col sm={2} className="sm-2-label">原名</Col>
										<Col sm={10}>
											<input type="text" className="edit-toy-input" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({nameRaw:e.target.value})} value={this.state.nameRaw}/>
										</Col>
									</Row>
									<Row className="my-1">
										<Col sm={2} className="sm-2-label">发售日</Col>
										<Col sm={10}>
											<input type="text" className="edit-toy-input" placeholder="例:2017/5" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({release:e.target.value})} value={this.state.release}/>
										</Col>
									</Row>
									<Row className="my-1">
										<Col sm={2} className="sm-2-label">价格</Col>
										<Col sm={10}>
											<InputGroup>
												<input type="number" className="edit-toy-input" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({money:e.target.value})} value={this.state.money}/>
												<InputGroup.Button>
													<button className="btn btn-sm blue btn-outline dropdown-toggle" data-toggle="dropdown" type="button">
														{(() => {
															switch(this.state.currency) {
																case 'yen' : return '日元';
																case 'dollar' : return '美元';
																case 'euro' : return '欧元';
																default : return '人民币'
															}
														})()}
													</button>
													<ul className="dropdown-menu pull-right">
														<li>
															<a onClick={() => this.setState({currency:'rmb'})}>人民币</a>
														</li>
														<li>
															<a onClick={() => this.setState({currency:'yen'})}>日元</a>
														</li>
														<li>
															<a onClick={() => this.setState({currency:'dollar'})}>美元</a>
														</li>
														<li>
															<a onClick={() => this.setState({currency:'euro'})}>欧元</a>
														</li>
													</ul>
												</InputGroup.Button>
											</InputGroup>
										</Col>
									</Row>
									<Row className="my-1">
										<Col sm={2} className="sm-2-label">公司</Col>
										<Col sm={10}>
											{/*<Select.Creatable
												options={this.state.companys}
												onChange={({value}) => this.setState({company:value})}
												value={this.state.company}
												promptTextCreator={(label) => `添加 ${label}`}	
											/>*/}
											<InputGroup>
												<input type="text" className="edit-toy-input" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({company:e.target.value})} value={this.state.company}/>
												<InputGroup.Button>
													<button className="btn btn-sm blue btn-outline dropdown-toggle" data-toggle="dropdown" type="button">
														<i className="fa fa-arrow-left fa-fw"></i>选择
													</button>
													<ul className="dropdown-menu pull-right">
														{
															this.state.companys.map((c,i) => {
																return(
																	<li key={`edit-toy-company_${i}`}>
																		<a onClick={() => this.setState({company:c.label})}>{c.label}</a>
																	</li>
																)
															})
														}
													</ul>
												</InputGroup.Button>
											</InputGroup>
										</Col>
									</Row>
									<Row className="my-1">
										<Col sm={2} className="sm-2-label">比例</Col>
										<Col sm={10}>
											<input type="text" className="edit-toy-input" placeholder="例:1/7" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({scale:e.target.value})} value={this.state.scale}/>
										</Col>
									</Row>
									<Row className="my-1">
										<Col sm={2} className="sm-2-label">系列</Col>
										<Col sm={10}>
											<input type="text" className="edit-toy-input" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({series:e.target.value})} value={this.state.series}/>
										</Col>
									</Row>
									<Row className="my-1">
										<Col sm={2} className="sm-2-label">角色</Col>
										<Col sm={10}>
											<input type="text" className="edit-toy-input" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({character:e.target.value})} value={this.state.character}/>
										</Col>
									</Row>
									<Row className="my-1">
										<Col sm={2} className="sm-2-label">原著</Col>
										<Col sm={10}>
											<input type="text" className="edit-toy-input" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({origin:e.target.value})} value={this.state.origin}/>
										</Col>
									</Row>
									<Row className="my-1">
										<Col sm={2} className="sm-2-label">原型师</Col>
										<Col sm={10}>
											<input type="text" className="edit-toy-input" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({artist:e.target.value})} value={this.state.artist}/>
										</Col>
									</Row>
									<Row className="my-1">
										<Col sm={2} className="sm-2-label">R18</Col>
										<Col sm={10}>
											<PlaySwitch on="YES" off="NO" active={this.state.isR18} onChange={isR18 => this.setState({isR18})}/>
										</Col>
									</Row>
								</Col>
							</Row>
							<legend>官方图片</legend>
								
							<Row>
								<Col xs={12} sm={2} style={{marginBottom:5}}>
									<Dropzone accept="image/jpeg, image/png" onDrop={this.onDropOfficialImage} className="play-dropzone-style">
										<div>将图片拖入此区域</div>
									</Dropzone>
								</Col>
								<Col xs={12} sm={10}>
									<SortableList onRemove={this.removeImg} axis="xy" items={this.state.images} onSortEnd={this.onSortEnd} />
								</Col>
							</Row>
						</div>
						<div className="tab-pane " id="edit_toy_2">
							<Row className="my-1">
								<Col sm={2} className="sm-2-label">详细描述</Col>
								<Col sm={10}>
									{/* <PlayHtmlEditor></PlayHtmlEditor> */}
									<textarea 
										className="edit-toy-text-area" 
										rows="3"
										onChange={(e) => this.setState({detail:e.target.value})} 
										value={this.state.detail}>
									</textarea>
								</Col>
							</Row>
							<Row className="my-1">
								<Col sm={2} className="sm-2-label">其他信息</Col>
								<Col sm={10}>
									{
										this.state.otherInfo.map((info,i) => {
											return (
												<Row className="mb-2" key={`otherInfo_${i}`} >
													<Col className="pt-2" xs={2}>
														<span>{info.key}</span>
													</Col>
													<Col className="pt-2" xs={2} >
														<span>{info.value}</span>
													</Col>
													<Col xs={2}>
														<button className="btn btn-outline red" onClick={() => this.removeOtherInfo(i)}>删除</button>
													</Col>
												</Row>
											)
										})
									}
									<Row>
										<Col xs={2}>
											<input  className="form-control" type="text" value={this.state.newKey} onChange={this.changeNewKey} placeholder="key"></input>
										</Col>
										<Col xs={2} >
											<input  className="form-control"  type="text" value={this.state.newValue} onChange={this.changeNewValue} placeholder="value"></input>
										</Col>
										<Col  xs={2}>
											<button className="btn btn-outline green" onClick={this.addOtherInfo}>添加</button>
										</Col>
									</Row>
								</Col>
							</Row>
						</div>
					</div>
					
					<div className="portlet-body py-5" style={{borderTop:'1px solid #eef1f5'}}>
						<Col sm={2} smOffset={2}>
							<button className="btn btn-outline green" type="button" onClick={this.submit}>Submit</button>
						</Col>
					</div>
				</div>
			</div>
		)
	}
}
