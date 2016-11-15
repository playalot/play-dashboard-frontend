import React,{ Component } from 'react'
import {Form, FormGroup,FormControl,Col} from 'react-bootstrap'
import Moment from 'moment'

export default class extends Component{
	constructor(props) {
		super(props);
		this.addTracking = this._addTracking.bind(this)
	}
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchOrder()
		}
		this.props.fetchOrderDetail(this.props.params.index)
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
			case 'closed':
				return '关闭'
			case 'done':
				return '完成'
			default :
				return '未知'
		}
	}
	render() {
		const { order } = this.props
		if(order.id) {
			return (
				<div className="content">
	                <div className="box box-solid">
	                  <div className="box-body pad">
	                    <Form className="pl-form" horizontal>
	                        <FormGroup style={{marginBottom:0}}>
	                          <Col className="control-label" sm={2}><strong>订单</strong></Col>
	                          <Col sm={9}>
	                            <FormControl.Static>{order.title}</FormControl.Static>
	                          </Col>
	                        </FormGroup>
	                        <FormGroup style={{marginBottom:0}}>
	                          <Col className="control-label" sm={2}><strong>下单时间</strong></Col>
	                          <Col sm={9}>
	                            <FormControl.Static>{Moment(order.created).format('MM-DD hh:mm')}</FormControl.Static>
	                          </Col>
	                        </FormGroup>
	                        <FormGroup style={{marginBottom:0}}>
	                          <Col className="control-label" sm={2}><strong>地址</strong></Col>
	                          <Col sm={9}>
	                            <FormControl.Static>{order.address}</FormControl.Static>
	                          </Col>
	                        </FormGroup>
	                        <FormGroup style={{marginBottom:0}}>
	                          <Col className="control-label" sm={2}><strong>备注</strong></Col>
	                          <Col sm={9}>
	                            <FormControl.Static>{order.note}</FormControl.Static>
	                          </Col>
	                        </FormGroup>
	                        <FormGroup style={{marginBottom:0}}>
	                          <Col className="control-label" sm={2}><strong>描述</strong></Col>
	                          <Col sm={9}>
	                            <FormControl.Static>{order.description}</FormControl.Static>
	                          </Col>
	                        </FormGroup>
	                        <FormGroup style={{marginBottom:0}}>
	                          <Col className="control-label" sm={2}><strong>支付状态</strong></Col>
	                          <Col sm={9}>
	                            <FormControl.Static>{this.formatStatus(order.status)}</FormControl.Static>
	                          </Col>
	                        </FormGroup>
	                        {
	                        	order.status === 'paid' ?
	                        	<FormGroup style={{marginBottom:0}}>
		                          <Col className="control-label" sm={2}><strong>支付方式</strong></Col>
		                          <Col sm={9}>
		                            <FormControl.Static>{order.payments[0].method}</FormControl.Static>
		                          </Col>
		                        </FormGroup>
		                        :null
	                        }
	                        {
	                        	order.status === 'paid' ?
	                        	<FormGroup style={{marginBottom:0}}>
		                          <Col className="control-label" sm={2}><strong>支付时间</strong></Col>
		                          <Col sm={9}>
		                            <FormControl.Static>{order.payments[0].timestamp}</FormControl.Static>
		                          </Col>
		                        </FormGroup>
		                        :null
	                        }
	                        {
	                        	order.status === 'paid' ?
	                        	<FormGroup style={{marginBottom:0}}>
		                          <Col className="control-label" sm={2}><strong>支付编号</strong></Col>
		                          <Col sm={9}>
		                            <FormControl.Static>{order.payments[0].tradeNo}</FormControl.Static>
		                          </Col>
		                        </FormGroup>
		                        :null
	                        }
	                        <FormGroup style={{marginBottom:0}}>
	                          <Col className="control-label" sm={2}><strong>物流</strong></Col>
	                          <Col sm={9}>
	                            <FormControl.Static>
	                            	{
	                            		order.tracking ?
	                            		<a href={`http://wap.guoguo-app.com/wuliuDetail.htm?mailNo=${order.tracking.number}`} target="_blank">快递详情</a>
	                            		:
	                            		<span style={{color:'teal',padding:0}} className="btn btn-sm" onClick={() => this.addTracking(order.id)}>
			                      			添加物流
			                      		</span>
	                            	}
	                            </FormControl.Static>
	                          </Col>
	                        </FormGroup>
	                    </Form>
	                  </div>
	                </div>
	                <div className="box box-solid">
	                  	<div className="box-body pad">
	                  		<div className="table-responsive">
					            <table className="table table-striped">
					            	<thead><tr><th>商品</th><th>名称</th><th>商家</th><th>价格</th><th>运费</th><th>数量</th></tr></thead>
					              	<tbody>
					              	{
					              		order.items.map((item,i) => {
					              			return(
					              				<tr key={`item_${i}`}>
					              					<td>
					              						<img style={{width:'45px'}} src={item.image} className="thumbnail"/>
					              					</td>
					              					<td>{item.name}</td>
					              					<td>{item.merchant}</td>
					              					<td>{item.price}</td>
					              					<td>{item.freight}</td>
					              					<td>{item.count}</td>
					              				</tr>
					              			)
					              		})
					              	}
					              	</tbody>
					            </table>
					            <button className="pull-right btn btn-danger">总计:&nbsp;¥ {order.price.totalPrice}</button>
					        </div>
	                  	</div>
	                  
	                </div>
	            </div>
			)
			return(
				<div style={{paddingTop:0}}>
					<iframe frameBorder="0" height="800px" width="100%" scrolling="no" src={`http://wap.guoguo-app.com/wuliuDetail.htm?mailNo=${order.tracking.number}`}></iframe>
				</div>
			)
		}else {
			return <div></div>
		}
		
		
	}
}