import React, { Component } from 'react'
import {
    Form, FormGroup, Col, FormControl, Row, Button
} from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import Moment from 'moment'
import Request from 'superagent'
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
        }
        this.save = this._save.bind(this)
        this.changeOrderClose = (date) => this.setState({orderClose:date})
    }
    componentWillMount() {
        Request
        .get(`/api/toy/${this.props.params.id}/stock/${this.props.location.query.sid}`)
        .end((err,res) => {
            let stock = res.body
            this.setState({
                id:this.props.params.id,
                sid:this.props.location.query.sid,
                quantity:stock.quantity,
                price:stock.price,
                costPrice:stock.costPrice ? stock.costPrice : 0,
                originPrice:stock.originPrice ? stock.originPrice : 0,
                freight:stock.freight ? stock.freight : 0,
                type:stock.preOrder ? 'preOrder' : 'inStock',
                prepay:stock.preOrder ? stock.preOrder.prepay : 0,
                orderClose: stock.preOrder ? Moment(stock.preOrder.orderClose) : Moment(),
            })
        })
    }
    _save() {
        const {
            id,sid,price,quantity,freight, prepay, orderClose, type, costPrice, originPrice
        } = this.state
        let data = {
            price:parseFloat(price),
            originPrice:parseFloat(originPrice),
            costPrice:parseFloat(costPrice),
            quantity:parseInt(quantity),
            freight:parseFloat(freight),
            preOrder:{
                prepay:parseFloat(prepay),
                orderClose:`${orderClose.format('YYYY-MM-DD')} 23:59:59`
            }
        }
        Object.keys(data).forEach(key => !data[key] ? delete data[key] : '')
        type ==='preOrder' ? null:delete data['preOrder']
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
          <div className="content">
            <Form horizontal>
              <FormGroup>
                <Col sm={2} className="sm-2-label">
                  库存数量
                </Col>
                <Col sm={10}>
                  <FormControl value={this.state.quantity} type="number" onChange={(e) => this.setState({quantity:e.target.value})}/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={2} className="sm-2-label">
                  购买类型
                </Col>
                <Col sm={10} style={{padding:'6px 15px'}}>
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
                  <Col sm={2} className="sm-2-label">
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
                  <Col sm={2} className="sm-2-label">
                    截止时间
                  </Col>
                  <Col sm={10}  style={{padding:'6px 15px'}}>
                      <DatePicker
                        selected={this.state.orderClose}
                        onChange={this.changeOrderClose}
                        minDate={Moment()}
                        dateFormat="YYYY/MM/DD"
                     />
                  </Col>
                </FormGroup>
                :null
              }
              <FormGroup>
                <Col sm={2} className="sm-2-label">
                  贩售价格
                </Col>
                <Col sm={10}>
                  <FormControl value={this.state.price} type="number" onChange={(e) => this.setState({price:e.target.value})}/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={2} className="sm-2-label">
                  原价
                </Col>
                <Col sm={10}>
                  <FormControl value={this.state.originPrice} type="number" onChange={(e) => this.setState({originPrice:e.target.value})}/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={2} className="sm-2-label">
                  进货价
                </Col>
                <Col sm={10}>
                  <FormControl value={this.state.costPrice} type="number" onChange={(e) => this.setState({costPrice:e.target.value})}/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={2} className="sm-2-label">
                  运费
                </Col>
                <Col sm={10}>
                  <FormControl value={this.state.freight} type="number" onChange={(e) => this.setState({freight:e.target.value})}/>
                </Col>
              </FormGroup>
              <Row>
                <Col sm={10} smOffset={2}>
                  <Button bsStyle="primary" onClick={this.save}>保存</Button>
                </Col>
              </Row>
            </Form>
          </div>
        )
    }
}
