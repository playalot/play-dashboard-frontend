import React, {
    Component
} from 'react'
import {Link} from 'react-router'
import {Row, Button} from 'react-bootstrap'
import Moment from 'moment'
export default class OrderList extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {}
	  	this.addTracking = this._addTracking.bind(this)
	}
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchOrder()
		}
	}
	_addTracking(id) {
		let trackNo = prompt('输入物流号')
		if (trackNo) {
			this.props.addTracking(id,trackNo)
		}
	}
	formatStatus(str) {
		switch(str) {
			case 'open':
				return '未支付'
			case 'paid':
				return '已支付'
			case 'prepaid':
				return '已预订'
			case 'due':
				return '等待补款'
			case 'close':
				return '关闭'
			case 'done':
				return '完成'
			default :
				return '未知'
		}
	}
	render() {
		return(
			<div className="content">
	          <div className="table-responsive">
	            <table className="table table-striped">
	            	<thead><tr><th>用户</th><th>商家</th><th>订单</th><th>下单时间</th><th>订单状态</th><th>总计</th><th></th><th></th></tr></thead>
	              <tbody>
	                {this.props.orders.map((order,index) => {
	                  return (
	                    <tr key={order.id}>
	                      <td><Link to={'/user/'+order.user.id}><img style={{width:'45px'}} src={order.user.avatar} className="img-circle"/></Link></td>
	                      <td>{order.items[0]['merchant']}</td>
	                      <td>{order.title}</td>
	                      <td>{Moment(order.created).format('MM-DD hh:mm')}</td>
	                      <td>{this.formatStatus(order.status)}</td>
	                      <td>¥{order.price.totalPrice}</td>
	                      <td>
	                      	<Link to={`/order/${order.id}`}>详情</Link>
	                      </td>
	                      {
	                      	order.tracking?
	                      	<td>
	                      		<span className="btn btn-sm" onClick={() => this.addTracking(order.id)}>
	                      			{order.tracking.number}
	                      			<i className="fa fa-edit"></i>
	                      		</span>
	                      	</td>
	                      	:<td>
	                      		<span className="btn btn-sm" onClick={() => this.addTracking(order.id)}>
	                      			添加
	                      			<i className="fa fa-plus"></i>
	                      		</span>
	                      	</td>
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

OrderList.contextTypes = {
  	router : React.PropTypes.object
}