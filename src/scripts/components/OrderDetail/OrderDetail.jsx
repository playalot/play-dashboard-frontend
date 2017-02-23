import React,{ Component } from 'react'
import {Form, FormGroup,FormControl,Col} from 'react-bootstrap'
import Moment from 'moment'
import Request from 'superagent'

export default class extends Component{
	constructor(props) {
		super(props)
		this.state = {
			id:'',
			title:'',
			created:Moment(),
			address:'',
			note:'',
			description:'',
			status:'',
			payments:[],
			tracking:{},
			items:[],
			price:{
				totalPrice:0,
			},

			isPrint:false,
		}
		this.addTracking = this._addTracking.bind(this)
	}
	componentWillMount() {
		Request
			.get(`/api/order/${this.props.params.id}`)
			.end((err,res) => {
				const {
					id, title, created, address, note, description,
					status, payments, tracking, items, price,
				} = res.body
				let tmpAddress = address
				let num = /1\d{10}/.exec(address)
				if(num) {
					let arr = num[0].split('')
					arr.splice(3,0,'-')
					arr.splice(8,0,'-')
					let arrStr = arr.join('')
					tmpAddress = address.replace(num,arrStr)
				}
				
				this.setState({
					id, title, created, address:tmpAddress, note, description,
					status, payments, tracking, items, price,
				})
			})
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
		return (
			<div className="content order-detail">
                <div className="box box-solid">
                  <div className="box-body pad">
                    <Form className="pl-form" horizontal>
                        <FormGroup style={{marginBottom:0}}>
                          <Col className="control-label" sm={2}><strong>订单</strong></Col>
                          <Col sm={9}>
                            <FormControl.Static>{this.state.title}</FormControl.Static>
                          </Col>
                        </FormGroup>
                        <FormGroup style={{marginBottom:0}}>
                          <Col className="control-label" sm={2}><strong>下单时间</strong></Col>
                          <Col sm={9}>
                            <FormControl.Static>{Moment(this.state.created).format('MM-DD HH:mm')}</FormControl.Static>
                          </Col>
                        </FormGroup>
                        <FormGroup style={{marginBottom:0}}>
                          <Col className="control-label" sm={2}><strong>地址</strong></Col>
                          <Col sm={9}>
                            <FormControl.Static>{this.state.address}</FormControl.Static>
                          </Col>
                        </FormGroup>
                        <FormGroup style={{marginBottom:0}}>
                          <Col className="control-label" sm={2}><strong>备注</strong></Col>
                          <Col sm={9}>
                            <FormControl.Static>{this.state.note}</FormControl.Static>
                          </Col>
                        </FormGroup>
                        <FormGroup style={{marginBottom:0}}>
                          <Col className="control-label" sm={2}><strong>描述</strong></Col>
                          <Col sm={9}>
                            <FormControl.Static>{this.state.description}</FormControl.Static>
                          </Col>
                        </FormGroup>
                        <FormGroup style={{marginBottom:0}}>
                          <Col className="control-label" sm={2}><strong>支付状态</strong></Col>
                          <Col sm={9}>
                            <FormControl.Static>{this.formatStatus(this.state.status)}</FormControl.Static>
                          </Col>
                        </FormGroup>
                        {
                        	this.state.status === 'paid'|| this.state.status === 'prepaid' ?
                        	<FormGroup style={{marginBottom:0}}>
	                          <Col className="control-label" sm={2}><strong>支付方式</strong></Col>
	                          <Col sm={9}>
	                            <FormControl.Static>{this.state.payments[0].method}</FormControl.Static>
	                          </Col>
	                        </FormGroup>
	                        :null
                        }
                        {
                        	this.state.status === 'paid'|| this.state.status === 'prepaid'  ?
                        	<FormGroup style={{marginBottom:0}}>
	                          <Col className="control-label" sm={2}><strong>支付时间</strong></Col>
	                          <Col sm={9}>
	                            <FormControl.Static>{this.state.payments[0].timestamp}</FormControl.Static>
	                          </Col>
	                        </FormGroup>
	                        :null
                        }
                        {
                        	this.state.status === 'paid'|| this.state.status === 'prepaid' ?
                        	<FormGroup style={{marginBottom:0}}>
	                          <Col className="control-label" sm={2}><strong>支付编号</strong></Col>
	                          <Col sm={9}>
	                            <FormControl.Static>{this.state.payments[0].tradeNo}</FormControl.Static>
	                          </Col>
	                        </FormGroup>
	                        :null
                        }
                        <FormGroup style={{marginBottom:0}}>
                          <Col className="control-label" sm={2}><strong>物流号</strong></Col>
                          <Col sm={9}>
                            <FormControl.Static>
                            	{
                            		this.state.tracking ?
                            		<a href={`http://wap.guoguo-app.com/wuliuDetail.htm?mailNo=${this.state.tracking.number}`} target="_blank">
		                      			{this.state.tracking.number}
		                      		</a>
                            		:
                            		<span style={{color:'teal',padding:0}} className="btn btn-sm" onClick={() => this.addTracking(this.state.id)}>
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
				              		this.state.items.map((item,i) => {
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
				            <button className="pull-right btn btn-danger">总计:&nbsp;¥ {this.state.price.totalPrice}</button>
			                <button style={{marginRight:10}} onClick={() => window.print()} className="pull-right btn btn-info btn-print">打印</button>
				        </div>
                  	</div>
                </div>
                
            </div>
		)
	}
}