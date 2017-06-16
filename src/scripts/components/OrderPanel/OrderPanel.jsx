import React, { Component } from 'react'
import { Link } from 'react-router'
import { Row, Button, FormControl,Form, FormGroup } from 'react-bootstrap'
import Moment from 'moment'

import PlayAliBaichuan from '../Common/PlayAliBaichuan'

export default class extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	  this.addTracking = this._addTracking.bind(this)
	  this.setStatus = this._setStatus.bind(this)
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
	formatStatus(str,startPay) {
		switch(str) {
			case 'open':
				return <span className="label label-default">等待买家付款</span>
			case 'paid':
				return <span className="label label-success">已支付全款</span>
			case 'prepaid':
				return <span className="label label-primary">已支付定金</span>
			case 'due':
				if(startPay){
					return (
						<div>
							<span className="label label-danger">等待买家补款</span><br/>
							<span className="label" style={{display:'inline-block',marginTop:10,color:'gray'}}>{Moment(startPay).format('MM-DD HH:mm')}</span>
						</div>
					)
				}
				return <span className="label label-danger">等待买家补款</span>
			case 'closed':
				return <span className="label label-default">已关闭</span>
			case 'done':
				return <span className="label label-info">已完成</span>
			default :
				return ''
		}
	}
	render() {
		const { orders } = this.props
		return(
			<div className="table-responsive" style={{paddingBottom:50}}>
        <table className="table table-striped">
        	<thead><tr><th>用户</th><th>商家</th><th></th><th>订单</th><th>总金额</th><th>下单时间</th><th>订单状态</th><th></th><th></th></tr></thead>
          <tbody>
            {orders.map((order,index) => {
              return (
                <tr key={order.id}>
                  <td>
                  	<div className="btn-group">
										  <img style={{width:'30px'}} src={order.user.avatar}  data-toggle="dropdown" className="img-circle"/>
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
                  <td>{this.formatStatus(order.status,order.startPay)}</td>
                  <td>
                  	<div className="btn-group">
										  <button type="button" className="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
										    订单操作&nbsp;<span className="caret"></span>
										  </button>
										  	<ul className="dropdown-menu">
										  		<li><Link to={`/order/${order.id}`}>订单详情</Link></li>
										  		<li><Link to={`/order/toy/${order.items[0].toyId}`}>显示全部订单</Link></li>
											  	{order.status === 'open' ? <li><a onClick={() => this.setStatus(order.id,'closed')}>关闭订单</a></li> : null}
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
        <PlayAliBaichuan></PlayAliBaichuan>
      </div>
		)
	}
}