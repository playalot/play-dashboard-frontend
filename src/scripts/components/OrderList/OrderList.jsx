import React, {
    Component
} from 'react'
import {Link} from 'react-router'
import {Row, Button} from 'react-bootstrap'
import Moment from 'moment'
export default class extends Component{
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
	render() {
		return(
			<div className="content">
	          <div className="table-responsive">
	            <table className="table table-striped">
	            	<thead><tr><th>用户</th><th>商家</th><th>订单</th><th>地址</th><th>下单时间</th><th>备注</th><th>数量</th><th>总计</th><th></th></tr></thead>
	              <tbody>
	                {this.props.orders.map((order) => {
	                  return (
	                    <tr key={order.id}>
	                      <td><Link to={'/user/'+order.user.id}><img style={{width:'45px'}} src={order.user.avatar} className="img-circle"/></Link></td>
	                      <td>{order.items[0]['merchant']}</td>
	                      <td>{order.title}</td>
	                      <td style={{maxWidth:150,whiteSpace: 'normal'}}>{order.address}</td>
	                      <td>{Moment(order.created).format('MM-DD hh:mm')}</td>
	                      <td style={{maxWidth:100,whiteSpace: 'normal'}}>{order.note}</td>
	                      <td>{order.items[0]['quantity']}个</td>
	                      <td>{order.totalPrice}元</td>
	                      {
	                      	order.tracking?
	                      	<td>
	                      		<span className="btn btn-sm" onClick={() => this.addTracking(order.id)}>
	                      			{order.tracking.number}
	                      			<i className="fa fa-edit"></i>
	                      		</span>
	                      		<span className="btn btn-sm">

	                      			<a className="btn btn-sm" target="_blank" href={`http://wap.guoguo-app.com/wuliuDetail.htm?mailNo=${order.tracking.number}`}>
	                      				查看
	                      			</a>
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
