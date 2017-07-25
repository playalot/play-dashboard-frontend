import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
	Row, Col, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar
} from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Moment from 'moment'
import { parsePage } from '../../widgets/parse'
import Lightbox from 'react-images'
export default class TradeList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			lightboxIsOpen:false,
			images:[],
			currentImage:0,
		}
		this.goPage = this._goPage.bind(this)
		this.openImage = (images,currentImage) => this.setState({ lightboxIsOpen: true,images:this.formatUrl(images),currentImage})
		this.closeLightbox = () => this.setState({lightboxIsOpen:false,images:[]})
		this.changeStatus = this._changeStatus.bind(this)
	}
	componentWillMount() {
		if(!this.props.toyLoaded){
			this.props.fetchToyClass()
		}
		const { page } = this.props
		if(typeof page === 'number') {
			this.props.history.push(`/trades?page=${page}`)
		}else{
			const ppage = parsePage(this.props.location.search)
			this.goPage(ppage)
		}
	}
	_goPage(page) {
		this.props.history.push(`/trades?page=${page}`)
		this.props.getTrade(page)
	}
	_changeStatus(id,status) {
		this.props.changeStatus(id,status)
	}
	formatUrl(images) {
		images.map((image) => {
			image.src = image.url
		})
		return images
	}
	render() {
		return (
			<div className="content">
				<Row>
					{
						this.props.trades ?
						this.props.trades.map((trade,i) => {
							let isRecClass = trade.isRec === true ? 'btn yellow-casablanca btn-sm' : 'btn btn-sm'
							let isBlkClass = trade.isBlk === true ? 'btn yellow-casablanca btn-sm' : 'btn btn-sm'
							return(
								<Col xs={12} sm={3} lg={3} key={`trade_${i}`}>
									<div className="portlet bordered light" style={{padding:'12px 5px 15px 5px'}}>
										<div className="portlet-title" style={{marginBottom:0}}>
											<div className="d-flex">
												<Link to={`/user/${trade.user.id}`}>
													<img style={{maxWidth:40}} className="img-circle" src={ trade.user.avatar } alt="User Image" />
												</Link>
												<div className="d-flex flex-column pl-2">
													<span><Link to={`/user/${trade.user.id}`}>{ trade.user.nickname }</Link></span>
													<small className="text-muted">{ Moment.unix(trade.created / 1000).fromNow() }</small>
												</div>
											</div>
										</div>
										<div className="portlet-body">
											<div>
												<div>
													<ImgLoad src={trade.photos[0].url640} onClick={() => this.openImage(trade.photos,0) } />
												</div>
												{
													trade.photos.length === 1 ? null :
													<div className="play-posts-preview-box pt-2">
														{
															trade.photos.slice(1, trade.photos.length).map((photo, i) => {
																return (
																	<div className="play-posts-preview" key={`trade_${trade.id}_${i}`}>
																		<img src={photo.url320} alt="Photo"
																			onClick={() => this.openImage(trade.photos,i+1) } />
																	</div>
																)
															})
														}
													</div>
												}
											</div>
											<div className="text-muted"><strong>{trade.title}</strong> </div>
											<div className="text-muted"><small>{trade.caption}</small></div>
											<div className="d-flex justify-content-between">
												<span><i className="fa fa-map-marker"></i>&nbsp;{trade.city.name || ''}</span>
												<span>¥&nbsp;{trade.price.price}</span>
											</div>
											<div>
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
											<div>
												{trade.cls.length ? trade.cls.map(c => <span key={'t_'+trade.id+'_c_'+c} className="label label-warning label-margin" >{this.props.toyLoaded ? this.props.toyClass[c].name : null}</span>) : null}
											</div>
											<div className="clearfix">
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
						forcePage={parsePage(this.props.location.search)}
						activeClassName={"active"} />
				</Row>
				<Lightbox
					images={this.state.images}
					isOpen={this.state.lightboxIsOpen}
					currentImage={this.state.currentImage}
					onClickPrev={() => this.setState((prevState) => ({currentImage:prevState.currentImage - 1}) ) }
					onClickNext={() => this.setState((prevState) => ({currentImage:prevState.currentImage + 1}) ) }
					onClose={this.closeLightbox}
					backdropClosesModal={true}
					showCloseButton={false}
				/>
			</div>
		)
	}
}


class ImgLoad extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		loaded:false
	  	}
	}
	componentWillMount() {
		const {src} = this.props
		let w,h
		try{
			w = /_w_\d{1,}/.exec(src)[0].replace('_w_','')
			h = /_h_\d{1,}/.exec(src)[0].replace('_h_','')
			
		}catch(e){
			console.error(e)
			w = 0
			h = 0
		}
		this.setState({
			scale:`${h/w*100}%`
		})
		const img = new Image()
		img.src = src
		img.onload = () => {
			this.setState({
				loaded:true
			})
		}
	}
	render() {
		return (
			<div style={{width:'100%',height:0,paddingBottom:`${this.state.scale}`,background:'rgb(238,237,235)',position:'relative'}}>
				{
					this.state.loaded ?
					<img src={this.props.src} onClick={this.props.onClick} alt="photo" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'contain'}} />
					:null
				}
			</div>
		)
	}
}