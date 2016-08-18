import React, { Component } from 'react'
import { 
	Row, Form, FormGroup, FormControl, Button, InputGroup, ButtonToolbar
} from 'react-bootstrap'
import { Link } from 'react-router'
import Moment from 'moment'

export default class ReportList extends Component{
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchReport()
		}
	}
	render() {
		return(
			<div className="content">
	          <div className="table-responsive">
	            <table className="table table-striped">
	           	  <thead><tr><th>#ID</th><th>Reporter</th><th>Type</th><th>Reason</th><th style={{'minWidth': '150px'}}>Created</th><th>Action</th></tr></thead>
	              <tbody>
	              	{
	              		this.props.reports.map((report) => {
	              			return(
			                    <tr key={`r_${report.id}`}>
			                      <td>{report.id}</td>
			                      <td>{report.user.nickname}</td>
			                      <td>{report.targetType}</td>
			                      <td>{report.reason}</td>
			                      <td>{Moment.unix(report.created / 1000).fromNow()}</td>
			                      <td>
			                      	<div className="btn-group">
			                      	  <button type="button" className="btn btn-danger"><i className="fa fa-trash"></i></button>
									  <button type="button" className="btn btn-warning"><i className="fa fa-eye-slash"></i></button>
									  <button type="button" className="btn btn-success"><i className="fa fa-check"></i></button>
			                        </div>
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