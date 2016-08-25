import React, { Component } from 'react'
import { 
	Row, Form, FormGroup, FormControl, Button, InputGroup, ButtonToolbar, Modal
} from 'react-bootstrap'
import { Link } from 'react-router'
import Moment from 'moment'

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
	}
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchReport()
		}
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
	           	  <thead><tr><th>#ID</th><th>Reporter</th><th>Targeter</th><th>Reason</th><th style={{'minWidth': '150px'}}>Created</th><th style={{'minWidth': '150px'}}>Action</th></tr></thead>
	              <tbody>
	              	{
	              		this.props.reports.map((report) => {
	              			if(!report.target){
	              				return
	              			}
	              			let invisibleClass = report.target.isBlk === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
	              			return(
			                    <tr key={`report_${report.id}`}>
			                      <td>{report.id}</td>
			                      <td>
			                      	<Link to={`/user/${report.user.id}`}>{report.user.nickname}</Link>
			                      </td>
			                      <td>
			                      	<Link to={`/user/${report.target.user.id}`}>{report.target.user.nickname}</Link>
			                      </td>
			                      <td>{report.reason}</td>
			                      <td>{Moment.unix(report.created / 1000).fromNow()}</td>
			                      <td>
			                      	<ButtonToolbar>
	                				  <span className="btn btn-sm" onClick={() => this.openModal(report.target.photos)}><i className="fa fa-image"></i></span>
	                				  <span className={invisibleClass} onClick={() => this.toggleBlk(report.targetId)}><i className="fa fa-eye-slash"></i></span>
	                				  <span className="btn btn-sm" onClick={() => this.deleteReport(report.id)}><i className="fa fa-check"></i></span>
	                				</ButtonToolbar>
			                      </td>
			                    </tr>
	              			)
	              		})
	              	}
	              </tbody>
	            </table>
	          </div>
	          <Modal show={this.state.showModal && this.state.photos} onHide={this.closeModal}>
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