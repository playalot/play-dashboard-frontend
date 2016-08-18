import React, { Component } from 'react'
import { 
	Row, Form, FormGroup, FormControl, Button, InputGroup, ButtonToolbar
} from 'react-bootstrap'
import { Link } from 'react-router'
import Moment from 'moment'

export default class ReportList extends Component{
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchFeedback()
		}
	}
	render() {
		return(
			<div className="content">
	          <div className="table-responsive">
	            <table className="table table-striped">
	              <thead><tr><th>#ID</th><th>User</th><th>Content</th><th style={{'minWidth': '150px'}}>Created</th><th>Action</th></tr></thead>
	              <tbody>
	              	{
	              		this.props.feedbacks.map((feedback) => {
	              			return(
			                    <tr key={`r_${feedback.id}`}>
			                      <td>{feedback.id}</td>
			                      <td>{feedback.user.nickname}</td>
			                      <td>{feedback.content}</td>
			                      <td>{Moment.unix(feedback.created / 1000).fromNow()}</td>
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