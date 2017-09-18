import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import CDN from '../../widgets/cdn'
import Request from 'superagent'
import Select from 'react-select'
import PlayToyPanel from '../Common/PlayToyPanel'

export default class extends Component {
	constructor(props) {
		super(props)
		this.state = {
			image:'',
			id:'',
			title:'',
			type:'',
			description:'',
			targetId:'',
			targetType:'',
			extra:'',
			targetUrl:'',
			toyIds:[],
		}
		this.submit = this._submit.bind(this)
		this.onDropImage = this._onDropImage.bind(this)
		this.renderOption = (option) => {
			return (
				<div className="d-flex align-items-center">
					<img style={{width:40,height:40,borderRadius:5}} className="play-img-cover" src={CDN.show(option.cover)} alt={option.name}/>
					<span className="pl-3">{option.name}</span>
				</div>
			)
		}
	}
	componentDidMount() {
		Request
		.get(`/api/recommend/${this.props.match.params.id}`)
		.end((err,res) => {
			if(!err) {
				const { id,image,targetId,targetType,extra,title,type,toyIds } = res.body
				this.setState({
					id:id||'',
					image:image||'',
					targetId:targetId||'',
					targetType:targetType||'page',
					extra:extra||'',
					title:title||' ',
					type:type||'banner',
					toyIds:toyIds||[]
				})
			}
		})
	}
  _onDropImage(images) {
    let formData = new FormData()
    formData.append('file', images[0])
    $.ajax({
      url: `/api/upload?key=recommend_${this.props.match.params.id+Date.now()}.jpg&temp=false`,
      type: 'POST',
      data: formData,
      processData: false, // tell jQuery not to process the data
      contentType: false, // tell jQuery not to set contentType
      success: (data) => {
        this.setState({
          image: data
        })
      }
    })
  }
  _submit() {
    const { id,image,targetId,targetType,extra,title,type,toyIds,description } = this.state
    const data = {
      id,image,targetId,targetType,extra,type,description
    }
    Object.keys(data).forEach(key => !data[key] ? delete data[key] : null)
		data.title= title
    if(targetType === 'catalog' && toyIds.length){
			let ids = []
			toyIds.map((id) => id && ids.push(id))
			data.toyIds = ids
    }
    Request
    .post(`/api/recommend/${this.props.match.params.id}`)
    .send(data)
    .end((err,res) =>{
      if(!err){
        if(confirm('保存成功')){
          this.props.history.push('/explorepage')
        }
      }
    })
	}
	getOptions(input) {
		if (!input) {
			return Promise.resolve({ options: [] })
		}
		if ( input.length == 24) {
			return Request
			.get(`/api/toy/${input}`)
			.then(res => {
				return {options: [res.body]}
			})
		}
		return Request
		.get(`/api/toys`)
		.query({query:input})
		.then(res => {
			return {options: res.body.toys}
		})
	}
  render() {
    const radioOptions = [
        {value: 'post', label: '图片'},
        {value: 'tag', label: '标签'},
        {value: 'user', label: '用户'},
        {value: 'url', label: 'URL链接'},
        {value: 'page', label: '文章'},
        {value: 'toy', label: '玩具'},
        {value: 'question', label: '问题'},
        {value: 'answer', label: '回答'},
        {value: 'catalog', label: '商品集'},
        {value: 'toyindex', label: '玩具集'},
    ]
    const typeOptions = [
        {value: 'banner', label: '发现页面Banner'},
        {value: 'toy', label: '玩具商品页面Banner'},
        {value: 'home', label: '首页推荐'},
        {value: 'theme', label: '发现页主题推荐'},
		{value: 'draft', label: '草稿'}
    ]
    return (
			<div className="portlet bordered light">
				<div className="portlet-title">
					<div className="caption">
						<span className="text-primary">推荐编辑器</span>
					</div>
				</div>
				<div className="portlet-body form py-5">
					<form onSubmit={(e) => e.preventDefault()}>
						<div className="form-group row">
							<label className="col-sm-2 col-form-label">上传封面</label>
							<div className="col-6 col-sm-3">
								<Dropzone accept="image/jpeg, image/png" onDrop={this.onDropImage} className="play-dropzone-style">
									<div>将图片拖入此区域</div>
								</Dropzone>
							</div>
							<div className="col-6 col-sm-3">
								{
									this.state.image !== '' ?
									<img style={{height:100,width:'auto'}} src={CDN.show(this.state.image)} />
									:null
								}
							</div>
						</div>
						<div className="form-group row">
							<label className="col-sm-2 col-form-label">标题(必填)</label>
							<div className="col-sm-8">
								<input className="form-control" value={this.state.title} type="text" onChange={(e) => this.setState({title:e.target.value})}/>
							</div>
						</div>
						<div className="form-group row">
							<label className="col-sm-2 col-form-label">位置</label>
							<div className="col-sm-8 my-auto">
								{
									typeOptions.map((type,i) => {
										return(
											<label key={`type_${i}`} className="form-check-label mx-1">
												<input  className="form-check-input" type="radio" checked={type.value == this.state.type} value={type.value} onChange={(e) => this.setState({type:e.target.value})}/>
												{type.label}
											</label>
										)
									})
								}
							</div>
						</div>
						<div className="form-group row">
							<label className="col-sm-2 col-form-label">目标类型</label>
							<div className="col-sm-8 my-auto">
								{
									radioOptions.map((targetType,i) => {
										return(
											<label key={`target_type_${i}`} className="form-check-label mx-1">
												<input  className="form-check-input" type="radio" value={targetType.value} onChange={(e) => this.setState({targetType:e.target.value})} checked={targetType.value == this.state.targetType}/>
												{targetType.label}
											</label>
										)
									})
								}
							</div>
						</div>
	
						{
							this.state.targetType === 'catalog' ?
							<div className="form-group row">
								<label className="col-sm-2 col-form-label">商品</label>
					
								<div className="col-sm-8">
									<div className="d-flex flex-column">
										{
											this.state.toyIds.map((id,index) => {
												if(id){
													return(
														<PlayToyPanel tid={id} key={`play-toy-list-${id}_${index}`}>
															<button type="button" onClick={() => {
																let toyIds = this.state.toyIds
																toyIds[index] = null
																this.setState({toyIds})
															}} className="btn btn-sm btn-outline-danger">删除</button>
														</PlayToyPanel>
													)
												}
											})
										}
									</div>
									<div>
										<Select.Async 
											value={this.state.toyName} 
											onChange={v => {
												this.setState({toyName:v})
												if(v){
													const ids = this.state.toyIds
													ids.push(v.id)
													this.setState({toyIds:ids})
												}
											}}
											valueKey="id" 
											labelKey="name" 
											loadOptions={this.getOptions}  
											optionRenderer={this.renderOption}
											placeholder="请输入玩具关键字/玩具ID"
										/>
									</div>
								</div>
							</div>
							:null
						}
						<br />
						<div className="form-group row">
							<label className="col-sm-2 col-form-label">目标ID</label>
							<div className="col-sm-8">
								<input className="form-control" value={this.state.targetId} type="text" onChange={(e) => this.setState({targetId:e.target.value})}/>
							</div>
						</div>
						<div className="form-group row">
							<label className="col-sm-2 col-form-label">附加(如url)</label>
							<div className="col-sm-8">
								<input className="form-control" value={this.state.extra} type="text" onChange={(e) => this.setState({extra:e.target.value})}/>
							</div>
						</div>
						<div className="form-group row">
							<label className="col-sm-2 col-form-label">图片</label>
							<div className="col-sm-8 my-auto">
								<span>{this.state.image}</span>
							</div>
						</div>
						
			
					</form>
					<div className="row">
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
