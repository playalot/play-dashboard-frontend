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
import CopyToClipboard from 'react-copy-to-clipboard'
const _ = require('lodash')


export default class SkuList extends Component{
	constructor(props) {
		super(props)
		this.state = {
			filter: '',
			filterType:'',

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

			selectedSku:null
		}
		this.toggleRec = id => this.props.toggleRec(id)
		this.toggleBlk = id => this.props.toggleBlk(id)
		this.onChangeFilter = this._onChangeFilter.bind(this)
		this.onChangeFilterType = this._onChangeFilterType.bind(this)
		this.editSku = this._editSku.bind(this)
		this.goPage = this._goPage.bind(this)
		this.fillMoney = this._fillMoney.bind(this)
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
		this.closeClass = () => this.setState({ selectedSku: null })
		this.addToyClass = (tid,c) => this._addToyClass(tid,c)
	  	this.removeToyClass = (tid,c) => this._removeToyClass(tid,c)
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
		const { page,filter,filterType } = this.props
		if(typeof page === 'number') {
			this.context.router.push(`/sku?page=${page}`)
			this.setState({filter,filterType})
		}else{
			this.props.getSku(this.props.location.query.page)
		}
		if(!this.props.toyLoaded){
			this.props.fetchToyClass()
		}
	}
	_onChangeFilter(filter) {
		this.setState({ filter },() => {
			this.context.router.push(`/sku?page=0`)
			this.props.getSkuBy(this.state.filter,this.state.filterType)
		})
	}
	_onChangeFilterType(filterType) {
		this.setState({ filterType },() => {
			this.context.router.push(`/sku?page=0`)
			this.props.getSkuBy(this.state.filter,this.state.filterType)
		})
	}
	_fillMoney(id,sid) {
		if(confirm('确认补款吗?')){
			console.info(`补款id${id},sid${sid}`)
		}else{
			console.info('取消操作')
		}
	}
	_editSku(id,sid) {
		let path = `/sku/${id}/edit?sid=${sid}`
		this.context.router.push(path)
	}
	_goPage(page) {
		this.context.router.push(`/sku?page=${page}`)
		this.props.getSku(page)
	}
	_addToyClass(tid,c) {
		this.state.selectedSku.cls.push(c)
		this.props.addToyClass(tid,c)
	}
	_removeToyClass(tid,c) {
		let index = this.state.selectedSku.cls.indexOf(c)
		index !== -1 ? this.state.selectedSku.cls.splice(index,1) : null
		this.props.removeToyClass(tid,c)
	}
	render() {
		let modal = (<div></div>)
	    if (this.state.selectedSku !== null) {
	      	let cls = _.filter(this.props.toyClass,(c) => {
	        	return this.state.selectedSku.cls.indexOf(c.id) === -1
	      	})
	      	modal = (
		        <div>
		         	<Modal className='modal-container' animation={false} show={true} onHide={this.closeClass}>
			           <Modal.Body>
			             	<strong>已选类别</strong>
			             	<div>
				               	{
				               		this.state.selectedSku.cls.map((c,i) => {
					                 	return (
					                 		<span key={`sku_toy_class_selected_${i}`}
						                 		onClick={ () => this.removeToyClass( this.state.selectedSku.id, c) }
						                 		className="label label-warning label-margin" >{this.props.toyClass[c].name || ''}</span>
					                 	)
					               	})
				               	}
			             	</div>
			             	<strong>全部类别</strong>
				            <div>
					            {
					             	cls.map((c,i) => {
					             		return (
					             			<span key={`sku_toy_class_no_sel_${i}`}
					             			className='label label-info label-margin'
					             			onClick={() => this.addToyClass(this.state.selectedSku.id, c.id) }>{c.name}</span>
					             		)
					             	})
					            }
				            </div>
			           	</Modal.Body>
		         	</Modal>
		       	</div>
	     	)
	    }
		return(
			<div className="content" style={{backgroundColor:'#fff'}}>
				<div className="page-header">
					<Button onClick={() => this.context.router.push(`/toy`)}>添加玩具库存</Button>
				</div>
				<div className="sku-container">
					<div className="sku-title">
						<div className="sku-title-box">
							<div className="sku-title-name">版本</div>
							<div className="sku-title-name">售价</div>
							<div className="sku-title-name">库存</div>
							<div className="operate sku-title-name">
								<div className="btn-group">
								  <button type="button" className="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
								    {this.state.filter ? this.state.filter : '所有商家'}&nbsp;<span className="caret"></span>
								  </button>
								  <ul className="dropdown-menu">
								    <li><a onClick={() => this.onChangeFilter('')}>所有商家</a></li>
								    <li><a onClick={() => this.onChangeFilter('PLAY玩具控')}>PLAY玩具控</a></li>
								    <li><a onClick={() => this.onChangeFilter('PLAY玩具控(上海)')}>PLAY玩具控(上海)</a></li>
								    <li><a onClick={() => this.onChangeFilter('亿次元商城')}>亿次元商城</a></li>
								    <li><a onClick={() => this.onChangeFilter('手办同萌会')}>手办同萌会</a></li>
								    <li><a onClick={() => this.onChangeFilter('拆盒网')}>拆盒网</a></li>
								    <li><a onClick={() => this.onChangeFilter('塑唐玩具')}>塑唐玩具</a></li>
								    <li><a onClick={() => this.onChangeFilter('六部口模型')}>六部口模型</a></li>
								    <li><a onClick={() => this.onChangeFilter('HobbyMax官方店')}>HobbyMax官方店</a></li>
								  </ul>
								</div>
				            </div>
				            <div className="operate sku-title-name">
			            		<div className="btn-group">
								  <button type="button" className="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
								    {this.state.filterType ? (this.state.filterType === 'inStock' ? '现货':'预售') : '全部类型'}&nbsp;<span className="caret"></span>
								  </button>
								  <ul className="dropdown-menu">
								    <li><a onClick={() => this.onChangeFilterType('')}>全部类型</a></li>
								    <li><a onClick={() => this.onChangeFilterType('inStock')}>现货</a></li>
								    <li><a onClick={() => this.onChangeFilterType('preOrder')}>预售</a></li>
								  </ul>
								</div>
				            </div>
							<div className="sku-title-name">上架日期</div>
							<div className="operate sku-title-name">操作</div>
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
											<a target="_blank" href={`http://www.playalot.cn/toy/${sku.id}`}><img style={{maxWidth:'60px'}} src={sku.images[0] ? CDN.show(sku.images[0]):null} alt={sku.title}/></a>
										</div>
										<div className="sku-info">
											<h5>{sku.name}</h5>
											<div style={{textAlign:'left'}}>
												{
													sku.cls.map((c,i) => {
									            		return (
									            			<span key={`sku_toy_class_${sku.id}_${i}` }
					                 						className="label label-primary label-margin" >{this.props.toyClass[c].name}</span>
									            		)
									            	})
												}
											</div>
											<div style={{marginTop:5}}>
												<span onClick={() => this.setState({selectedSku:sku})} className="btn btn-sm"><i className="fa fa-th-large"></i></span>
												<div className="btn-group">
												  <button type="button" className="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
												    其他&nbsp;<span className="caret"></span>
												  </button>
												  <ul className="dropdown-menu">
												    <li><Link to={`/toy/${sku.id}/orders`}>全部订单</Link></li>
												    <li>
												    	<CopyToClipboard text={`http://www.playalot.cn/toy/${sku.id}`}
												          	onCopy={() => null}>
												          	<a>复制链接</a>
												        </CopyToClipboard>
												    </li>
												  </ul>
												</div>
											</div>
										</div>
									</div>
								<div className="sku-body">
									{
										sku.stocks.map((stock,i) => {
											return(
												<div className="sku-body-box" key={`stock_${i}`}>
													<div className="sku-body-item">
														<span className="label label-success">{stock.version||'普通版'}</span>
													</div>
													<div className="sku-body-item vertical">
														<span><strong>¥&nbsp;{stock.price}</strong></span>
														<small>运费:¥&nbsp;{stock.freight}</small>
													</div>	
													<div className="sku-body-item vertical">
														<span>剩余:&nbsp;{stock.quantity}件</span>
														<small>已售:&nbsp;{stock.sold}件</small>
													</div>													
													<div className="sku-body-item operate">{stock.merchant}</div>													
													<div className="sku-body-item operate">
														{
															stock.type === 'preOrder' ? 
															<span className="label label-warning">{stock.tbUrl ? `淘宝`:``}预售</span> : 
															<span className="label label-info">{stock.tbUrl ? `淘宝`:``}现货</span>
														}
													</div>													
													<div className="sku-body-item vertical"><span><strong>{Moment(stock.created).format('MM-DD')}</strong></span><small>{Moment(stock.created).format('HH:mm')}</small>{ stock.type === 'preOrder' ? <span><small>(截单{Moment(stock.preOrder.orderClose).format('MM-DD')})</small></span> : null }</div>													
													<div className="sku-body-item operate">
														<a onClick={() => this.editSku(sku.id,stock.stockId)}>修改</a>&nbsp;/&nbsp;
														{stock.type === 'preOrder' ? <a onClick={() => this.fillMoney(sku.id,stock.stockId)}>开使补款</a> : ''}&nbsp;/&nbsp;
														<a onClick={() => this.deleteSku(sku.id,stock.stockId)}>下架</a>
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
						pageCount={this.props.totalPages}
						marginPagesDisplayed={2}
						pageRangeDisplayed={5}
						onPageChange={obj => this.goPage(obj.selected)}
						containerClassName={"pagination"}
						subContainerClassName={"pages pagination"}
						forcePage={this.props.location.query.page ? parseInt(this.props.location.query.page) : 0}
						activeClassName={"active"} />
					</Row>
					{modal}
				</div>

			)
		}
	}

	SkuList.contextTypes = {
		router : React.PropTypes.object
	}
