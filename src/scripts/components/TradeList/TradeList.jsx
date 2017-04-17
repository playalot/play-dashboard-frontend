import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import {
	Row, Col, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar
} from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Moment from 'moment'
export default class TradeList extends Component {
	constructor(props) {
	  	super(props)
	  	this.state = {}
	  	this.goPage = this._goPage.bind(this)
	  	this.openImage = (photos,i) => this.setState({ showModal: true, showImage: photos[i]['url'],photos,imageIndex:i })
	  	this.closeImage = () => this.setState({ showModal: false,photos:[] })
	  	this.changeImage = (num) => {
	  		let { photos, imageIndex } = this.state
	  		imageIndex = imageIndex+num+photos.length
	  		let showImage = photos[imageIndex%photos.length]['url']
	  		this.setState({showImage,imageIndex})
	  	}

	  	//功能
	  	this.changeStatus = this._changeStatus.bind(this)
	}
	componentWillMount() {
		if(!this.props.toyLoaded){
			this.props.fetchToyClass()
		}
		const { page } = this.props
		if(typeof page === 'number') {
			this.context.router.push(`/trade?page=${page}`)
		}else{
			this.props.getTrade(this.props.location.query.page)
		}
	}
	_goPage(page) {
		this.context.router.push(`/trade?page=${page}`)
		this.props.getTrade(page)
	}
	_changeStatus(id,status) {
		this.props.changeStatus(id,status)
	}
	render() {
		return (
			<div className="content">
				<div className="page-header">
	        		<button type="button" className="btn btn-default">二手交易</button>
	          	</div>
				<Row>
					{
						this.props.trades ?
						this.props.trades.map((trade,i) => {
							let isRecClass = trade.isRec === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
							let isBlkClass = trade.isBlk === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
							return(
								<Col xs={12} sm={3} lg={3} key={`trade_${i}`}>
									<div className="box box-solid">
										<div className="box-header with-border">
							              <div className="user-block">
							                <Link to={'/user/'+trade.user.id}>
							                  <img className="img-circle" src={ trade.user.avatar } alt="User Image" />
							                </Link>
							                <span className="username"><Link to={'/user/'+trade.user.id}>{ trade.user.nickname }</Link></span>
							                <span className="description">{ Moment.unix(trade.created / 1000).fromNow() }</span>
							              </div>
							            </div>
							            <div className="box-body no-padding" style={{paddingBottom:'2px !important'}}>
									        <div>
									          	<img className="img-responsive" src={trade.photos[0].url640} alt="Photo" onClick={() => this.openImage(trade.photos,0) } />
									        </div>
									        <div className="panel-photos">
									          	{
									          		trade.photos.slice(1, trade.photos.length).map((photo, i) => {
									            		return (
									            			<div key={'t_'+trade.id+'_'+i}  className="pull-left">
									            				<img className="img-responsive panel-photos-small"
									            					src={photo.url320} alt="Photo"
									            					onClick={() => this.openImage(trade.photos,i+1) } />
									            			</div>)
									          		})
									          	}
									        </div>
								      	</div>
							            <div className="box-body no-top-padding">
							              <p style={{color:"#999"}}>{trade.title}</p>
							            </div>
							            <div className="box-body no-top-padding">
							              <p style={{color:"#999"}}>{trade.caption}</p>
							            </div>
							            <div className="box-body no-top-padding">
							            	<Row>
							            		<Col xs={6}>
							            			<i className="fa fa-map-marker"></i>&nbsp;{trade.city.name || ''}
							            		</Col>
							            		<Col xs={6}>
							            			¥&nbsp;{trade.price.price}
							            		</Col>
							            	</Row>
							            </div>
							            <div className="box-body no-top-padding">
							              {trade.tags.map(t => <span key={'t_'+trade.id+'_t_'+t.id} className='label label-info label-margin'><Link to={'/tag/'+t.id}>{t.text}</Link>{" "}<i className="fa fa-close" onClick={ () => this.removeTag(t.id)}></i></span>)}
							              {
							              	trade.toys.length ?
							              	<span className='label label-success label-margin'>
									      		<Link to={'/toy/'+trade.toys[0].id+'/edit'}>{trade.toys[0].name.substring(0, 25)+'...'}
									      		</Link>
									      		<i className="fa fa-close" onClick={ () => this.removeToy()}></i>
								      		</span>
								      		:null
							              }
							            </div>
							            <div className="box-body no-top-padding">
							              {trade.cls.length ? trade.cls.map(c => <span key={'t_'+trade.id+'_c_'+c} className="label label-warning label-margin" >{this.props.toyLoaded ? this.props.toyClass[c].name : null}</span>) : null}
							            </div>
							            <div className="box-footer">
							              <ButtonToolbar className="pull-right">
							                <span onClick={ this.addToy } className="btn btn-sm"><i className="fa fa-plus"></i></span>
							                <span onClick={ this.addTag } className="btn btn-sm"><i className="fa fa-tag"></i></span>
							                <span onClick={ this.openClass } className="btn btn-sm"><i className="fa fa-th-large"></i></span>
							                <span onClick={ this.toggleBlock } className={isBlkClass}><i className="fa fa-eye-slash"></i></span>
							                <span onClick={ this.toggleRecommend } className={isRecClass}><i className="fa fa-thumbs-o-up"></i></span>
							                <span onClick={ this.deletePost } className="post-caption-btn btn btn-sm"><i className="fa fa-trash"></i></span>
											<div className="btn-group">
											  <button type="button" className="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
											    {trade.status}&nbsp;<span className="caret"></span>
											  </button>
											  <ul className="dropdown-menu">
											    <li><a onClick={() => this.changeStatus(trade.id,'open')}>Open</a></li>
											    <li><a onClick={() => this.changeStatus(trade.id,'sold')}>sold</a></li>
											    <li><a onClick={() => this.changeStatus(trade.id,'closed')}>closed</a></li>
											  </ul>
											</div>
							              </ButtonToolbar>
							            </div>
									</div>
								</Col>
							)
						})
						:null
					}
				</Row>
				<Row style={{textAlign:'center'}}>
	          	<ReactPaginate 
	          		previousLabel={<span>&laquo;</span>}
					nextLabel={<span>&raquo;</span>}
					breakLabel={<span>...</span>}
					breakClassName={"break-me"}
					pageCount={this.props.totalPages}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
					onPageChange={obj => this.goPage(obj.selected)}
					containerClassName={"pagination"}
					subContainerClassName={"pages pagination"}
					forcePage={this.props.location.query.page ? parseInt(this.props.location.query.page) : 0}
					activeClassName={"active"} />
	          	</Row>
	          	<div>
		            <Modal show={this.state.showModal} onHide={this.closeImage}>
		              <Modal.Body>
		              	<span className="image-modal-left" onClick={() => this.changeImage(-1)}><i className="glyphicon glyphicon-chevron-left"></i></span>
		                <img className="image-modal" onClick={this.closeImage} src={this.state.showImage}/>
		              	<span className="image-modal-right" onClick={() => this.changeImage(1)}><i className="glyphicon glyphicon-chevron-right"></i></span>
		              </Modal.Body>
		            </Modal>
		        </div>
			</div>

		)
	}
}

TradeList.contextTypes = {
  	router : PropTypes.object
}
