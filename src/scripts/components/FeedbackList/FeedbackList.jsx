import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'
import PlayAliBaichuan from '../Common/PlayAliBaichuan'
import { parsePage } from '../../widgets/parse'

import { Row, Form, FormGroup, FormControl, Button, InputGroup, ButtonToolbar, Modal } from 'react-bootstrap'
import Lightbox from 'react-images'

export default class FeedbackList extends Component{
	constructor(props) {
		super(props)
		this.state = {
			lightboxIsOpen:false,
			images:[],
			currentImage:0,
		}
	  	this.deleteFeedback = (id) => confirm('Delete this Feedback?') && this.props.deleteFeedback(id)

		this.openImage = (images) => {
			const imgs = images.map(image => {
				return {
					src:image
				}
			})
			this.setState({ lightboxIsOpen: true,images:imgs,currentImage:0})
		}
		this.closeLightbox = () => this.setState({lightboxIsOpen:false,images:[]})
				
	}
	componentWillMount() {
		const { fPage,rPage } = this.props

		if(typeof fPage !== 'number') {
			this.props.getFeedback()
		}
		if(typeof rPage !== 'number') {
			this.props.getReport()
		}
	}
	formatUrl(images,caption) {
		images.map((image) => {
			image.src = image.url
		})
		return images
	}
	render() {
		return(
			<div className="content">
				<div className="portlet light ">
					<div className="portlet-title tabbable-line">
						<div className="caption caption-md">
							<span className="caption-subject font-blue-madison bold uppercase"></span>
						</div>
						<ul className="nav nav-tabs">
							<li className="active">
								<a href="#report" data-toggle="tab">举报</a>
							</li>
							<li>
								<a href="#feedback" data-toggle="tab">反馈</a>
							</li>
						</ul>
					</div>
					<div className="portlet-body">
						<div className="tab-content">
							<div className="tab-pane active" id="report">
								<div className="table-responsive">
									<table className="table table-striped">
										<thead><tr><th>Reporter</th><th>Reason</th><th style={{'minWidth': '150px'}}>Created</th><th>Type</th><th>Thumbnail</th><th style={{'minWidth': '130px'}}>Operate</th></tr></thead>
										<tbody>
											{
												this.props.reports.map((report) => {
													return(
														<tr key={`report_${report.id}`}>
															<td>
																<Link to={`/user/${report.user.id}`}><img style={{width:'45px'}} src={report.user.avatar} className="img-circle"/></Link>
															</td>
															<td>{report.content}</td>
															<td>{Moment.unix(report.created / 1000).fromNow()}</td>
															<td style={{textAlign:'center'}}>
																{
																	report.targetType === 'post' ?
																	<Link to={`/post/${report.targetId}`}>图片</Link>
																	:null
																}
																{
																	report.targetType === 'user' ?
																	<Link to={`/user/${report.targetId}`}>用户</Link>
																	:null
																}
															</td>
															<td>
																{
																	report.images.length ?
																	<img onClick={() => this.openImage(report.images)} src={report.images[0]} style={{width:'45px'}} className="img-thumbnail"/>
																	:null
																}
															</td>
															<td>
																<ButtonToolbar>
																	<span className="btn btn-sm" onClick={() => this.props.deleteReport(report.id)}><i className="fa fa-check"></i></span>
																	{
																		report.targetType === 'post' ?
																		<span className="btn btn-sm" onClick={() => this.props.toggleBlk(report.targetId)}><i className="fa fa-eye-slash"></i></span>
																		: <span></span>
																	}
																	{
																		report.targetType === 'post' ?
																		<span className="btn btn-sm" onClick={() => this.props.toggleR18(report.targetId)}><i className="fa fa-venus-mars"></i></span>
																		: <span></span>
																	}
																</ButtonToolbar>
															</td>
														</tr>
													)
												})
											}
										</tbody>
									</table>
								</div>
								<div style={{textAlign:'center'}}>
									<ReactPaginate
										previousLabel={<span>&laquo;</span>}
										nextLabel={<span>&raquo;</span>}
										breakLabel={<span>...</span>}
										breakClassName={"break-me"}
										pageCount={this.props.rPages}
										marginPagesDisplayed={2}
										pageRangeDisplayed={5}
										onPageChange={obj => this.props.getReport(obj.selected)}
										containerClassName={"pagination"}
										subContainerClassName={"pages pagination"}
										forcePage={this.props.rPage || 0}
										activeClassName={"active"} />
								</div>
							</div>
							<div className="tab-pane" id="feedback">
								<div className="table-responsive" style={{paddingBottom:50}}>
									<table className="table table-striped">
										<thead><tr><th>User</th><th>Content</th><th style={{'minWidth': '150px'}}>Created</th><th>userAgent</th></tr></thead>
										<tbody>
											{
												this.props.feedbacks.map((feedback) => {
													return(
														<tr key={`feedback_${feedback.id}`}>
															<td>
																<div className="btn-group">
																<img style={{width:'30px'}} src={feedback.user.avatar}  data-toggle="dropdown" className="img-circle"/>
																<ul className="dropdown-menu">
																	<li><a onClick={() => this.props.history.push(`/user/${feedback.user.id}`)}>查看<small>({feedback.user.nickname})</small></a></li>
																	<li><a onClick={() => this.props.setTouid(feedback.user.id,feedback.user.avatar)}>私信</a></li>
																</ul>
																</div>
															</td>
															<td>{feedback.content}</td>
															<td>{Moment.unix(feedback.created / 1000).fromNow()}</td>
															<td>{feedback.userAgent||''}</td>
															<td>
																<span onClick={() => this.deleteFeedback(feedback.id)} className="btn btn-sm"><i className="fa fa-trash"></i></span>
															</td>
														</tr>
													)
												})
											}
										</tbody>
									</table>
								</div>
								<div style={{textAlign:'center'}}>
								<ReactPaginate
									previousLabel={<span>&laquo;</span>}
									nextLabel={<span>&raquo;</span>}
									breakLabel={<span>...</span>}
									breakClassName={"break-me"}
									pageCount={this.props.fPages}
									marginPagesDisplayed={2}
									pageRangeDisplayed={5}
									onPageChange={obj => this.props.getFeedback(obj.selected)}
									containerClassName={"pagination"}
									subContainerClassName={"pages pagination"}
									forcePage={this.props.fPage || 0}
									activeClassName={"active"} />
								</div>
							</div>
						</div>
					</div>
				</div>
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
		        <PlayAliBaichuan/>
          	</div>
		)
	}
}

