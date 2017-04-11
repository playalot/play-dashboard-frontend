import React,{ Component } from 'react'
import Request from 'superagent'
import Moment from 'moment'
import {Link} from 'react-router'
import {
	Col, Row, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar
} from 'react-bootstrap'

export default class extends Component {
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		toy:null,
	  		orders:[]
	  	}
	  	this.addTracking = this._addTracking.bind(this)
	  	this.startPay = this._startPay.bind(this)
	}
	componentWillMount() {
		Request
		.get(`/api/toy/${this.props.params.id}/orders`)
		.end((err,res) => {
			const { toy, orders } = res.body
			this.setState({toy,orders})
		})
	}
	_addTracking(id,index) {
		let trackNo = prompt('输入物流号')
		if (trackNo) {
			Request
            .post(`/api/order/${id}/track`)
            .send({
                trackNo
            })
            .end((err,res) => {
                if(!err){
                	let orders = this.state.orders
                	orders[index]['tracking'] = { number:trackNo }
                	this.setState({orders})
                }
            })
		}
	}
	_startPay(id,index) {
		Request.post(`/api/order/${id}/startPay`)
		.end((err,res) => {
			if(err){
				alert('通知补款失败')
			}else{
				alert('通知补款成功')
				let orders = this.state.orders
            	orders[index]['status'] = 'due'
            	this.setState({orders})
			}
		})
	}
	formatStatus(str) {
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
		const { toy, orders } = this.state
		return(
			<div className="content" style={{backgroundColor:'#fff'}}>
				<div className="page-header">
					{
						toy ?
						<Row>
							<Col sm={3}>
								<div style={{padding:5,textAlign:'center'}}>
									<img src={toy.cover} style={{maxHeight:150}} alt={toy.name}/>
								</div>
							</Col>
							<Col sm={9}>
								<Form className="pl-form" horizontal>
			                        <FormGroup style={{marginBottom:0}}>
			                          <Col xs={12}>
			                            <FormControl.Static>{toy.name}</FormControl.Static>
			                          </Col>
			                        </FormGroup>
			                        <FormGroup style={{marginBottom:0}}>
			                          <Col xs={12}>
			                            <FormControl.Static>{toy.money}</FormControl.Static>
			                          </Col>
			                        </FormGroup>
			                        <FormGroup style={{marginBottom:0}}>
			                          <Col xs={12}>
			                            <FormControl.Static>{toy.release}</FormControl.Static>
			                          </Col>
			                        </FormGroup>
			                    </Form>
							</Col>
						</Row>
						:null
					}
				</div>
				<div className="table-responsive">
					<table className="table table-striped">
						<thead><tr><th>用户</th><th>订单</th><th></th><th>总金额</th><th>下单时间</th><th>订单状态</th><th></th><th></th></tr></thead>
						<tbody className="order-list">
							{orders.map((order,index) => {
								return (
									<tr key={`toy_order_${order.id}`}>
										<td><img data-toggle="tooltip" data-placement="right" title={order.user.nickname} style={{width:'30px'}} src={order.user.avatar} className="img-circle"/></td>
										<td><img style={{width:'40px'}} src={order.items[0].image} /></td>
										<td style={{width:'30%'}}>{order.title}</td>
										<td><span><strong>¥{order.price.totalPrice}</strong></span><br/>{order.price.totalFreight > 0 ? <small style={{color:'#6c6c6c',fontSize:'10px'}}>含运费:¥&nbsp;{order.price.totalFreight}</small> : <small style={{color:'#6c6c6c',fontSize:'10px'}}>包邮</small>}</td>
										<td>{Moment(order.created).format('MM-DD HH:mm')}</td>
										<td>{this.formatStatus(order.status,order.startPay)}</td>
										<td>
											<div className="btn-group">
											  <button type="button" className="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
											    订单操作&nbsp;<span className="caret"></span>
											  </button>
											  	<ul className="dropdown-menu">
											  		<li><Link to={`/order/${order.id}`}>订单详情</Link></li>
												  	{order.status === 'prepaid' ? <li><a onClick={() => this.startPay(order.id,index)}>通知补款</a></li> : null}
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
												<a onClick={() => this.addTracking(order.id,index)}>修改快递号</a>
											</td> :
											(order.status === 'paid' ? <td style={{textAlign:'center',color:'teal'}}>
												<span className="label label-warning">等待发货</span>
												<span className="btn" onClick={() => this.addTracking(order.id,index)}>
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