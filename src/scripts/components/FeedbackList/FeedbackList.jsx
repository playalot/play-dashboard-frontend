import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import { dateFormat } from '../../widgets'

import Lightbox from 'react-images'
import Request from 'superagent'
export default class FeedbackList extends Component{
	constructor(props) {
		super(props)
		this.state = {
			lightboxIsOpen:false,
			images:[],
			currentImage:0,
			reportId:'',
			reportContent:'您的举报已处理',
			feedbackId:'',
			feedbackContent:'',
			logs:[]
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
		this.sendMsg = this._sendMsg.bind(this)
		this.showReportModal = this._showReportModal.bind(this)
		this.sendFeedbackMsg = this._sendFeedbackMsg.bind(this)
		this.showFeedbackModal = this._showFeedbackModal.bind(this)

		this.showLogs = (logs) => {
			this.setState({logs},() => {
				$('#logsModal').modal('show')
			})
		}
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
	componentDidMount() {
		$('#reportModal').on('hidden.bs.modal', (e) => {
			this.setState({
				reportId:''
			})
		})
		$('#feedbackModal').on('hidden.bs.modal', (e) => {
			this.setState({
				feedbackId:'',
				feedbackContent:''
			})
		})
		$('#logsModal').on('hidden.bs.modal', (e) => {
			this.setState({
				logs:[],
			})
		})
	}
	formatUrl(images,caption) {
		images.map((image) => {
			image.src = image.url
		})
		return images
	}
	_sendMsg() {
		const { reportId,reportContent } = this.state
		Request.post(`/api/report/${reportId}/reply`)
		.send({
			content:reportContent
		})
		.end((err,res) => {
			if(err) {
				Toastr.error(`举报失败。`)
			}else{
				this.props.reportPushReply(reportId,res.text)
				Toastr.success(`举报 已通知～`)
				$('#reportModal').modal('hide')

			}

		})
	}
	_showReportModal(reportId) {
		this.setState({reportId},() => {
			$('#reportModal').modal('show')
		})
	}
	_showFeedbackModal(feedbackId,content) {
		
		this.setState({feedbackId,feedbackContent:`您的反馈 ${content} 已处理`},() => {
			$('#feedbackModal').modal('show')
		})
	}
	_sendFeedbackMsg() {
		const { feedbackId,feedbackContent } = this.state
		Request.post(`/api/report/${feedbackId}/reply`)
		.send({
			content:feedbackContent
		})
		.end((err,res) => {
			if(err) {
				Toastr.error(`反馈失败。`)
			}else{
				this.props.feedbackPushReply(feedbackId,res.text)
				Toastr.success(`反馈 已通知～`)
				$('#feedbackModal').modal('hide')

			}
		})
	}
	render() {
		return(
			<div>
				<div className="m-portlet m-portlet--mobile">
					<div className="m-portlet__body pb-0">
						<ul className="nav nav-tabs m-tabs-line m-tabs-line--2x m-tabs-line--success" role="tablist">
							<li className="nav-item m-tabs__item">
								<a className="nav-link m-tabs__link active" data-toggle="tab" href="#report" role="tab">
									举报
								</a>
							</li>
							<li className="nav-item m-tabs__item">
								<a className="nav-link m-tabs__link" data-toggle="tab" href="#feedback" role="tab">
									反馈
								</a>
							</li>
						</ul>
					</div>
					<div className="m-portlet__body">
						<div className="tab-content">
							<div className="tab-pane active" id="report">
								<div className="table-responsive">
									<table className="table table-striped">
										<thead><tr><th>Reporter</th><th>Reason</th><th style={{'minWidth': '150px'}}>Created</th><th>Type</th><th>Thumbnail</th><th style={{'minWidth': 100}}>State</th><th style={{'minWidth': '180px'}}>Operate</th></tr></thead>
										<tbody>
											{
												this.props.reports.map((report) => {
													return(
														<tr key={`report_${report.id}`}>
															<td>
																<Link to={`/user/${report.user.id}`}><img src={report.user.avatar} className="avatar45"/></Link>
															</td>
															<td>{report.content}</td>
															<td>{dateFormat(report.created)}</td>
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
																{
																	report.logs.length ?
																	<span onClick={() => this.showLogs(report.logs)} className="m-badge  m-badge--accent m-badge--wide">已处理</span>
																	:<span className="m-badge  m-badge--secondary m-badge--wide">未处理</span>
																}
															</td>
															<td className="text-right">
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
																<span className="btn btn-sm" onClick={() => this.props.deleteReport(report.id)}><i className="fa fa-check"></i></span>
																<span className="btn btn-sm" onClick={() => this.showReportModal(report.id)}><i className="fa fa-bullhorn"></i></span>
															</td>
														</tr>
													)
												})
											}
										</tbody>
									</table>
								</div>
								<ReactPaginate
									previousLabel={<span>&laquo;</span>}
									nextLabel={<span>&raquo;</span>}
									breakLabel={<a>...</a>}
									breakClassName={"break-me"}
									pageCount={this.props.rPages}
									marginPagesDisplayed={2}
									pageRangeDisplayed={5}
									onPageChange={obj => this.props.getReport(obj.selected)}
									containerClassName={"pagination"}
									subContainerClassName={"pages pagination"}
									forcePage={this.props.rPage || 0}
									activeClassName={"active"} 
								/>
							</div>
							<div className="tab-pane" id="feedback">
								<div className="table-responsive" style={{paddingBottom:50}}>
									<table className="table table-striped">
										<thead><tr><th>User</th><th>Content</th><th style={{'minWidth': '150px'}}>Created</th><th>userAgent</th><th style={{'minWidth': 100}}>State</th></tr></thead>
										<tbody>
											{
												this.props.feedbacks.map((feedback) => {
													return(
														<tr key={`feedback_${feedback.id}`}>
															<td>
																<div className="btn-group">
																<img src={feedback.user.avatar}  data-toggle="dropdown" className="avatar45"/>
																<ul className="dropdown-menu">
																	<li><a onClick={() => this.props.history.push(`/user/${feedback.user.id}`)}>查看<small>({feedback.user.nickname})</small></a></li>
																	<li><a onClick={() => this.props.setTouid(feedback.user.id,feedback.user.avatar)}>私信</a></li>
																</ul>
																</div>
															</td>
															<td>{feedback.content}</td>
															<td>{dateFormat(feedback.created)}</td>
															<td>{feedback.userAgent||''}</td>
															<td>
																{
																	feedback.logs.length ?
																	<span onClick={() => this.showLogs(feedback.logs)} className="m-badge  m-badge--accent m-badge--wide">已处理</span>
																	:<span className="m-badge  m-badge--secondary m-badge--wide">未处理</span>
																}
															</td>
															<td>
																<span onClick={() => this.deleteFeedback(feedback.id)} className="btn btn-sm"><i className="fa fa-trash"></i></span>
																<span className="btn btn-sm" onClick={() => this.showFeedbackModal(feedback.id,feedback.content)}><i className="fa fa-bullhorn"></i></span>
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
									breakLabel={<a>...</a>}
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
				<div className="modal fade" id="reportModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalLabel">举报结果通知</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<textarea value={this.state.reportContent} onChange={(e) => this.setState({reportContent:e.target.value})} className="w-100" name="" id="" cols="30" rows="5"></textarea>
							</div>
							<div className="modal-footer">
								<button onClick={this.sendMsg} type="button" className="btn btn-outline-primary">发送</button>
							</div>
						</div>
					</div>
				</div>
				<div className="modal fade" id="feedbackModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalLabel">反馈结果通知</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<textarea value={this.state.feedbackContent} onChange={(e) => this.setState({feedbackContent:e.target.value})} className="w-100" name="" id="" cols="30" rows="5"></textarea>
							</div>
							<div className="modal-footer">
								<button onClick={this.sendFeedbackMsg} type="button" className="btn btn-outline-primary">发送</button>
							</div>
						</div>
					</div>
				</div>
				<div className="modal fade" id="logsModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalLabel">处理结果</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								{
									this.state.logs.map(log => {
										return(
											<p key={log}>{log}</p>
										)
									})
								}
							</div>
						</div>
					</div>
				</div>
          	</div>
		)
	}
}

