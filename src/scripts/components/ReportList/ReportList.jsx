import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
	Row, Form, FormGroup, FormControl, Button, InputGroup, ButtonToolbar, Modal
} from 'react-bootstrap'
import { Link } from 'react-router'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'
export default class ReportList extends Component{
	constructor(props) {
  	super(props)
  	this.state = {
  		showModal:false,
  		photos:[],
  		showIndex:0,
  		showImage:'',
  	}
  	this.deleteReport = this._deleteReport.bind(this)
  	this.toggleBlk = (id) => this.props.toggleBlk(id)

  	this.closeModal = () => this.setState({showModal:false,photos:[],showIndex:0,showImage:''})
  	this.openModal = this._openModal.bind(this)
  	this.prePhoto = this._prePhoto.bind(this)
  	this.nextPhoto = this._nextPhoto.bind(this)

  	this.goPage = this._goPage.bind(this)
	}
	componentWillMount() {
		const { page } = this.props
		if(typeof page === 'number') {
			this.context.router.push(`/report?page=${page}`)
		}else{
			this.props.getReport(this.props.location.query.page)
		}
	}
	_goPage(page) {
		this.context.router.push(`/report?page=${page}`)
		this.props.getReport(page)
	}
	_openModal(photos) {
		this.setState({
			photos:photos,
			showImage:photos[0].url
		},() => {
			this.setState({
				showModal:true
			})
		})
	}
	_prePhoto() {
		this.setState({
			showIndex:--this.state.showIndex
		},() => {
			this.setState({
				showImage:this.state.photos[this.state.showIndex].url
			})
		})

	}
	_nextPhoto() {
		this.setState({
			showIndex:++this.state.showIndex
		},() => {
			this.setState({
				showImage:this.state.photos[this.state.showIndex].url
			})
		})
	}
	_deleteReport(id) {
		if (confirm('Delete this report?')) {
			this.props.deleteReport(id)
    }
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
            			let invisibleClass = report.target && report.target.isBlk === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
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
                    			<img onClick={() => this.openModal(report.target.photos)} src={report.target.preview} style={{width:'45px'}} className="img-thumbnail"/>
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
						forcePage={this.props.location.query.page ? parseInt(this.props.location.query.page) : 0}
						activeClassName={"active"} />
		    </div>
        <Modal show={!!(this.state.showModal && this.state.photos.length)} onHide={this.closeModal}>
          <Modal.Body>
          	{
          		this.state.showIndex > 0 ?
          		<span onClick={this.prePhoto} className="fa fa-angle-left btn-pre"></span>
          		:null
          	}
         		<img className="image-modal" src={this.state.showImage}/>
            	{
          		this.state.showIndex < (this.state.photos.length - 1) ?
          		<span onClick={this.nextPhoto} className="fa fa-angle-right btn-next"></span>
          		:null
          	}
          </Modal.Body>
        </Modal>
      </div>
		)
	}
}


ReportList.contextTypes = {
  	router : PropTypes.object
}
