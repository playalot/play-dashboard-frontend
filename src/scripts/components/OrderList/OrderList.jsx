import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {Row, Button, FormControl,Form, FormGroup } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Moment from 'moment'

import OrderPanel from '../OrderPanel'
export default class OrderList extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		status:'',
	  		merchant:'',
	  		year:'',
			month:'',
	  	}
	  	this.goPage = this._goPage.bind(this)
	  	this.search = this._search.bind(this)
	  	this.onChangeYear= (e) => this.setState({year:e.target.value},() => this.search())
		this.onChangeMonth = (e) => this.setState({month:e.target.value},() => this.search())
	}
	componentWillMount() {
		const { page, status, merchant } = this.props.location.query
		this.setState({
			status: status || '',
			merchant: merchant || ''
		},() => this.goPage(page || 0))
	}
	_goPage(page) {
		let { status, merchant,year,month } = this.state
		let path = `/order?page=${page}`
		path += status ? `&status=${status}` : ``
		path += merchant ? `&merchant=${merchant}` : ``
		this.context.router.push(path)
		this.props.getOrder(page,status,merchant,year,month)
	}
	_search() {
		let { status,merchant,year,month } = this.state
		let path = `/order?page=${0}`
		path += status ? `&status=${status}` : ``
		path += merchant ? `&merchant=${merchant}` : ``
		this.context.router.push(path)
		this.props.getOrder(0,status,merchant,year,month)
	}
	render() {
		const { year,month,status } = this.state
		return(
			<div className="content" style={{backgroundColor:'#fff'}}>
			  <div className="page-header">
			  	<Form inline onSubmit={(e) => e.preventDefault()}>
				  	<div className="btn-group">
					  <button onClick={()=> this.setState({status:''},() => this.search())} className={`btn btn-default ${status === '' ? 'active':''}`}>全部</button>
					  <button onClick={()=> this.setState({status:'prepaid'},() => this.search())} className={`btn btn-default ${status === 'prepaid' ? 'active':''}`}>已预订</button>
					  <button onClick={()=> this.setState({status:'due'},() => this.search())} className={`btn btn-default ${status === 'due' ? 'active':''}`}>待补款</button>
					  <button onClick={()=> this.setState({status:'paid'},() => this.search())} className={`btn btn-default ${status === 'paid' ? 'active':''}`}>已支付</button>
					  <button onClick={()=> this.setState({status:'done'},() => this.search())} className={`btn btn-default ${status === 'done' ? 'active':''}`}>已完成</button>
					</div>
					{' '}
					<FormGroup>
						<FormControl componentClass="select" placeholder="select" value={this.state.merchant} onChange={(e) => this.setState({merchant:e.target.value},() => this.search())}>
		                  <option value="">所有商家</option>
		                  <option value="PLAY玩具控">PLAY玩具控</option>
		                  <option value="PLAY玩具控(上海)">PLAY玩具控(上海)</option>
						  <option value="亿次元商城">亿次元商城</option>
						  <option value="手办同萌会">手办同萌会</option>
						  <option value="拆盒网">拆盒网</option>
						  <option value="塑唐玩具">塑唐玩具</option>
						  <option value="六部口模型">六部口模型</option>
						  <option value="HobbyMax官方店">HobbyMax官方店</option>
		                </FormControl>
	                </FormGroup>
	                {' '}
					<FormGroup>
						<FormControl componentClass="select" value={year} onChange={this.onChangeYear}>
							<option value="">全部年份</option>
							<option value="2017">2017年</option>
							<option value="2016">2016年</option>
							<option value="2015">2015年</option>
							<option value="2014">2014年</option>
							<option value="2013">2013年</option>
							<option value="2012">2012年</option>
						</FormControl>
					</FormGroup>
					{' '}
					<FormGroup>
						<FormControl componentClass="select" value={month} onChange={this.onChangeMonth}>
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
						</FormControl>
					</FormGroup>
			  	</Form>
			  </div>
			  <div className="alert alert-dismissible">
					<button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
					<h5>
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
					</h5>
				</div>
	          <OrderPanel/>
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
	        </div>

		)
	}
}

OrderList.contextTypes = {
  	router : PropTypes.object
}
