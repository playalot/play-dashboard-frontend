import React, { Component } from 'react'
import { Form, FormGroup, Col, FormControl, Row, Button } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import Moment from 'moment'
import Request from 'superagent'
import parse from '../../widgets/parse'
import CDN from '../../widgets/cdn'
export default class EditSku extends Component {
    constructor(props) {
        super(props)
        this.state = {
			isAddSku:true,

            id:'',
			name:'',
			cover:'',


            sid:'',
            quantity:100,
            originPrice:0,
            price:9999,
            costPrice:0,
            freight:0,
            type:'inStock',
            prepay:0,
            orderClose:Moment(),
			merchant:'PLAY玩具控',
            version:'',
            tbUrl:'',
        }
        this.save = this._save.bind(this)
        this.changeOrderClose = (date) => this.setState({orderClose:date})
    }
    componentWillMount() {
        const id = this.props.match.params.id
        const sid = parse(this.props.location.search).sid
		Request.get(`/api/toy/${id}`)
		.end((err,res) => {
			const { name,cover } = res.body
			this.setState({ id,name,cover })
		})
		if(sid){
			Request
			.get(`/api/toy/${id}/stock/${sid}`)
			.end((err,res) => {
				let stock = res.body
				this.setState({
					sid,
					quantity:stock.quantity || 100,
					merchant:stock.merchant || 'PLAY玩具控',
					price:stock.price || 9999,
					costPrice:stock.costPrice || 0,
					originPrice:stock.originPrice || 0,
					freight:stock.freight || 0,
					type:stock.preOrder ? 'preOrder' : 'inStock',
					prepay:stock.preOrder ? stock.preOrder.prepay : 0,
					orderClose: stock.preOrder ? Moment(stock.preOrder.orderClose) : Moment(),
					version: stock.version || '',
					tbUrl: stock.tbUrl || '',
					isAddSku:false
				})
			})
		}
    }
    _save() {
        const {
            id,sid,isAddSku,
			price,quantity,freight, prepay, orderClose, type, costPrice, originPrice,version,tbUrl,merchant
        } = this.state
        let data = {
            price:parseFloat(price),
            costPrice:parseFloat(costPrice),
            quantity:parseInt(quantity),
            freight:parseFloat(freight),
            preOrder:{
                prepay:parseFloat(prepay),
                orderClose:`${orderClose.format('YYYY-MM-DD')} 23:59:59`
            },
            version,tbUrl,merchant
        }
        type ==='preOrder' ? null:delete data['preOrder']
        version.trim() ? null : delete data['version']
        tbUrl.trim() ? null : delete data['tbUrl'] 
		if(isAddSku){
			Request
			.post(`/api/toy/${id}/stock`)
			.send(data)
			.end((err,res) => {
				if(err) {
					console.warn(err)
				}else{
					alert('添加商品成功')
				}
			})
		}else{
			Request
			.post(`/api/toy/${id}/stock/${sid}`)
			.send(data)
			.end((err,res) => {
				if(err) {
					console.warn(err)
				}else{
					alert('保存商品成功')
				}
			})
		}
    }
    render() {
        return(
			<div className="portlet bordered light">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject font-blue-sharp bold uppercase">
							{
								this.state.isAddSku ? '添加商品':'修改商品'
							}
						</span>
						<span className="text-muted">
							&nbsp;&nbsp;
							{this.state.name}
						</span>
					</div>
				</div>
				<div className="portlet-body py-5">
					<Form horizontal  onSubmit={(e) => e.preventDefault()}>
						<FormGroup>
							<Col sm={2} className="control-label">
								玩具
							</Col>
							<Col sm={10}>
								<FormControl.Static>
									<img style={{height:100}} src={CDN.show(this.state.cover)} alt=""/>
								</FormControl.Static>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={2} className="control-label">
								库存数量
							</Col>
							<Col sm={10}>
								<FormControl value={this.state.quantity} type="number" onChange={(e) => this.setState({quantity:e.target.value})}/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={2} className="control-label">
								购买类型
							</Col>
							<Col sm={10} className="mt-2">
								<label>
									<input type="radio" name="type" value="inStock" onChange={(e) => this.setState({type:e.target.value})} checked={this.state.type==='inStock'}/>现货
								</label>&nbsp;&nbsp;
								<label>
									<input type="radio" name="type" value="preOrder" onChange={(e) => this.setState({type:e.target.value})} checked={this.state.type==='preOrder'}/>预定
								</label>
							</Col>
						</FormGroup>
						{
							this.state.type === 'preOrder' ?
							<FormGroup>
								<Col sm={2} className="control-label">
									定金
								</Col>
								<Col sm={10}>
									<FormControl value={this.state.prepay} type="number" onChange={(e) => this.setState({prepay:e.target.value})}/>
								</Col>
							</FormGroup>
							:null
						}
						{
							this.state.type === 'preOrder' ?
							<FormGroup>
								<Col sm={2} className="control-label">
									截止时间
								</Col>
								<Col sm={10} className="mt-2">
									<DatePicker
										selected={this.state.orderClose}
										onChange={this.changeOrderClose}
										dateFormat="YYYY/MM/DD"
									/>
								</Col>
							</FormGroup>
							:null
						}
						<FormGroup>
							<Col sm={2} className="control-label">
								售价
							</Col>
							<Col sm={10}>
								<FormControl value={this.state.price} type="number" onChange={(e) => this.setState({price:e.target.value})}/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={2} className="control-label">
								进货成本价
							</Col>
							<Col sm={10}>
								<FormControl value={this.state.costPrice} type="number" onChange={(e) => this.setState({costPrice:e.target.value})}/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={2} className="control-label">
								运费
							</Col>
							<Col sm={10}>
								<FormControl value={this.state.freight} type="number" onChange={(e) => this.setState({freight:e.target.value})}/>
							</Col>
						</FormGroup>
						<FormGroup>
						<Col sm={2} className="sm-2-label">
							卖家
						</Col>
						<Col sm={10}>
							<FormControl componentClass="select" value={this.state.merchant} onChange={(e) => this.setState({merchant:e.target.value})}>
								<option value="PLAY玩具控">PLAY玩具控</option>
								<option value="亿次元商城">亿次元商城</option>
								<option value="手办同萌会">手办同萌会</option>
								<option value="拆盒网">拆盒网</option>
								<option value="塑唐玩具">塑唐玩具</option>
								<option value="六部口模型">六部口模型</option>
								<option value="HobbyMax官方店">HobbyMax官方店</option>
								<option value="H教授的玩具讲座">H教授的玩具讲座</option>
								<option value="鹤屋通贩">鹤屋通贩</option>
								<option value="电玩男の里屋">电玩男の里屋</option>
								<option value="万事屋手办店">万事屋手办店 </option>
								<option value="塑料魂">塑料魂 </option>
								<option value="刺猬挺">刺猬挺 </option>
							</FormControl>
						</Col>
					</FormGroup>
						<FormGroup>
							<Col sm={2} className="control-label">
								版本
							</Col>
							<Col sm={10}>
								<FormControl value={this.state.version} type="text" onChange={(e) => this.setState({version:e.target.value})}/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={2} className="control-label">
								淘宝链接
							</Col>
							<Col sm={10}>
								<FormControl value={this.state.tbUrl} type="text" onChange={(e) => this.setState({tbUrl:e.target.value})}/>
							</Col>
						</FormGroup>
					</Form>
					<div className="portlet-body py-5" style={{borderTop:'1px solid #eef1f5'}}>
						<Col sm={2} smOffset={2}>
							<button className="btn btn-outline green" type="button" onClick={this.save}>
								{
									this.state.isAddSku ? '添加':'修改'
								}
							</button>
						</Col>
					</div>
				</div>
			</div>
        )
    }
}
