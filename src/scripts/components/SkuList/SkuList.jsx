import React, { Component } from 'react'
import {
	Col, Row, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar, DropdownButton, Checkbox, Tab, Tabs
} from 'react-bootstrap'
import { Link } from 'react-router'
import CDN from '../../widgets/cdn'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'
import DatePicker from 'react-datepicker'
import Request from 'superagent'
import PlayAutoSuggest from '../Common/PlayAutoSuggest'


export default class SkuList extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
			filter: '',

			id:'',
			quantity:100,
			price:9999,
			originPrice:0,
			merchant:'PLAY玩具控',
			tbUrl:'',
			freight:0,
			type:'inStock',
			prepay:0,
			orderClose:Moment(),
			costPrice:0,

			cover:'',
			company:'',
			name:'',
	  	}
		this.toggleRec = id => this.props.toggleRec(id)
		this.toggleBlk = id => this.props.toggleBlk(id)
		this.onChangeFilter = this._onChangeFilter.bind(this)
		this.editSku = this._editSku.bind(this)
		this.goPage = this._goPage.bind(this)
		this.deleteSku = (id,sid) => confirm('确定下架这个商品?') && this.props.deleteSku(id,sid)

		this.open = () => this.setState({ showModal: true })
		this.close = () => this.setState({
			showModal: false,
			id:'',
			quantity:100,
			price:9999,
			originPrice:0,
			costPrice:0,
			merchant:'PLAY玩具控',
			freight:0,
			costPrice:0,

			cover:'',
			company:'',
			name:'',
		})
		this.submit = () => {
			const {
				id,price,originPrice,merchant,quantity,freight, prepay, orderClose, type, costPrice
			} = this.state
			let data = {
				price:parseFloat(price),originPrice:parseFloat(originPrice),merchant,costPrice:parseFloat(costPrice),
				quantity:parseInt(quantity),freight:parseFloat(freight),preOrder:{
					prepay:parseFloat(prepay),
					orderClose:`${orderClose.format('YYYY-MM-DD')} 23:59:59`
				}
			}
			Object.keys(data).forEach(key => !data[key] ? delete data[key] : null)
			type ==='preOrder' ? null:delete data['preOrder']
			Request
			.post(`/api/toy/${id}/stock`)
			.send(data)
			.end((err,res) => {
				if(err) {
					console.warn(err)
				}else{
					this.close()
					alert('添加商品成功')
				}
			})
		}
		this.changeOrderClose = (date) => this.setState({orderClose:date})
	}
	componentWillMount() {
		const { page,filter } = this.props
		if(typeof page === 'number') {
			this.context.router.push(`/sku?page=${page}`)
			this.setState({filter})
		}else{
			this.props.getSku(this.props.location.query.page)
		}
	}
	_onChangeFilter(e) {
		this.setState({ filter: e.target.value },() => {
			this.context.router.push(`/sku?page=0`)
			this.props.getSkuBy(this.state.filter)
		})
	}
	_editSku(id,sid) {
		let path = `/sku/${id}/edit?sid=${sid}`
		this.context.router.push(path)
	}
	_goPage(page) {
		this.context.router.push(`/sku?page=${page}`)
		this.props.getSku(page)
	}
	render() {
		return(
			<div className="content">
				<div className="page-header">
					<Row>
						<Col sm={4}>
							<PlayAutoSuggest
								fetch={(o) => this.props.fetchToyByQuery(o.value)}
								clear={this.props.clearSuggestion}
								getValue={suggestion => suggestion.name}
								selectValue={(event,{suggestion, suggestionValue, method }) => {
									this.setState({
										id:suggestion.id,
										cover:suggestion.cover,
										company:suggestion.company,
										name:suggestion.name,
									},() => {
										this.open()
									})
								}}
								desc="release"
								placeholder="请输入玩具关键字"
								results={this.props.toyResults}
							/>
						</Col>
					</Row>
					
	          	</div>
				<div className="sku-container">
					<div className="sku-title">
						<div>
							<span>贩售价格</span>
							<span className="operate">
			                	<FormControl componentClass="select" placeholder="select" value={this.state.filter} onChange={this.onChangeFilter}>
			                  		<option value="">全部</option>
			                  		<option value="PLAY玩具控">PLAY玩具控</option>
									<option value="亿次元商城">亿次元商城</option>
									<option value="手办同萌会">手办同萌会</option>
									<option value="拆盒网">拆盒网</option>
									<option value="塑堂玩具">塑堂玩具</option>
			                	</FormControl>
				            </span>
							<span>库存数量</span>
							<span>运费</span>
							<span>上架时间</span>
							<span className="operate">操作</span>
						</div>
					</div>
				{
					this.props.skus.map((sku,index) => {
						if(!sku.stocks.length){
							return null
						}
						return (
							<div className="sku-box" key={`sku_${index}`}>
								<div className="sku-header">
									<div className="sku-img">
										<img className="img-thumbnail" src={sku.images[0] ? CDN.show(sku.images[0]):null} alt={sku.title}/>
									</div>
									<div className="sku-info">
										<h5>{sku.name}</h5>
									</div>
								</div>
								<div className="sku-body">
									{
										sku.stocks.map((stock,i) => {
											return(
												<div className="sku-body-box" key={`stock_${i}`}>
													<div className="sku-body-item vertical">
														<span>¥&nbsp;{stock.price}</span>
														{
															// stock.price !== stock.originPrice ?
															// <small>原价:¥&nbsp;{stock.originPrice}</small>
															// :null
														}
														{
															stock.costPrice ? 
															<small>进货价:¥&nbsp;{stock.costPrice}</small>
															:null
														}
													</div>													
													<div className="sku-body-item operate">{stock.merchant}</div>													
													<div className="sku-body-item">{stock.quantity}</div>													
													<div className="sku-body-item">¥&nbsp;{stock.freight}</div>													
													<div className="sku-body-item">{Moment(stock.created).format('MM-DD HH:mm')}</div>													
													<div className="sku-body-item operate">
										                <span onClick={() => this.editSku(sku.id,stock.stockId)}><i className="fa fa-edit"></i></span>
														<span >补款</span>
										                <span onClick={() => this.deleteSku(sku.id,stock.stockId)} >下架</span>
													</div>													
												</div>
											)
										})
									}
								</div>
							</div>

						)
					})
				}
				</div>
				<Row style={{textAlign:'center'}}>
	          		<ReactPaginate 
		          		previousLabel={<span>&laquo;</span>}
						nextLabel={<span>&raquo;</span>}
						breakLabel={<span>...</span>}
						breakClassName={"break-me"}
						pageNum={this.props.totalPages}
						marginPagesDisplayed={2}
						pageRangeDisplayed={5}
						clickCallback={obj => this.goPage(obj.selected)}
						containerClassName={"pagination"}
						subContainerClassName={"pages pagination"}
						forceSelected={this.props.location.query.page ? parseInt(this.props.location.query.page) : 0}
						activeClassName={"active"} />
	          	</Row>
	          	<Modal show={this.state.showModal} onHide={this.close}>
					<Modal.Header closeButton>
						<Modal.Title>添加商品</Modal.Title>
						<Row>
							<Col sm={2} className="sm-2-label">
								<img style={{width:'45px'}} src={this.state.cover} className="img-thumbnail"/>
							</Col>
							<Col sm={10}>
								<FormControl.Static>{this.state.name}</FormControl.Static>
							</Col>
						</Row>
						
					</Modal.Header>
					<Modal.Body>
						<Form horizontal>
							<FormGroup>
								<Col sm={2} className="sm-2-label">
									厂商
								</Col>
								<Col sm={10}>
									<FormControl.Static>{this.state.company}</FormControl.Static>
								</Col>
							</FormGroup>
							<FormGroup>
								<Col sm={2} className="sm-2-label">
									库存数量
								</Col>
								<Col sm={10}>
									<FormControl value={this.state.quantity} type="number" onChange={(e) => this.setState({quantity:e.target.value})}/>
								</Col>
							</FormGroup>
							<FormGroup>
								<Col sm={2} className="sm-2-label">
									购买类型
								</Col>
								<Col sm={10} style={{padding:'6px 15px'}}>
									<label>
								    	<input type="radio" name="type" value="inStock" onChange={(e) => this.setState({type:e.target.value})} defaultChecked/>现货
								  	</label>&nbsp;&nbsp;
								  	<label>
								    	<input type="radio" name="type" value="preOrder" onChange={(e) => this.setState({type:e.target.value})}/>预定
								  	</label>
								</Col>
							</FormGroup>
							{
								this.state.type === 'preOrder' ?
								<FormGroup>
									<Col sm={2} className="sm-2-label">
										定金
									</Col>
									<Col sm={10}>
										<FormControl value={this.state.prepay} type="number" onChange={(e) => this.setState({prepay:e.target.value})}/>
									</Col>
								</FormGroup>
								:null
							}
							{
								this.state.type === 'preOrder' ?
								<FormGroup>
									<Col sm={2} className="sm-2-label">
										截止时间
									</Col>
									<Col sm={10}	style={{padding:'6px 15px'}}>
											<DatePicker
											 selected={this.state.orderClose}
											 onChange={this.changeOrderClose}
											 minDate={Moment()}
											 dateFormat="YYYY/MM/DD"
										 />
									</Col>
								</FormGroup>
								:null
							}
							<FormGroup>
								<Col sm={2} className="sm-2-label">
									贩售价格
								</Col>
								<Col sm={10}>
									<FormControl value={this.state.price} type="number" onChange={(e) => this.setState({price:e.target.value})}/>
								</Col>
							</FormGroup>
							<FormGroup>
								<Col sm={2} className="sm-2-label">
									原价
								</Col>
								<Col sm={10}>
									<FormControl value={this.state.originPrice} type="number" onChange={(e) => this.setState({originPrice:e.target.value})}/>
								</Col>
							</FormGroup>
							<FormGroup>
								<Col sm={2} className="sm-2-label">
									进货成本价
								</Col>
								<Col sm={10}>
									<FormControl value={this.state.costPrice} type="number" onChange={(e) => this.setState({costPrice:e.target.value})}/>
								</Col>
							</FormGroup>
							<FormGroup>
								<Col sm={2} className="sm-2-label">
									运费
								</Col>
								<Col sm={10}>
									<FormControl value={this.state.freight} type="number" onChange={(e) => this.setState({freight:e.target.value})}/>
								</Col>
							</FormGroup>
							<FormGroup>
								<Col sm={2} className="sm-2-label">
									卖家
								</Col>
								<Col sm={10}>
									<FormControl componentClass="select" value={this.state.merchant} onChange={(e) => this.setState({merchant:e.target.value})}>
										<option value="PLAY玩具控">PLAY玩具控</option>
										<option value="亿次元商城">亿次元商城</option>
										<option value="手办同萌会">手办同萌会</option>
										<option value="拆盒网">拆盒网</option>
										<option value="塑堂玩具">塑堂玩具</option>
									</FormControl>
								</Col>
							</FormGroup>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close}>取消</Button>
						<Button bsStyle="primary" onClick={this.submit}>提交</Button>
					</Modal.Footer>
				</Modal>
			</div>

		)
	}
}

SkuList.contextTypes = {
  	router : React.PropTypes.object
}