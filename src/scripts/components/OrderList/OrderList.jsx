import React, {
    Component
} from 'react'
import {Link} from 'react-router'
import {Row, Button, FormControl,Form, FormGroup } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Moment from 'moment'

import PlayAliBaichuan from '../Common/PlayAliBaichuan'
export default class OrderList extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		status:'',
	  		merchant:'',
	  		year:'',
			month:'',
	  	}
	  	this.addTracking = this._addTracking.bind(this)
	  	this.goPage = this._goPage.bind(this)
	  	this.search = this._search.bind(this)
	  	this.onChangeYear= (e) => this.setState({year:e.target.value},() => this.search())
		this.onChangeMonth = (e) => this.setState({month:e.target.value},() => this.search())
	}
	componentWillMount() {
		const { init } = this.props
		let page,status,merchant,year,month
		if(init) {
			page = this.props.page
			status = this.props.status
			year = this.props.year
			month = this.props.month
			merchant = this.props.merchant
			let path = `/order?page=${page}`
			path += status ? `&status=${status}` : ``
			path += merchant ? `&merchant=${merchant}` : ``
			this.context.router.push(path)
		}else {
			page = this.props.location.query.page || 0
			status = this.props.location.query.status || ''
			if(!this.props.location.query.status){ page = 0 }
			year = this.state.year
			month = this.state.month
			merchant = this.props.location.query.merchant || ''
			this.props.getOrder(page,status,merchant,year,month)
		}
		this.setState({status,merchant,year,month})
	}
	_addTracking(id) {
		let trackNo = prompt('输入物流号')
		if (trackNo) {
			this.props.addTracking(id,trackNo)
		}
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
	formatStatus(str) {
		switch(str) {
			case 'open':
				return <span className="label label-warning">未支付</span>
			case 'paid':
				return <span className="label label-success">已支付</span>
			case 'prepaid':
				return <span className="label label-primary">已预订</span>
			case 'due':
				return <span className="label label-danger">等待补款</span>
			case 'closed':
				return <span className="label label-default">关闭</span>
			case 'done':
				return <span className="label label-info">完成</span>
			default :
				return ''
		}
	}
	render() {
		return(
			<div className="content" style={{backgroundColor:'#fff'}}>
			  <div className="page-header">
			  	<Form inline onSubmit={(e) => e.preventDefault()}>
				  	<div className="btn-group">
					  <button onClick={()=> this.setState({status:''},() => this.search())} className={`btn btn-default ${this.state.status === '' ? 'active':''}`}>全部</button>
					  <button onClick={()=> this.setState({status:'prepaid'},() => this.search())} className={`btn btn-default ${this.state.status === 'prepaid' ? 'active':''}`}>已预订</button>
					  <button onClick={()=> this.setState({status:'paid'},() => this.search())} className={`btn btn-default ${this.state.status === 'paid' ? 'active':''}`}>已支付</button>
					  <button onClick={()=> this.setState({status:'done'},() => this.search())} className={`btn btn-default ${this.state.status === 'done' ? 'active':''}`}>已完成</button>
					</div>
					{' '}
					<FormGroup>
						<FormControl componentClass="select" placeholder="select" value={this.state.merchant} onChange={(e) => this.setState({merchant:e.target.value},() => this.search())}>
		                  <option value="">所有商家</option>
		                  <option value="PLAY玩具控">PLAY玩具控</option>
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
						<FormControl componentClass="select" value={this.state.year} onChange={this.onChangeYear}>
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
						<FormControl componentClass="select" value={this.state.month} onChange={this.onChangeMonth}>
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
						{this.state.year}年{this.state.month}月，
						一共<strong>{this.props.summary.count}</strong>笔{this.formatStatus(this.state.status)}订单，
						总计<strong>{this.props.summary.totalPrice}</strong>元
					</h5>
				</div>
	          <div className="table-responsive">
	            <table className="table table-striped">
	            	<thead><tr><th>用户</th><th>商家</th><th></th><th>订单</th><th>总金额</th><th>下单时间</th><th>订单状态</th><th></th><th></th></tr></thead>
	              <tbody>
	                {this.props.orders.map((order,index) => {
	                  return (
	                    <tr key={order.id}>
	                      <td>
	                      	<div className="btn-group">
							  <img style={{width:'30px'}} src={order.user.avatar}  data-toggle="dropdown" className="img-circle"/>
							  <ul className="dropdown-menu">
							    <li><a onClick={() => this.context.router.push(`/user/${order.user.id}`)}>查看</a></li>
							    <li><a onClick={() => this.props.setTouid(order.user.id,order.user.avatar)}>私信</a></li>
							  </ul>
							</div>
	                      </td>
	                      <td>{order.items[0]['merchant']}</td>
	                      <td><img style={{width:'40px'}} src={order.items[0].image} /></td>
	                      <td style={{width:'30%'}}>{order.title}</td>
	                      <td><span><strong>¥{order.price.totalPrice}</strong></span><br/>{order.price.totalFreight > 0 ? <small style={{color:'#6c6c6c',fontSize:'10px'}}>含运费:¥&nbsp;{order.price.totalFreight}</small> : <small style={{color:'#6c6c6c',fontSize:'10px'}}>包邮</small>}</td>
	                      <td>{Moment(order.created).format('MM-DD HH:mm')}</td>
	                      <td>{this.formatStatus(order.status)}</td>
	                      <td>
	                      	<div className="btn-group">
							  <button type="button" className="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
							    订单操作&nbsp;<span className="caret"></span>
							  </button>
							  	<ul className="dropdown-menu">
							  		<li><Link to={`/order/${order.id}`}>订单详情</Link></li>
								  	{order.status === 'open' ? <li><a onClick={() => this.props.setStatus(order.id,'closed')}>关闭订单</a></li> : null}
								  	{order.status === 'paid' ? <li><a onClick={() => this.props.setStatus(order.id,'done')}>订单完成</a></li> : null}
								</ul>
							</div>
	                      </td>
	                      {
							order.tracking ?
							<td>
								<a data-toggle="tooltip" data-placement="top" title={`快递号:${order.tracking.number}`}
									href={`http://wap.guoguo-app.com/wuliuDetail.htm?mailNo=${order.tracking.number}`} target="_blank">
									追踪快递
								</a>&nbsp;/&nbsp;
								<a onClick={() => this.addTracking(order.id)}>修改快递号</a>
							</td> :
							(order.status === 'paid' ? <td style={{textAlign:'center',color:'teal'}}>
								<span className="label label-warning">等待发货</span>
								<span className="btn" onClick={() => this.addTracking(order.id)}>
									添加快递号
								</span>
							</td> : <td></td>)
						  }
	                    </tr>
	                  )
	                })}
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
					forcePage={this.props.location.query.page ? parseInt(this.props.location.query.page) : 0}
					activeClassName={"active"} />
	          </Row>
	          <PlayAliBaichuan/>
	        </div>

		)
	}
}

OrderList.contextTypes = {
  	router : React.PropTypes.object
}
