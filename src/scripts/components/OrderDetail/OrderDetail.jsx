import React,{ Component } from 'react'
import {Form, FormGroup,FormControl,Col} from 'react-bootstrap'
import Moment from 'moment'

export default class extends Component{
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchOrder()
		}
	}
	render() {
		const order = this.props.orders[this.props.params.index]
		if(order) {
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
	                          <Col sm={9} smOffset={2}>
	                            <FormControl.Static>
	                            	<a href={`http://wap.guoguo-app.com/wuliuDetail.htm?mailNo=${order.tracking.number}`} target="_blank">快递详情</a>
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
					            	<thead><tr><th>商品</th><th>名称</th><th>商家</th><th>价格</th><th>数量</th><th>描述</th></tr></thead>
					              	<tbody>
					              	{
					              		order.items.map((item,i) => {
					              			return(
					              				<tr key={`item_${i}`}>
					              					<td>
					              						<img style={{width:'45px'}} src={item.image} className="thumbnail"/>
					              					</td>
					              					<td>{item.title}</td>
					              					<td>{item.merchant}</td>
					              					<td>{item.price}</td>
					              					<td>{item.quantity}</td>
					              					<td>{item.description}</td>
					              				</tr>
					              			)
					              		})
					              	}
					              	</tbody>
					            </table>
					            <button className="pull-right btn btn-danger">总计:&nbsp;{order.totalPrice}</button>
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