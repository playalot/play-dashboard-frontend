import React, {
    Component
} from 'react'
import {Link} from 'react-router'
import {Row, Button, FormControl} from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Moment from 'moment'
export default class OrderList extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {}
	  	this.addTracking = this._addTracking.bind(this)
	  	this.goPage = this._goPage.bind(this)
	}
	componentWillMount() {
		const { page } = this.props
		if(typeof page === 'number') {
			this.context.router.push(`/order?page=${page}`)
		}else{
			this.props.getOrder(this.props.location.query.page)
		}
	}
	_addTracking(id) {
		let trackNo = prompt('输入物流号')
		if (trackNo) {
			this.props.addTracking(id,trackNo)
		}
	}
	_goPage(page) {
		this.context.router.push(`/order?page=${page}`)
		this.props.getOrder(page)
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
				return '未知'
		}
	}
	render() {
		return(
			<div className="content">
	          <div className="table-responsive">
	            <table className="table table-striped">
	            	<thead><tr><th>用户</th><th>商家</th><th>订单</th><th>下单时间</th><th>订单状态</th><th>总计</th><th></th><th></th><th></th></tr></thead>
	              <tbody>
	                {this.props.orders.map((order,index) => {
	                  return (
	                    <tr key={order.id}>
	                      <td><Link to={'/user/'+order.user.id}><img style={{width:'45px'}} src={order.user.avatar} className="img-circle"/></Link></td>
	                      <td>{order.items[0]['merchant']}</td>
	                      <td>{order.title}</td>
	                      <td>{Moment(order.created).format('MM-DD HH:mm')}</td>
	                      <td>{this.formatStatus(order.status)}</td>
	                      <td>¥{order.price.totalPrice}</td>
	                      <td>
	                      	<FormControl componentClass="select" placeholder="select" value={`订单操作`} onChange={(e) => this.props.setStatus(order.id,e.target.value)}>
		                  		<option value="">订单操作</option>
		                  		<option value="closed">关闭订单</option>
								<option value="done">订单完成</option>
		                	</FormControl>
	                      </td>
	                      <td>
	                      	<Link to={`/order/${order.id}`}>详情</Link>
	                      </td>
	                      {
	                      	order.tracking?
	                      	<td style={{display:'flex',flexDirection:'column'}}>
	                      		<span style={{flex:1,color:'goldenrod'}} className="btn btn-sm" onClick={() => this.addTracking(order.id)}>
	                      			{order.tracking.number}&nbsp;修改
	                      		</span>

	                      		<a style={{flex:1,textAlign:'center'}} href={`http://wap.guoguo-app.com/wuliuDetail.htm?mailNo=${order.tracking.number}`} target="_blank">
	                      			<span style={{flex:1}} className="btn btn-sm">
		                      			查看物流
		                      		</span>
	                      		</a>
	                      	</td>
	                      	:<td style={{textAlign:'center',color:'teal'}}>
	                      		<span className="btn btn-sm" onClick={() => this.addTracking(order.id)}>
	                      			添加物流
	                      		</span>
	                      	</td>
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
					pageNum={this.props.totalPages}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
					clickCallback={obj => this.goPage(obj.selected)}
					containerClassName={"pagination"}
					subContainerClassName={"pages pagination"}
					forceSelected={this.props.location.query.page ? parseInt(this.props.location.query.page) : 0}
					activeClassName={"active"} />
	          </Row>
	        </div>

		)
	}
}

OrderList.contextTypes = {
  	router : React.PropTypes.object
}