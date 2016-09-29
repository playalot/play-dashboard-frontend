import React, { Component } from 'react'
import {
    Form, FormGroup, Col, FormControl, Row, Button
} from 'react-bootstrap'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id:'',
            quantity:'',
            price:'',
            savings:'',
            merchant:'',
            tbUrl:'',
        }
        this.save = this._save.bind(this)
    }
    componentWillMount() {
        this.setState({
            id:this.props.params.id,
            quantity:55,
            price:66,
            savings:77,
            merchant:'a',
            tbUrl:'taobao.test.com',
        })
    }
    _save() {
        const {
            id,price,savings,tbUrl,merchant,quantity
        } = this.state
        let data = {
            price:parseInt(price),savings:parseInt(savings),tbUrl,merchant,quantity:parseInt(quantity)
        }
        console.info(data)
    }
    render() {
        return(
            <div className="content">
                    <Form horizontal>
                        <FormGroup>
                          <Col sm={2} className="sm-2-label">
                            ID
                          </Col>
                          <Col sm={10}>
                            <FormControl type="text" defaultValue={this.state.id} readOnly/>
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Col sm={2} className="sm-2-label">
                            数量
                          </Col>
                          <Col sm={10}>
                            <FormControl value={this.state.quantity} type="number" onChange={(e) => this.setState({quantity:e.target.value})}/>
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Col sm={2} className="sm-2-label">
                            原价
                          </Col>
                          <Col sm={10}>
                            <FormControl value={this.state.price} type="number" onChange={(e) => this.setState({price:e.target.value})}/>
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Col sm={2} className="sm-2-label">
                            折扣价
                          </Col>
                          <Col sm={10}>
                            <FormControl value={this.state.savings} type="number" onChange={(e) => this.setState({savings:e.target.value})}/>
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Col sm={2} className="sm-2-label">
                            卖家
                          </Col>
                          <Col sm={10}>
                            <FormControl componentClass="select" value={this.state.merchant} onChange={(e) => this.setState({merchant:e.target.value})}>
                                <option value="a">手办同萌会</option>
                                <option value="b">拆盒网</option>
                                <option value="c">塑唐玩具</option>
                            </FormControl>
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Col sm={2} className="sm-2-label">
                            淘宝链接
                          </Col>
                          <Col sm={10}>
                            <FormControl type="text" value={this.state.tbUrl} onChange={(e) => this.setState({tbUrl:e.target.value})}/>
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