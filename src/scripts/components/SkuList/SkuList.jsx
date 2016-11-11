import React, { Component } from 'react'
import {
	Col, Row, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar, DropdownButton, Checkbox, Tab, Tabs
} from 'react-bootstrap'
import { Link } from 'react-router'
import CDN from '../../widgets/cdn'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'
export default class SkuList extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
			filter: '',
	  	}
		this.toggleRec = id => this.props.toggleRec(id)
		this.toggleBlk = id => this.props.toggleBlk(id)
		this.onChangeFilter = this._onChangeFilter.bind(this)
		this.editSku = this._editSku.bind(this)
		this.goPage = this._goPage.bind(this)
		this.deleteSku = (id,sid) => confirm('确定下架这个商品?') && this.props.deleteSku(id,sid)
	}
	componentWillMount() {
		const { page,filter } = this.props
		if(typeof page === 'number') {
			this.context.router.push(`/sku?page=${page}`)
			this.setState({filter})
		}else{
			this.props.getSku(this.props.location.query.page)
		}
	}
	_onChangeFilter(e) {
		this.setState({ filter: e.target.value },() => {
			this.context.router.push(`/sku?page=0`)
			this.props.getSkuBy(this.state.filter)
		})
	}
	_editSku(id,sid) {
		let path = `/sku/${id}/edit?sid=${sid}`
		this.context.router.push(path)
	}
	_goPage(page) {
		this.context.router.push(`/sku?page=${page}`)
		this.props.getSku(page)
	}
	render() {
		return(
			<div className="content">
				<div className="sku-container">
					<div className="sku-title">
						<div>
							<span>贩售价格</span>
							<span className="operate">
			                	<FormControl componentClass="select" placeholder="select" value={this.state.filter} onChange={this.onChangeFilter}>
			                  		<option value="">全部</option>
			                  		<option value="PLAY玩具控">PLAY玩具控</option>
									<option value="亿次元商城">亿次元商城</option>
									<option value="手办同萌会">手办同萌会</option>
									<option value="拆盒网">拆盒网</option>
									<option value="塑堂玩具">塑堂玩具</option>
			                	</FormControl>
				            </span>
							<span>库存数量</span>
							<span>运费</span>
							<span>上架时间</span>
							<span className="operate">操作</span>
						</div>
					</div>
				{
					this.props.skus.map((sku,index) => {
						if(!sku.stocks.length){
							return null
						}
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
													<div className="sku-body-item operate">{stock.merchant}</div>													
													<div className="sku-body-item">{stock.quantity}</div>													
													<div className="sku-body-item">¥&nbsp;{stock.freight}</div>													
													<div className="sku-body-item">{Moment(stock.created).format('MM-DD hh:mm')}</div>													
													<div className="sku-body-item operate">
										                <span onClick={() => this.editSku(sku.id,stock.stockId)}><i className="fa fa-edit"></i></span>
														<span >补款</span>
										                <span onClick={() => this.deleteSku(sku.id,stock.stockId)} >下架</span>
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
				<Row style={{textAlign:'center'}}>
	          		<ReactPaginate 
		          		previousLabel={<span>&laquo;</span>}
						nextLabel={<span>&raquo;</span>}
						breakLabel={<span>...</span>}
						breakClassName={"break-me"}
						pageNum={this.props.totalPages}
						marginPagesDisplayed={2}
						pageRangeDisplayed={5}
						clickCallback={obj => this.goPage(obj.selected)}
						containerClassName={"pagination"}
						subContainerClassName={"pages pagination"}
						forceSelected={this.props.location.query.page ? parseInt(this.props.location.query.page) : 0}
						activeClassName={"active"} />
	          	</Row>
			</div>

		)
	}
}

SkuList.contextTypes = {
  	router : React.PropTypes.object
}