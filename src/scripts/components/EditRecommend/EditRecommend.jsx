import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import CDN from '../../widgets/cdn'
import { Modal, Button,Form, FormGroup, Col, FormControl, Row,Radio } from 'react-bootstrap'
import Request from 'superagent'
import PlayAutoSuggest from '../Common/PlayAutoSuggest'

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
			catalogs:[]
		}
		this.submit = this._submit.bind(this)
		this.onDropImage = this._onDropImage.bind(this)
	}
  componentDidMount() {
    Request
    .get(`/api/recommend/${this.props.match.params.id}`)
    .end((err,res) => {
      if(!err) {
        const { id,image,targetId,targetType,extra,title,type } = res.body
        this.setState({
          id:id||'',
          image:image||'',
          targetId:targetId||'',
          targetType:targetType||'page',
          extra:extra||'',
          title:title||' ',
          type:type||'banner'
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

    const { id,image,targetId,targetType,extra,title,type,catalogs } = this.state
    const data = {
      id,image,targetId,targetType,extra,title,type
    }
    Object.keys(data).forEach(key => !data[key] ? delete data[key] : null)
    if(targetType === 'catalog' && catalogs.length){
        let toyId = []
        catalogs.map((cat,i) => {
            toyId.push(cat.id)
        })
        data.toyId = toyId
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
			{value: 'theme', label: '主题'}
		];
		return (
			<div className="portlet bordered light">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject font-blue-sharp bold uppercase">Recommend编辑器</span>
					</div>
				</div>
				<div className="portlet-body py-5">
					<Form horizontal  onSubmit={(e) => e.preventDefault()}>
						<FormGroup>
							<Col className="control-label" sm={2}>上传封面</Col>
							<Col xs={6} sm={3}>
								<Dropzone accept="image/jpeg, image/png" onDrop={this.onDropImage} className="play-dropzone-style">
									<div>将图片拖入此区域</div>
								</Dropzone>
							</Col>
							<Col xs={6} sm={3}>
								{
									this.state.image !== '' ?
									<img style={{height:100,width:'auto'}} src={CDN.show(this.state.image)} />
									:null
								}
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={2} className="control-label">标题</Col>
							<Col sm={8}>
								<FormControl value={this.state.title} type="text" onChange={(e) => this.setState({title:e.target.value})}/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={2} className="control-label">描述</Col>
							<Col sm={8}>
								<FormControl value={this.state.description} type="text" onChange={(e) => this.setState({description:e.target.value})}/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={2} className="control-label">位置</Col>
							<Col sm={8}>
								{
									typeOptions.map((type,i) => {
										return(
											<Radio key={`type_${i}`} inline name="type" value={type.value} onChange={(e) => this.setState({type:e.target.value})}  checked={type.value == this.state.type}>{type.label}</Radio>
										)
									})
								}
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={2} className="control-label">目标类型</Col>
							<Col sm={8}>
								{
									radioOptions.map((targetType,i) => {
										return(
											<Radio key={`target_type_${i}`} inline name="targetType" value={targetType.value} onChange={(e) => this.setState({targetType:e.target.value})} checked={targetType.value == this.state.targetType}>{targetType.label}</Radio>
										)
									})
								}
							</Col>
						</FormGroup>
						{
							this.state.targetType === 'catalog' ?
							<FormGroup>
								<Col sm={2} className="control-label">
									商品ID
								</Col>
								<Col sm={8}>
									<div className="d-flex flex-column">
										{
											this.state.catalogs.map((cat,index) => {
												return (
													<div key={`catalog_${cat.id}`} className="d-flex p-2 justify-content-between align-items-center">
														<img style={{maxWidth:45}} src={cat.cover} alt=""/>
														<h5>{cat.name}</h5>
														<button type="button" onClick={ () => {
															let catalogs = this.state.catalogs
															catalogs.splice(index,1)
															this.setState({catalogs})
														}} className="btn btn-sm btn-danger btn-outline">删除</button>
													</div>
												)
											})
										}
									</div>
									<PlayAutoSuggest
										fetch={(o) => this.props.fetchSkuByQuery(o.value)}
										clear={this.props.clearSuggestion}
										getValue={suggestion => suggestion.name}
										selectValue={(event,{suggestion, suggestionValue, method }) => {
											this.state.catalogs.push(suggestion)
										}}
										desc="release"
										placeholder="请输入玩具关键字"
										results={this.props.skuResults}
									/>
								</Col>
							</FormGroup>
							:null
						}
						<br />
						<FormGroup>
							<Col sm={2} className="control-label">目标ID</Col>
							<Col sm={8}>
								<FormControl value={this.state.targetId} type="text" onChange={(e) => this.setState({targetId:e.target.value})}/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={2} className="control-label">附加(如url)</Col>
							<Col sm={8}>
							<FormControl value={this.state.extra} type="text" onChange={(e) => this.setState({extra:e.target.value})}/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={2} className="control-label">图片</Col>
							<Col sm={8}>
								<FormControl.Static>{this.state.image}</FormControl.Static>
							</Col>
						</FormGroup>
					</Form>
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
