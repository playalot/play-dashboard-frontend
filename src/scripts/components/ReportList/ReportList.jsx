import React, { Component } from 'react'
import { 
	Row, Form, FormGroup, FormControl, Button, InputGroup, ButtonToolbar
} from 'react-bootstrap'
import { Link } from 'react-router'
import Moment from 'moment'

export default class ReportList extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {}
	  	this.deleteReport = this._deleteReport.bind(this)
	}
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchReport()
		}
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
	           	  <thead><tr><th>#ID</th><th>Reporter</th><th>Type</th><th>Reason</th><th style={{'minWidth': '150px'}}>Created</th><th style={{'minWidth': '150px'}}>Action</th></tr></thead>
	              <tbody>
	              	{
	              		this.props.reports.map((report) => {
	              			return(
			                    <tr key={`report_${report.id}`}>
			                      <td>{report.id}</td>
			                      <td>
			                      	<Link to={`/user/${report.user.id}`}>{report.user.nickname}</Link>
			                      </td>
			                      <td>{report.targetType}</td>
			                      <td>{report.reason}</td>
			                      <td>{Moment.unix(report.created / 1000).fromNow()}</td>
			                      <td>
			                      	<ButtonToolbar>
	                				  <span className="btn btn-sm"><i className="fa fa-trash"></i></span>
	                				  <span className="btn btn-sm"><i className="fa fa-eye-slash"></i></span>
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
          	</div>
		)
	}
}