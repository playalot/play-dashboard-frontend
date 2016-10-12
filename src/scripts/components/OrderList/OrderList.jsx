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
	            	<thead><tr><th>订单</th><th>地址</th><th>下单时间</th><th>备注</th><th>数量</th><th>总计</th><th></th></tr></thead>
	              <tbody>
	                {this.props.orders.map((order) => {
	                  return (
	                    <tr key={order.id}>
	                      <td>{order.title}</td>
	                      <td style={{maxWidth:100}}>{order.address}</td>
	                      <td>{Moment(order.created).format('MM-DD hh:mm')}</td>
	                      <td style={{maxWidth:100}}>{order.note}</td>
	                      <td>{order.items[0]['quantity']}个</td>
	                      <td>{order.totalPrice}元</td>
	                      <td>
	                      	<Button style={{marginRight:5}} onClick={() => this.addTracking(order.id)}>添加物流号</Button>
	                      	<a className="btn btn-default" target="_blank" href={`http://wap.guoguo-app.com/wuliuDetail.htm?mailNo=${order.tracking.number}`}>查看物流</a>
	                      </td>
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