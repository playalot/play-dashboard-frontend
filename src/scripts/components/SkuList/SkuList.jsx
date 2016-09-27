import React, { Component } from 'react'
import {
	Col, Row, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar, DropdownButton, Checkbox
} from 'react-bootstrap'
import CDN from '../../widgets/cdn'
export default class extends Component{
	constructor(props) {
	  	super(props)
	
	}
	componentWillMount() {
		this.props.fetchSku()
	}
	render() {
		return(
			<div className="content">
		        <Row>
		        	{
		        		this.props.skus.map((sku,index) => {
		        			return (<Col className="col" xs={6} sm={3} lg={3} key={`sku_${index}`}>
			                  <div className="box box-solid">
			                    <div className="box-body toy-item">
									<div className="toy-item-img">
				                      <img src={sku.images[0] ? CDN.show(sku.images[0]):null} alt={sku.title} />
				                    </div>
				                    <div className="toy-item-info">
				                      <span className="toy-item-name">{sku.title}</span>
				                      <span className="toy-item-desc">{'商家 ' + sku.stocks[0].merchant}</span>
				                      <span className="toy-item-desc">{'原价 ' + sku.stocks[0].price}</span>
				                      <span className="toy-item-desc">{'折扣价 ' + sku.stocks[0].savings}</span>
				                    </div>
			                    </div>
			                    <div className="box-footer">
			                      <ButtonToolbar className="pull-right">
			                      </ButtonToolbar>
			                    </div>
			                  </div>
			              </Col>)
		        		})
		        	}
		        </Row>
			</div>

		)
	}
}