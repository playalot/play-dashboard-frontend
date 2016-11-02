import React, { Component } from 'react'
import {
    Form, FormGroup, Col, FormControl, Row, Button
} from 'react-bootstrap'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title:'',
            quantity:0,
            price:9999,
            savings:0,
            merchant:'手办同萌会',
            tbUrl:'',
            freight:0,
            preorder:0,
        }
        this.save = this._save.bind(this)
    }
    componentWillMount() {
        let stock = this.props.stock
        this.setState({
            quantity: stock.quantity ? stock.quantity : 0,
            price: stock.price ? stock.price : 9999,
            savings: stock.savings ? stock.savings : 0,
            merchant: stock.merchant ? stock.merchant : '手办同萌会',
            tbUrl: stock.tbUrl ? stock.tbUrl : '',
            freight: stock.freight ? stock.freight : 0,
            preorder: stock.preorder ? stock.preorder : 0,
            title:this.props.params.title,
        })

    }
    _save() {
        const {
            price,savings,tbUrl,merchant,quantity,freight, preorder
        } = this.state
        let data = {
            price:parseInt(price),savings:parseInt(savings),tbUrl,merchant,
            quantity:parseInt(quantity),freight:parseInt(freight),preorder:parseInt(preorder),
        }
        Object.keys(data).forEach(key => data[key] === '' || data[key] === 0 ? delete data[key] : '')
        console.info(data)
    }
    render() {
        return(
            <div className="content">
            <Form horizontal>
                <FormGroup>
                  <Col sm={2} className="sm-2-label">
                    名称
                  </Col>
                  <Col sm={10}>
                    <FormControl type="text" defaultValue={this.state.title} readOnly/>
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
                    预定
                  </Col>
                  <Col sm={10}>
                    <FormControl value={this.state.preorder} type="number" onChange={(e) => this.setState({preorder:e.target.value})}/>
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
                    折扣
                  </Col>
                  <Col sm={10}>
                    <FormControl value={this.state.freight} type="number" onChange={(e) => this.setState({freight:e.target.value})}/>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={2} className="sm-2-label">
                    运费
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
                    <FormControl type="text" defaultValue={this.state.merchant} readOnly/>
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