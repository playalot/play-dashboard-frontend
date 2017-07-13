import React, { Component } from 'react'
import { Row, Form, FormGroup, FormControl, Button, InputGroup, ButtonToolbar, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'
import { parsePage } from '../../widgets/parse'
import Lightbox from 'react-images'
export default class ReportList extends Component{
	constructor(props) {
		super(props)
		this.state = {
			lightboxIsOpen:false,
			images:[],
			currentImage:0,
		}
		this.deleteReport = (id) => confirm('Delete this report?') && this.props.deleteReport(id)
		this.toggleBlk = (id) => this.props.toggleBlk(id)
		this.openImage = (images,currentImage) => this.setState({ lightboxIsOpen: true,images,currentImage})
		this.closeLightbox = () => this.setState({lightboxIsOpen:false,images:[]})
		this.goPage = this._goPage.bind(this)
	}
	componentWillMount() {
		const { page } = this.props
		if(typeof page === 'number') {
			this.props.history.push(`/reports?page=${page}`)
		}else{
			this.props.getReport(0)
		}
	}
	_goPage(page) {
		this.props.history.push(`/reports?page=${page}`)
		this.props.getReport(page)
	}
	formatUrl(images) {
		images.map((image) => {
			image.src = image.url
		})
		return images
	}
	render() {
		return(
			<div className="content">
				<div className="table-responsive">
					<table className="table table-striped">
						<thead><tr><th>Reporter</th><th>Targeter</th><th>Reason</th><th style={{'minWidth': '150px'}}>Created</th><th>Type</th></tr></thead>
						<tbody>
							{
								this.props.reports.map((report) => {
									let invisibleClass = report.target && report.target.isBlk === true ? 'btn yellow-casablanca btn-sm' : 'btn btn-sm'
									return(
										<tr key={`report_${report.id}`}>
											<td>
												<Link to={`/user/${report.user.id}`}><img style={{width:'45px'}} src={report.user.avatar} className="img-circle"/></Link>
											</td>
												{
													report.targetUser ?
													<td>
														<Link to={`/user/${report.targetUser.id}`}><img style={{width:'45px'}} src={report.targetUser.avatar} className="img-circle"/></Link>
													</td>
													: <td></td>
												}
											<td>{report.reason}</td>
											<td>{Moment.unix(report.created / 1000).fromNow()}</td>
											<td style={{textAlign:'center'}}>
												{
													report.targetType === 'post' && report.target ?
													<img onClick={() => this.openImage(this.formatUrl(report.target.photos),0)} src={report.target.preview} style={{width:'45px'}} className="img-thumbnail"/>
													:null
												}
												{
													report.targetType === 'user' ?
													<a target="_blank" href={`http://www.playalot.cn/user/${report.targetId}`}>用户</a>
													:null
												}
											</td>
											<td>
												<ButtonToolbar>
													{
														report.targetType === 'post' ?
														<span className={invisibleClass} onClick={() => this.toggleBlk(report.targetId)}><i className="fa fa-eye-slash"></i></span>
														: <span></span>
													}
		            				  				<span className="btn btn-sm pull-right" onClick={() => this.deleteReport(report.id)}><i className="fa fa-check"></i></span>
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
						pageCount={this.props.totalPages}
						marginPagesDisplayed={2}
						pageRangeDisplayed={5}
						onPageChange={obj => this.goPage(obj.selected)}
						containerClassName={"pagination"}
						subContainerClassName={"pages pagination"}
						forcePage={parsePage(this.props.location.search)}
						activeClassName={"active"} />
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
      		</div>
		)
	}
}
