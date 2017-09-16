import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {Row, Button, FormControl,Form, FormGroup,InputGroup } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Moment from 'moment'
import parse,{ parsePage } from '../../widgets/parse'
import { MERCHANTS } from '../../widgets/constant'

import OrderPanel from '../OrderPanel'
export default class OrderList extends Component{
	constructor(props) {
		super(props)
		this.state = {
			status:'',
			merchant:'',
			year:'',
			month:'',
			filter:'',
		}
		this.goPage = this._goPage.bind(this)
		this.search = this._search.bind(this)
		this.onChangeYear= (e) => this.setState({year:e.target.value},this.search)
		this.onChangeMonth = (e) => this.setState({month:e.target.value},this.search)
		this.onChangeFilter = (e) => this.setState({filter:e.target.value})
	}
	componentWillMount() {
		const { page,status,merchant,year,month,filter } = this.props
		if(typeof page === 'number') {
			let path = `/orders?page=${page}`
			path += status ? `&status=${status}` : ``
			path += merchant ? `&merchant=${merchant}` : ``
			this.props.history.push(path)
			this.setState({status,merchant,year,month,filter})
		}else{
			const ppage = parsePage(this.props.location.search)
			const pstatus = parse(this.props.location.search).status || ''
			const pmerchant = parse(this.props.location.search).merchant || ''
			this.setState({
				status:pstatus,merchant:pmerchant
			},() => {
				this.goPage(ppage)
			})
		}
	}
	_goPage(page) {
		let { status, merchant,year,month,filter } = this.state
		let path = `/orders?page=${page}`
		path += status ? `&status=${status}` : ``
		path += merchant ? `&merchant=${merchant}` : ``
		this.props.history.push(path)
		this.props.getOrder(page,status,merchant,year,month,filter)
	}
	_search() {
		let { status,merchant,year,month,filter } = this.state
		let path = `/orders?page=${0}`
		path += status ? `&status=${status}` : ``
		path += merchant ? `&merchant=${merchant}` : ``
		this.props.history.push(path)
		this.props.getOrder(0,status,merchant,year,month,filter)
	}
	render() {
		const { year,month,status } = this.state
		return(
			<div className="m-content">
				<div className="m-portlet m-portlet--mobile m-portlet--tabs">
					<div className="m-portlet__head">
						<div className="m-portlet__head-tools">
							<ul className="nav nav-tabs m-tabs-line m-tabs-line--left m-tabs-line--primary m-tabs-line--2x" role="tablist">
								<li className="nav-item m-tabs__item">
									<a className={`nav-link m-tabs__link ${status === '' ? 'active':''}`} data-toggle="tab" role="tab" onClick={()=> this.setState({status:''}, this.search)}>
										全部
									</a>
								</li>
								<li className="nav-item m-tabs__item">
									<a className={`nav-link m-tabs__link ${status === 'prepaid' ? 'active':''}`} data-toggle="tab" role="tab" onClick={()=> this.setState({status:'prepaid'},this.search)}>
										已预订
									</a>
								</li>
								<li className="nav-item m-tabs__item">
									<a className={`nav-link m-tabs__link ${status === 'due' ? 'active':''}`} data-toggle="tab" role="tab" onClick={()=> this.setState({status:'due'},this.search)}>
										待补款
									</a>
								</li>
								<li className="nav-item m-tabs__item">
									<a className={`nav-link m-tabs__link ${status === 'paid' ? 'active':''}`} data-toggle="tab" role="tab" onClick={()=> this.setState({status:'paid'},this.search)}>
										已支付
									</a>
								</li>
								<li className="nav-item m-tabs__item">
									<a className={`nav-link m-tabs__link ${status === 'done' ? 'active':''}`} data-toggle="tab" role="tab" onClick={()=> this.setState({status:'done'},this.search)}>
										已完成
									</a>
								</li>
							</ul>
							<ul className="m-portlet__nav" style={{textAlign:"left"}}>
								<div className="form-group m-portlet__nav-item ">
									<span className="input-group">
										<input type="text" placeholder="请输入搜索关键字" value={this.state.filter} className="form-control" onChange={this.onChangeFilter}/>
										<span className="input-group-btn"><button type="button" className="btn btn-default" onClick={this.search}>搜索</button></span>
									</span>
								</div>
							</ul>
							<ul className="m-portlet__nav" style={{textAlign:"left"}}>
								<div className="form-group m-portlet__nav-item ">
									<select className="form-control" value={month} onChange={this.onChangeMonth}>
										<option value="">全部月份</option>
										<option value="1">1月</option>
										<option value="2">2月</option>
										<option value="3">3月</option>
										<option value="4">4月</option>
										<option value="5">5月</option>
										<option value="6">6月</option>
										<option value="7">7月</option>
										<option value="8">8月</option>
										<option value="9">9月</option>
										<option value="10">10月</option>
										<option value="11">11月</option>
										<option value="12">12月</option>
									</select>
								</div>
							</ul>
							<ul className="m-portlet__nav">
								<div className="form-group m-portlet__nav-item ">
									<select className="form-control" value={year} onChange={this.onChangeYear}>
										<option value="">全部年份</option>
										<option value="2017">2017年</option>
										<option value="2016">2016年</option>
										<option value="2015">2015年</option>
										<option value="2014">2014年</option>
										<option value="2013">2013年</option>
										<option value="2012">2012年</option>
									</select>
								</div>
							</ul>
							<ul className="m-portlet__nav">
								<div className="form-group m-portlet__nav-item ">
									<select className="form-control" value={this.state.merchant} onChange={(e) => this.setState({merchant:e.target.value},this.search)}>
										<option value="">所有商家</option>
										{
											MERCHANTS.map((m,i) => <option key={`order-list-${m}`} value={m}>{m}</option>)
										}
									</select>
								</div>
							</ul>
						</div>
					</div>
					<div className="m-portlet__body">
						<div className="alert m-alert--default">
							<strong>
								{year ? `${year}年`:''}
								{month ? `${month}月`:''}&nbsp;
								一共<strong>{this.props.summary.count}</strong>笔&nbsp;
								{(() => {
									switch(status) {
										case 'open' :
										return (<small><span className="label label-default">等待买家付款</span></small>)
										case 'paid' :
										return (<small><span className="label label-success">已支付全款</span></small>)
										case 'prepaid' :
										return (<small><span className="label label-primary">已支付定金</span></small>)
										case 'due' :
										return (<small><span className="label label-danger">等待买家补款</span></small>)
										case 'closed' :
										return (<small><span className="label label-default">已关闭</span></small>)
										case 'done' :
										return (<small><span className="label label-info">已完成</span></small>)
										default :
										return (<small><span className="label label-default">全部</span></small>)
									}
								})()}
								&nbsp;订单，
								总计<strong>{this.props.summary.totalPrice}</strong>元
							</strong>
						</div>
							<OrderPanel/>
							<ReactPaginate
								previousLabel={<span>&laquo;</span>}
								nextLabel={<span>&raquo;</span>}
								breakLabel={<a>...</a>}
								breakClassName={"break-me"}
								pageCount={this.props.totalPages}
								marginPagesDisplayed={2}
								pageRangeDisplayed={5}
								onPageChange={obj => this.goPage(obj.selected)}
								containerClassName={"pagination"}
								subContainerClassName={"pages pagination"}
								forcePage={parsePage(this.props.location.search)}
								activeClassName={"active"} />
						</div>
					</div>
				</div>
			)
		}
	}
