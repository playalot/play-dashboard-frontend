import React, { Component } from 'react'
import {
	Col, Row, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar, DropdownButton, Checkbox, Tab, Tabs
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import CDN from '../../widgets/cdn'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'
import DatePicker from 'react-datepicker'
import Request from 'superagent'
import CopyToClipboard from 'react-copy-to-clipboard'
import { parsePage } from '../../widgets/parse'
const _ = require('lodash')


export default class SkuList extends Component{
	constructor(props) {
		super(props)
		this.state = {
			filter: '',
			filterType:'',
			query:'',

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
		this.search = this._search.bind(this)
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
		if(!this.props.toyLoaded){
			this.props.fetchToyClass()
		}
		const { page,filter,filterType,query } = this.props
		if(typeof page === 'number') {
			this.props.history.push(`/skus?page=${page}`)
			this.setState({filter,filterType,query})
		}else{
			this.props.history.push(`/skus?page=0`)
			this.props.getSku(0)
		}
	}
	_onChangeFilter(filter) {
		this.setState({ filter },() => {
			this.props.history.push(`/skus?page=0`)
			this.props.getSkuBy(this.state.filter,this.state.filterType,this.state.query)
		})
	}
	_onChangeFilterType(filterType) {
		this.setState({ filterType },() => {
			this.props.history.push(`/skus?page=0`)
			this.props.getSkuBy(this.state.filter,this.state.filterType,this.state.query)
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
	_search() {
		this.props.history.push(`/skus?page=0`)
		this.props.getSkuBy(this.state.filter,this.state.filterType,this.state.query)
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
			<div>
				<Row>
					<Col sm={4}>
						<FormGroup>
							<InputGroup>
								<FormControl value={this.state.query} onKeyDown={e => e.keyCode === 13 && this.search()} placeholder="输入商品关键字" onChange={(e) => this.setState({query:e.target.value})} type="text" />
								<InputGroup.Addon onClick={this.search} className="btn green">搜索</InputGroup.Addon>
							</InputGroup>
						</FormGroup>
					</Col>
				</Row>
				<div className="table-responsive skus-table">
					<table className="table table-bordered table-hover">
						<thead>
							<tr>
								<th colSpan={2}></th>
								<th> 版本 </th>
								<th> 售价 </th>
								<th> 库存 </th>
								<th style={{minWidth:60}}> 销量 <span className="fa fa-sort"></span></th>
								<th> 
									<div className="btn-group">
										<button type="button" className="btn green btn-sm btn-outline dropdown-toggle" data-toggle="dropdown">
											{this.state.filter ? this.state.filter : '所有商家'}
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
											
											<li><a onClick={() => this.onChangeFilter('H教授的玩具讲座')}>H教授的玩具讲座</a></li>
											<li><a onClick={() => this.onChangeFilter('鹤屋通贩')}>鹤屋通贩</a></li>
											<li><a onClick={() => this.onChangeFilter('电玩男の里屋')}>电玩男の里屋</a></li>
											<li><a onClick={() => this.onChangeFilter('万事屋手办店')}>万事屋手办店</a></li>
											<li><a onClick={() => this.onChangeFilter('塑料魂')}>塑料魂</a></li>
											<li><a onClick={() => this.onChangeFilter('刺猬挺')}>刺猬挺</a></li>
										</ul>
									</div>	 
								</th>
								<th> 
									<div className="btn-group">
										<button type="button" className="btn green btn-sm btn-outline dropdown-toggle" data-toggle="dropdown">
											{this.state.filterType ? (this.state.filterType === 'inStock' ? '现货':'预售') : '全部类型'}
										</button>
										<ul className="dropdown-menu">
											<li><a onClick={() => this.onChangeFilterType('')}>全部类型</a></li>
											<li><a onClick={() => this.onChangeFilterType('inStock')}>现货</a></li>
											<li><a onClick={() => this.onChangeFilterType('preOrder')}>预售</a></li>
										</ul>
									</div>
								</th>
								<th style={{minWidth:90}}> 上架日期 <span className="fa fa-sort"></span></th>
								<th style={{minWidth:90}}> 截单日期 <span className="fa fa-sort"></span></th>
								<th> 操作 </th>
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
						forcePage={parsePage(this.props.location.search)}
						activeClassName={"active"} />
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
						<a target="_blank" href={`http://www.playalot.cn/toy/${sku.id}`}><img style={{width:'100%'}} src={sku.images[0] ? CDN.show(sku.images[0]):null}/></a>
					</td>
				}
				{
					noRender ? null :
					<td rowSpan={total} style={{width:150}}> 
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
				<td style={{width:100}}>
					<span>{stock.version||'普通版'}</span>
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
				<td style={{width:100}}>
					<a onClick={() => this.props.setSelectedSku(sku)}>分类</a><br/>
					<Link to={`/sku/${sku.id}?sid=${stock.stockId}`}>修改</Link><br/>
					<a onClick={() => this.props.deleteSku(sku.id,stock.stockId)}>下架</a><br/>
					{stock.type === 'preOrder' ? <a onClick={() => this.props.fillMoney(sku.id,stock.stockId)}>开使补款</a> : ''}
				</td>
			</tr>
		)
	}
}