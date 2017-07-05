import React,{ Component } from 'react'
import {
	Col, Row, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar
} from 'react-bootstrap'
import OrderPanel from '../OrderPanel'
export default class extends Component {

	componentWillMount() {
		const id = this.props.match.params.id
		this.props.getOrderByToy(id)
	}
	componentWillUnmount() {
		this.props.clearOrder()
	}
	render() {
		const { toy } = this.props
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
				<OrderPanel/>
			</div>

		)
	}
}