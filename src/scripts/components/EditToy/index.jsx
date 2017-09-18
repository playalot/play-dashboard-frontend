import React,{ Component } from 'react'
import Request from 'superagent'
import Dropzone from 'react-dropzone'
import CDN from '../../widgets/cdn'
import { uploadImageWithWH,uploadFiles } from '../../widgets/upload'
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
			],

			gashaponImage:'',
			gashaponPrice:0
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
	  	this.onDropOfficialImage = (files) => uploadFiles(files,`toy/img/${this.props.match.params.id}_`).then(keys => this.setState(prevState => ({images:prevState.images.concat(...keys)})))
	  	this.onDropCover = (files) => uploadImageWithWH(files[0],'toy/cover/').then(cover => this.setState({cover}))

	  	this.submit = this._submit.bind(this)
		this.removeImg = this._removeImg.bind(this)
		
		this.onDropGashaponImage = (files) => uploadImageWithWH(files[0],'toy/gashapon/').then(gashaponImage => this.setState({gashaponImage}))
		
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

					gashaponImage:res.body.gashapon ? res.body.gashapon.image : '',
					gashaponPrice:res.body.gashapon ? res.body.gashapon.price : 0,
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
	_removeImg(index) {
		if (confirm('删除这个图片?')) {
			const images = this.state.images
	        images.splice(index,1)
	        this.setState({ images })
		}
    }
	_submit() {
	  	let { cover, name, nameRaw, release, money, currency, scale, detail, company,
			character, artist, series, origin, isR18, otherInfo, images,gashaponImage,gashaponPrice } = this.state
		const data = { cover, name, nameRaw, release, money:parseInt(money), currency,
			scale, detail, company, character, artist, series, isR18, otherInfo, images }
		const gashapon = {}
		if(name.trim() === ''){
			return alert('名字不能为空')
		}
		if(!release.match(/\d{4}\/\d{1,2}/) && release !== ''){
			return alert('发售日期格式不对')
		}
		if(gashaponImage){
			gashapon.image = gashaponImage
		}
		if(gashaponPrice){
			gashapon.price = gashaponPrice
			data.gashapon = gashapon
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
			<div className="bg-white p-3">
				<div className="portlet-title tabbable-line">
					<div className="caption caption-md">
						<span className="caption-subject font-blue-sharp bold uppercase pr-3">玩具</span>
						<input type="text" className="edit-toy-title" placeholder="玩具名称" onChange={(e) => this.setState({name:e.target.value})} value={this.state.name}/>
					</div>
					<div className="d-flex justify-content-end align-items-center">
						<ul className="nav nav-tabs m-tabs-line m-tabs-line--2x m-tabs-line--info" role="tablist">
							
							<li className="nav-item m-tabs__item">
								<a className="nav-link m-tabs__link active" data-toggle="tab" href="#edit_toy_1" role="tab">
								玩具信息
								</a>
							</li>
							<li className="nav-item m-tabs__item">
								<a className="nav-link m-tabs__link" data-toggle="tab" href="#edit_toy_2" role="tab">
								详细描述
								</a>
							</li>
							<li className="nav-item m-tabs__item">
								<a className="nav-link m-tabs__link" data-toggle="tab" href="#edit_toy_3" role="tab">
								扭蛋详情
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="portlet-body">
					<div className="tab-content pb-3">
						<div className="tab-pane active" id="edit_toy_1">
							<div className="row">
								<Dropzone onDrop={this.onDropCover} className="col-sm-3 edit-toy-cover">
									<img className="img-responsive w-100" src={this.state.cover?CDN.show(this.state.cover):''}/>
									<div className="edit-toy-cover-text">
										<span>更换封面</span>
									</div>
								</Dropzone>
								<div className="col-sm-9">
									<div className="row">
										<label className="col-2 col-form-label text-right">原名</label>
										<div className="col-sm-10">
											<input type="text" className="edit-toy-input" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({nameRaw:e.target.value})} value={this.state.nameRaw}/>
										</div>
									</div>
									<div className="row">
										<label className="col-2 col-form-label text-right">发售日</label>
										<div className="col-sm-10">
											<input type="text" className="edit-toy-input" placeholder="例:2017/5" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({release:e.target.value})} value={this.state.release}/>
										</div>
									</div>
									<div className="row">
										<label className="col-2 col-form-label text-right">价格</label>
										<div className="col-sm-10">
											<div className="input-group">
												<input type="number" className="edit-toy-input" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({money:e.target.value})} value={this.state.money}/>
												<span className="input-group-btn">
													<button className="btn btn-sm btn-outline-success dropdown-toggle" data-toggle="dropdown" type="button">
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
												</span>
											</div>
										</div>
									</div>
									<div className="row">
										<label className="col-2 col-form-label text-right">公司</label>
										<div className="col-sm-10">
											<div className="input-group">
												<input type="text" className="edit-toy-input" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({company:e.target.value})} value={this.state.company}/>
												<span className="input-group-btn">
													<button className="btn btn-sm btn-outline-success dropdown-toggle" data-toggle="dropdown" type="button">
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
												</span>
											</div>
										</div>
									</div>
									<div className="row">
										<label className="col-2 col-form-label text-right">比例</label>
										<div className="col-sm-10">
											<input type="text" className="edit-toy-input" placeholder="例:1/7" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({scale:e.target.value})} value={this.state.scale}/>
										</div>
									</div>
									<div className="row">
										<label className="col-2 col-form-label text-right">系列</label>
										<div className="col-sm-10">
											<input type="text" className="edit-toy-input" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({series:e.target.value})} value={this.state.series}/>
										</div>
									</div>
									<div className="row">
										<label className="col-2 col-form-label text-right">角色</label>
										<div className="col-sm-10">
											<input type="text" className="edit-toy-input" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({character:e.target.value})} value={this.state.character}/>
										</div>
									</div>
									<div className="row">
										<label className="col-2 col-form-label text-right">原著</label>
										<div className="col-sm-10">
											<input type="text" className="edit-toy-input" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({origin:e.target.value})} value={this.state.origin}/>
										</div>
									</div>
									<div className="row">
										<label className="col-2 col-form-label text-right">原型师</label>
										<div className="col-sm-10">
											<input type="text" className="edit-toy-input" onFocus={(e) => e.target.select()} onChange={(e) => this.setState({artist:e.target.value})} value={this.state.artist}/>
										</div>
									</div>
									<div className="row">
										<label className="col-2 col-form-label text-right">R18</label>
										<div className="col-sm-10">
											<PlaySwitch on="YES" off="NO" active={this.state.isR18} onChange={isR18 => this.setState({isR18})}/>
										</div>
									</div>
								</div>
							</div>
							<legend>官方图片</legend>
							<div className="row">
								<div className="col-sm-2">
									<Dropzone accept="image/jpeg, image/png" onDrop={this.onDropOfficialImage} className="play-dropzone-style">
										<div>将图片拖入此区域</div>
									</Dropzone>
								</div>
								<div className="col-sm-10">
									<SortableList onRemove={this.removeImg} axis="xy" items={this.state.images} onSortEnd={this.onSortEnd} />
								</div>
								
							</div>
						</div>
						<div className="tab-pane" id="edit_toy_2">
							<div className="row">
								<label className="col-2 col-form-label text-right">详细描述</label>
								<div className="col-sm-10">
									<textarea 
										className="edit-toy-text-area" 
										rows="3"
										onChange={(e) => this.setState({detail:e.target.value})} 
										value={this.state.detail}>
									</textarea>
								</div>
							</div>
							<div className="row">
								<label className="col-2 col-form-label text-right">其他信息</label>
								<div className="col-sm-10">
									{
										this.state.otherInfo.map((info,i) => {
											return (
												<div className="row mb-2" key={`otherInfo_${i}`}>
													<div className="col-2 my-auto">
														<span>{info.key}</span>
													</div>
													<div className="col-2 my-auto">
														<span>{info.value}</span>
													</div>
													<div className="col-2 my-auto">
														<button className="btn btn-outline-danger" onClick={() => this.removeOtherInfo(i)}>删除</button>
													</div>
												</div>
											)
										})
									}
									<div className="row">
										<div className="col-2">
											<input  className="form-control" type="text" value={this.state.newKey} onChange={this.changeNewKey} placeholder="key"></input>
										</div>
										<div className="col-2">
											<input  className="form-control"  type="text" value={this.state.newValue} onChange={this.changeNewValue} placeholder="value"></input>
										</div>
										<div className="col-2">
											<button className="btn btn-outline-success" onClick={this.addOtherInfo}>添加</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="tab-pane" id="edit_toy_3">
							<div className="row mb-3">
								<div className="col-sm-2 text-center">
									<Dropzone accept="image/jpeg, image/png" onDrop={this.onDropGashaponImage} className="play-dropzone-style">
										<div>将扭蛋封面拖入此区</div>
									</Dropzone>
								</div>
								<div className="col-sm-10">
									<img style={{height:100}} src={CDN.show(this.state.gashaponImage) } alt="" /> 
								</div>
							</div>
							<div className="row">
								<label className="col-2 col-form-label text-right">扭蛋价格</label>
								<div className="col-sm-4">
									<input type="number" className="form-control" onChange={(e) => this.setState({gashaponPrice:e.target.value})} value={this.state.gashaponPrice}/>
								</div>
							</div>
						</div>
					</div>
					<div className="py-5 row">
						<div className="col-sm-2"></div>
						<div className="col-sm-2">
							<button className="btn btn-outline-primary" type="button" onClick={this.submit}>Submit</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
