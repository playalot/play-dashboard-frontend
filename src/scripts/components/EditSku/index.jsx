import React, { Component } from 'react'
import {
    Form, FormGroup, Col, FormControl, Row, Button
} from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import Moment from 'moment'
import Request from 'superagent'
import parse from '../../widgets/parse'
export default class EditSku extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id:'',
            sid:'',
            quantity:100,
            originPrice:0,
            costPrice:0,
            price:9999,
            freight:0,
            type:'inStock',
            prepay:0,
            orderClose:Moment(),
            version:'',
            tbUrl:'',
        }
        this.save = this._save.bind(this)
        this.changeOrderClose = (date) => this.setState({orderClose:date})
    }
    componentWillMount() {
        const id = this.props.match.params.id
        const sid = parse(this.props.location.search).sid
        Request
        .get(`/api/toy/${id}/stock/${sid}`)
        .end((err,res) => {
            let stock = res.body
            this.setState({
                id,
                sid,
                quantity:stock.quantity || 100,
                price:stock.price || 9999,
                costPrice:stock.costPrice || 0,
                originPrice:stock.originPrice || 0,
                freight:stock.freight || 0,
                type:stock.preOrder ? 'preOrder' : 'inStock',
                prepay:stock.preOrder ? stock.preOrder.prepay : 0,
                orderClose: stock.preOrder ? Moment(stock.preOrder.orderClose) : Moment(),
                version: stock.version || '',
                tbUrl: stock.tbUrl || ''
            })
        })
    }
    _save() {
        const {
            id,sid,price,quantity,freight, prepay, orderClose, type, costPrice, originPrice,version,tbUrl
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
            version,tbUrl
        }
        // Object.keys(data).forEach(key => !data[key] ? delete data[key] : '')
        type ==='preOrder' ? null:delete data['preOrder']
        version.trim() ? null : delete data['version']
        tbUrl.trim() ? null : delete data['tbUrl'] 
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
    render() {
        return(
			<div className="portlet bordered light">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject font-blue-sharp bold uppercase">商品编辑器</span>
					</div>
				</div>
				<div className="portlet-body py-5">
					<Form horizontal  onSubmit={(e) => e.preventDefault()}>
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
							<button className="btn btn-outline green" type="button" onClick={this.save}>保存</button>
						</Col>
					</div>
				</div>
			</div>
        )
    }
}
