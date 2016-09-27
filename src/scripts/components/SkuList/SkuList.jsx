import React, { Component } from 'react'
import {
	Col, Row, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar, DropdownButton, Checkbox
} from 'react-bootstrap'
import { Link } from 'react-router'
import CDN from '../../widgets/cdn'
export default class extends Component{
	constructor(props) {
	  	super(props)
		this.toggleRec = id => this.props.toggleRec(id)
		this.toggleBlk = id => this.props.toggleBlk(id)
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
		        			let recommendClass = sku.isRec === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
							let invisibleClass = sku.isBlk === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
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
			                      	<Link to={`/sku/${sku.id}/edit`} ><span className="btn btn-sm"><i className="fa fa-edit"></i></span></Link>
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