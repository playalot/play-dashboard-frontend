import React, { Component } from 'react'
import {
	Col, Row, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar, DropdownButton, Checkbox, Tab, Tabs
} from 'react-bootstrap'
import { Link } from 'react-router'
import CDN from '../../widgets/cdn'
import Moment from 'moment'
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
	_editSku(id,sid) {
		let path = `/sku/${id}/edit?sid=${sid}`
		this.context.router.push(path)
	}
	render() {
		return(
			<div className="content">
				<div className="sku-container">
					<div className="sku-title">
						<div>
							<span>贩售价格</span>
							<span>卖家</span>
							<span>库存数量</span>
							<span>运费</span>
							<span>上架时间</span>
							<span className="operate">操作</span>
						</div>
					</div>
				{
					this.props.skus.map((sku,index) => {
						return (
							<div className="sku-box" key={`sku_${index}`}>
								<div className="sku-header">
									<div className="sku-img">
										<img className="img-thumbnail" src={sku.images[0] ? CDN.show(sku.images[0]):null} alt={sku.title}/>
									</div>
									<div className="sku-info">
										<h5>{sku.name}</h5>
									</div>
								</div>
								<div className="sku-body">
									{
										sku.stocks.map((stock,i) => {
											return(
												<div className="sku-body-box" key={`stock_${i}`}>
													<div className="sku-body-item vertical">
														<span>¥&nbsp;{stock.price}</span>
														{
															stock.price !== stock.originPrice ?
															<small>原价:¥&nbsp;{stock.originPrice}</small>
															:null
														}
													</div>													
													<div className="sku-body-item">{stock.merchant}</div>													
													<div className="sku-body-item">{stock.quantity}</div>													
													<div className="sku-body-item">¥&nbsp;{stock.freight}</div>													
													<div className="sku-body-item">{Moment(stock.created).format('MM-DD hh:mm')}</div>													
													<div className="sku-body-item operate">
										                <span onClick={() => this.editSku(sku.id,stock.stockId)}><i className="fa fa-edit"></i></span>
														<span >开始补款</span>
										                <span onClick={() => alert('delete this')} >下架</span>
													</div>													
												</div>
											)
										})
									}
								</div>
							</div>

						)
					})
				}
				</div>
			</div>

		)
	}
}

SkuList.contextTypes = {
  	router : React.PropTypes.object
}