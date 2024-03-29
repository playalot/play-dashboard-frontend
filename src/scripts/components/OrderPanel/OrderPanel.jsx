import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Button, FormControl,Form, FormGroup } from 'react-bootstrap'
import Moment from 'moment'
import Request from 'superagent'
export default class extends Component{
	constructor(props) {
	  super(props);

	  this.state = {};
	  this.addTracking = this._addTracking.bind(this)
		this.setStatus = this._setStatus.bind(this)
		this.closeExpireOrder = this._closeExpireOrder.bind(this)
	}
	_addTracking(id) {
		let trackNo = prompt('输入物流号')
		if (trackNo) {
			this.props.addTracking(id,trackNo)
		}
	}
	_setStatus(id,state) {
		if (confirm(`确定${state === 'closed' ? '关闭':'完成'}这个订单吗?`)) {
			this.props.setStatus(id,state)
		}
	}
	_closeExpireOrder(id) {
		Request.post(`/api/order/${id}/closeExpire`)
		.end((err,res) => {
			if(err) {
				Toastr.error(`关闭订单失败。`)
			}else{
				Toastr.success(`关闭订单成功～`)
			}
		})
	}
	formatStatus(str,startPay) {
		switch(str) {
			case 'open':
				return <span className="m-badge  m-badge--secondary m-badge--wide">等待买家付款</span>
			case 'paid':
				return <span className="m-badge  m-badge--success m-badge--wide">已支付全款</span>
			case 'prepaid':
				return <span className="m-badge  m-badge--info m-badge--wide">已支付定金</span>
			case 'due':
				if(startPay){
					return (
						<div>
							<span className="m-badge m-badge--danger m-badge--wide">等待买家补款</span><br/>
							<span className="m-badge m-badge--wide" style={{display:'inline-block',marginTop:10,color:'gray'}}>{Moment(startPay).format('MM-DD HH:mm')}</span>
						</div>
					)
				}
				return <span className="m-badge m-badge--danger m-badge--wide">等待买家补款</span>
			case 'closed':
				return <span className="m-badge  m-badge--secondary m-badge--wide">已关闭</span>
			case 'done':
				return <span className="m-badge  m-badge--accent m-badge--wide">已完成</span>
			default :
				return ''
		}
	}
	render() {
		const { orders } = this.props
		return(
			<div className="m-section">
				<div className="m-section__content">
		        <table className="table table-bordered m-table">
		        	<thead><tr><th>用户</th><th>商家</th><th>图片</th><th>订单</th><th>总金额</th><th>下单时间</th><th>更新时间</th><th style={{width:"105px"}}>订单状态</th><th></th><th></th></tr></thead>
		          <tbody>
		            {orders.map((order,index) => {
		              return (
		                <tr key={order.id}>
		                  <td>
		                  	<div className="btn-group">
												  <img src={order.user.avatar}  data-toggle="dropdown" className="avatar45"/>
												  <ul className="dropdown-menu">
												    <li><Link to={`/user/${order.user.id}`}>查看<small>({order.user.nickname})</small></Link></li>
												    <li><Link to={`/order/user/${order.user.id}`}>显示个人订单</Link></li>
												    <li><a onClick={() => this.props.setTouid(order.user.id,order.user.avatar)}>私信</a></li>
												  </ul>
												</div>
		                  </td>
		                  <td>{order.items[0]['merchant']}</td>
		                  <td><img style={{width:'40px'}} src={order.items[0].image} /></td>
		                  <td style={{width:'30%'}}>{order.title}</td>
		                  <td>
		                  	<span><strong>¥{order.price.totalPrice}</strong></span><br/>
		                  	{order.price.totalFreight > 0 ? <small style={{color:'#6c6c6c',fontSize:'10px'}}>含运费:¥&nbsp;{order.price.totalFreight}</small> : <small style={{color:'#6c6c6c',fontSize:'10px'}}>包邮</small>}
		                  	<br/>
		                  	{order.price.prePay ? <small style={{color:'#6c6c6c',fontSize:'10px'}}>订金:¥&nbsp;{order.price.prePay}</small>:null}
		                  </td>
		                  <td>{Moment(order.created).format('MM-DD HH:mm')}</td>
		                  <td>{Moment(order.updated).format('MM-DD HH:mm')}</td>
		                  <td>{this.formatStatus(order.status,order.startPay)}</td>
		                  <td>
		                  	<div className="btn-group">
												  <button type="button" className="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
												    订单操作&nbsp;<span className="caret"></span>
												  </button>
												  	<ul className="dropdown-menu">
												  		<li><Link to={`/order/edit/${order.id}`}>订单详情</Link></li>
												  		<li><Link to={`/order/toy/${order.items[0].toyId}`}>显示全部订单</Link></li>
													  	{order.status === 'open' ? <li><a onClick={() => this.setStatus(order.id,'closed')}>关闭订单</a></li> : null}
												  		<li><a onClick={() => this.closeExpireOrder(order.id)}>关闭过期订单</a></li>
													  	{order.status === 'paid' ? <li><a onClick={() => this.setStatus(order.id,'done')}>订单完成</a></li> : null}
													  	{order.status === 'prepaid' ? <li><a onClick={() => this.props.startPay(order.id)}>通知补款</a></li> : null}
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
			</div>
		)
	}
}
