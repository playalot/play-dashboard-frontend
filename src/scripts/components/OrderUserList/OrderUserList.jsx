import React,{ Component } from 'react'
import {Link} from 'react-router'
import {
	Col, Row, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar
} from 'react-bootstrap'
import OrderPanel from '../OrderPanel'
export default class extends Component {
	componentWillMount() {
		const id = this.props.params.id
		this.props.getOrderByUser(id)
	}

	render() {
		return(
			<div className="content" style={{backgroundColor:'#fff'}}>
				<OrderPanel/>
			</div>

		)
	}
}