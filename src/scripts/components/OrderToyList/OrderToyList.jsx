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
			<div>
				<div className="page-header">
					{
						toy ?
						<Row>
							<Col sm={3}>
								<img src={toy.cover} className="play-img-cover" style={{maxWidth:'100%'}} alt={toy.name}/>
							</Col>
							<Col sm={9}>
								<FormGroup>
									<Col xs={12}>
										<FormControl.Static>{toy.name}</FormControl.Static>
									</Col>
								</FormGroup>
								<FormGroup>
									<Col xs={12}>
										<FormControl.Static>{toy.money}</FormControl.Static>
									</Col>
								</FormGroup>
								<FormGroup>
									<Col xs={12}>
										<FormControl.Static>{toy.release}</FormControl.Static>
									</Col>
								</FormGroup>
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