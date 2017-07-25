import React, { Component } from 'react'
import {
	Col, Row, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar, DropdownButton, Checkbox
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import CDN from '../../widgets/cdn'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'
import DatePicker from 'react-datepicker'
import Request from 'superagent'
import CopyToClipboard from 'react-copy-to-clipboard'
import { parsePage } from '../../widgets/parse'
import { MERCHANTS } from '../../widgets/constant'
const _ = require('lodash')


export default class SkuList extends Component{
	constructor(props) {
		super(props)
		this.state = {
			merchant:'',
			type:'',
			query:'',
			selectedSku:null,
			orderBy:'created',//'preOrder.orderClose' 'sold'
			asc:false,
		}
		this.onChangeMerchant = (merchant) => this.setState({merchant},this.search)
		this.onChangeType = (type) => this.setState({type},this.search)
		this.goPage = this._goPage.bind(this)
		this.search = this._search.bind(this)
		this.fillMoney = this._fillMoney.bind(this)
		this.deleteSku = (id,sid) => confirm('确定下架这个商品?') && this.props.deleteSku(id,sid)

		this.closeClass = () => this.setState({ selectedSku: null })
		this.addToyClass = (tid,c) => this._addToyClass(tid,c)
	  	this.removeToyClass = (tid,c) => this._removeToyClass(tid,c)
		this.changeOrderClose = (date) => this.setState({orderClose:date})

		this.sortBy = this._sortBy.bind(this)
	}
	componentWillMount() {
		if(!this.props.toyLoaded){
			this.props.fetchToyClass()
		}
		const { page,merchant,type,query,orderBy,asc } = this.props
		if(typeof page === 'number') {
			this.props.history.push(`/skus?page=${page}`)
			this.setState({merchant,type,query,orderBy,asc})
		}else{
			const ppage = parsePage(this.props.location.search)
			this.goPage(ppage)
		}
	}
	_fillMoney(id,sid) {
		if(confirm('确认补款吗?')){
			console.info(`补款id${id},sid${sid}`)
		}else{
			console.info('取消操作')
		}
	}
	_sortBy(str) {
		const { orderBy,asc } = this.state
		if(str == orderBy){
			this.setState({asc:!asc},this.search)
		}else{
			this.setState({orderBy:str,asc:false},this.search)
		}

	}
	_search() {
		const { merchant,type,query,orderBy,asc } = this.state
		this.props.history.push(`/skus?page=0`)
		this.props.getSkuBy(merchant,type,query,orderBy,asc)
	}
	_goPage(page) {
		this.props.history.push(`/skus?page=${page}`)
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
		         	<Modal className='modal-container' animation={true} show={true} onHide={this.closeClass}>
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
		const { orderBy,asc } = this.state
		return(
			<div>
				<div style={{minHeight:500}} className="table-responsive skus-table">
					<table className="table table-bordered table-hover">
						<thead>
							<tr>
								<th colSpan={2}>
									<FormGroup className="mb-0">
										<InputGroup>
											<FormControl value={this.state.query} onKeyDown={e => e.keyCode === 13 && this.search()} placeholder="输入商品关键字" onChange={(e) => this.setState({query:e.target.value})} type="text" />
											<InputGroup.Addon onClick={this.search} className="btn green">搜索</InputGroup.Addon>
										</InputGroup>
									</FormGroup>
								</th>
								<th> 版本 </th>
								<th> 备注 </th>
								<th> 售价 </th>
								<th> 库存 </th>
								<th onClick={() => this.sortBy('sold')} style={{minWidth:60}}> 销量 <span className={`fa ${orderBy == 'sold' ? ( asc ? 'font-purple fa-sort-up' : 'font-purple fa-sort-down' ):'fa-sort font-grey'}`}></span></th>
								<th>
									<div className="btn-group">
										<button type="button" className="btn green btn-sm btn-outline dropdown-toggle" data-toggle="dropdown">
											{this.state.merchant ? this.state.merchant : '所有商家'}
											&nbsp;
											<span className="fa fa-angle-down"></span>
										</button>
										<ul className="dropdown-menu">
											<li><a onClick={() => this.onChangeMerchant('')}>所有商家</a></li>
											{MERCHANTS.map(m => <li key={`sku-list-${m}`}><a onClick={() => this.onChangeMerchant(m)}>{m}</a></li>)}
										</ul>
									</div>
								</th>
								<th>
									<div className="btn-group">
										<button type="button" className="btn green btn-sm btn-outline dropdown-toggle" data-toggle="dropdown">
											{this.state.type ? (this.state.type === 'inStock' ? '现货':'预售') : '全部类型'}
											&nbsp;
											<span className="fa fa-angle-down"></span>
										</button>
										<ul className="dropdown-menu">
											<li><a onClick={() => this.onChangeType('')}>全部类型</a></li>
											<li><a onClick={() => this.onChangeType('inStock')}>现货</a></li>
											<li><a onClick={() => this.onChangeType('preOrder')}>预售</a></li>
										</ul>
									</div>
								</th>
								<th onClick={() => this.sortBy('created')} style={{minWidth:90}}> 上架日期 <span className={`fa ${orderBy == 'created' ? ( asc ? 'font-purple fa-sort-up' : 'font-purple fa-sort-down' ):'fa-sort font-grey'}`}></span></th>
								<th onClick={() => this.sortBy('preOrder.orderClose')} style={{minWidth:90}}> 截单日期 <span className={`fa ${orderBy == 'preOrder.orderClose' ? ( asc ? 'font-purple fa-sort-up' : 'font-purple fa-sort-down' ):'fa-sort font-grey'}`}></span></th>
								<th style={{minWidth:150}}> 操作 </th>
							</tr>
						</thead>
						<tbody>
							{
								this.props.skus.map((sku,i) => {
									if(sku.stocks.length === 1){
										return <SkuTr deleteSku={(id,sid) => this.deleteSku(id,sid)} fillMoney={(id,sid) => this.fillMoney(id,sid)}  toyClass={this.props.toyClass} setSelectedSku={(sku) => this.setState({selectedSku:sku})} key={`sku_${sku.id}`} sku={sku} total={1} stock={sku.stocks[0]} ></SkuTr>
									}else{
										return sku.stocks.map((stock,i) => {
											return <SkuTr deleteSku={(id,sid) => this.deleteSku(id,sid)} fillMoney={(id,sid) => this.fillMoney(id,sid)}  toyClass={this.props.toyClass} setSelectedSku={(sku) => this.setState({selectedSku:sku})} key={`sku_${sku.id}_${i}`} noRender={i!==0} sku={sku} total={sku.stocks.length} stock={sku.stocks[i]} ></SkuTr>
										})
									}
								})
							}
						</tbody>
					</table>
				</div>
				<Row className="text-center">
					<ReactPaginate
						previousLabel={<span>&laquo;</span>}
						nextLabel={<span>&raquo;</span>}
						breakLabel={<span>...</span>}
						breakClassName={"break-me"}
						pageCount={this.props.totalPages}
						marginPagesDisplayed={2}
						pageRangeDisplayed={5}
						onPageChange={obj => this.goPage(obj.selected)}
						containerClassName={"pagination mb-3 mt-0"}
						subContainerClassName={"pages pagination"}
						forcePage={parsePage(this.props.location.search)}
						activeClassName={"active"}
					/>
				</Row>
				{modal}
			</div>

		)
	}
}


class SkuTr extends Component {
	render() {
		const { sku,total,stock,noRender } = this.props
		return(
			<tr>
				{
					noRender ? null :
					<td rowSpan={total} style={{width:100}}>
						<a target="_blank" href={`http://www.playalot.cn/toy/${sku.id}`}><img style={{width:'100%'}} src={sku.cover}/></a>
					</td>
				}
				{
					noRender ? null :
					<td rowSpan={total}  style={{width:150}}>
						<span>{sku.name}</span>
						<div>
							{
								sku.cls.map((c,i) => {
									return (
										<span key={`sku_toy_cls_${sku.id}_${i}` }
										className="label label-primary label-margin" >{this.props.toyClass[c].name}</span>
									)
								})
							}
						</div>
					</td>
				}
				<td>
					<span>
						{stock.version||'普通版'}
						{
							stock.tbUrl ?
							<a href={stock.tbUrl}>
								<span style={{fontSize:16}} className="fa fa-drupal"></span>
							</a>
							:null
						}
						
					</span>
				</td>
				<td>
					<span>{stock.note || ''}</span>
				</td>
				<td>
					<span>¥ {stock.price}</span>
					<br/>
					<span>运费:¥ {stock.freight}</span>
				</td>
				<td>
					<span>{stock.quantity}件</span>
				</td>
				<td>
					<span>{stock.sold}件</span>
				</td>
				<td>
					<span>{stock.merchant}</span>
				</td>
				<td>
					{
						stock.type === 'preOrder' ?
						<span className="label label-warning label-margin">
							预售
						</span> :
						<span className="label label-info label-margin">现货</span>
					}
					<br/>
					{
						stock.type === 'preOrder' && stock.preOrder.orderClose < Date.now() ?
						<span className="label label-danger  label-margin">已结单</span>
						:null
					}
				</td>
				<td>
					<span>{Moment(stock.created).format('MM-DD')}</span><br/>
					<small>{Moment(stock.created).format('HH:mm')}</small>
				</td>
				<td>
					{
						stock.type === 'preOrder' ?
						<span>
							<small>{Moment(stock.preOrder.orderClose).format('MM-DD')}</small><br/>
							<small>{Moment(stock.preOrder.orderClose).format('HH:mm')}</small>
						</span>
						: null
					}
				</td>
				<td>
					<Link className="btn dark btn-outline btn-sm" to={`/sku/${sku.id}?sid=${stock.stockId}`}>修改</Link>
					<div className="btn-group">
						<button type="button" className="btn dark btn-sm btn-outline dropdown-toggle" data-toggle="dropdown">
							更多 <span className="fa fa-angle-down"></span>
						</button>
						<ul className="dropdown-menu pull-right">
							<li><a onClick={() => this.props.setSelectedSku(sku)}>分类</a></li>
							<li><Link to={`/order/toy/${sku.id}`}>全部订单</Link></li>
							<li className="divider"></li>
							<li><a onClick={() => this.props.deleteSku(sku.id,stock.stockId)}>下架</a></li>
						</ul>
					</div>
					{
						//stock.type === 'preOrder' ? <a className="d-inline-block p-1" onClick={() => this.props.fillMoney(sku.id,stock.stockId)}>开使补款</a> : ''
					}
				</td>
			</tr>
		)
	}
}
