import React, { Component } from 'react'
import {
	Col, Row, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar, DropdownButton, Checkbox, Tab, Tabs
} from 'react-bootstrap'
import { Link } from 'react-router'
import CDN from '../../widgets/cdn'
export default class SkuList extends Component{
	constructor(props) {
	  	super(props)
		this.toggleRec = id => this.props.toggleRec(id)
		this.toggleBlk = id => this.props.toggleBlk(id)
		this.editSku = this._editSku.bind(this)
	}
	componentWillMount() {
		this.props.fetchSku()
	}
	_editSku(sku,index) {
		this.props.setStock(sku,index)
		this.context.router.push(`/sku/${sku.title}/edit`)
	}
	render() {
		return(
			<div className="content">
		        <Row>
		        	{
		        		this.props.skus.map((sku,index) => {
		        			let recommendClass = sku.isRec === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
							let invisibleClass = sku.isBlk === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
		        			return (<Col className="col" xs={6} sm={3} lg={3} key={`sku_${index}`}>
			                  <div className="box box-solid">
			                    <div className="box-header toy-item">
									<div className="toy-item-img">
				                      <img src={sku.images[0] ? CDN.show(sku.images[0]):null} alt={sku.title} />
				                    </div>
				                    <div className="toy-item-info">
				                      <span className="toy-item-name">{sku.title}</span>
				                      <span className="toy-item-desc">{ sku.description}</span>
				                    </div>
			                    </div>
			                    <div className="box-body">
			                    	{
				                    	sku.stocks.map((stock,i) => {
				                    		return(
					                    		<Row key={i}>
					                    			
					                    			<Col xs={3} sm={2} lg={4}>
					                    				¥{stock.price}
					                    			</Col>
					                    			<Col xs={4} sm={4} lg={4}>
					                    				库存:{stock.quantity}
					                    			</Col>
					                    			<Col onClick={() => this.editSku(sku,i)} xs={5} sm={6} lg={4} style={{textAlign:'right'}}>

					                    				{stock.merchant} <i className="fa fa-edit"></i>
					                    			</Col>
					                    		</Row>
				                    		)
				                    			
				                    	})
			                    	}
			                    </div>
			                    <div className="box-footer">
			                      <ButtonToolbar className="pull-right">
			                      	<span onClick={() => this.toggleRec(sku.id) } className={recommendClass}><i className="fa fa-thumbs-o-up"></i></span>
			                      	<span onClick={() => this.toggleBlk(sku.id) } className={invisibleClass}><i className="fa fa-eye-slash"></i></span>
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

SkuList.contextTypes = {
  	router : React.PropTypes.object
}