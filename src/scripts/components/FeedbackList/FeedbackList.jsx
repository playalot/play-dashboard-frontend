import React, { Component } from 'react'
import { 
	Row, Form, FormGroup, FormControl, Button, InputGroup, ButtonToolbar
} from 'react-bootstrap'
import { Link } from 'react-router'
import Moment from 'moment'

export default class ReportList extends Component{
	constructor(props) {
	  	super(props);
	
	  	this.state = {};
	  	this.deleteFeedback = this._deleteFeedback.bind(this)
	}
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchFeedback()
		}
	}
	_deleteFeedback(id) {
		if (confirm('Delete this Feedback?')) {
			this.props.deleteFeedback(id)
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
			                      <td><Link to={'/user/'+feedback.user.id}><img src={feedback.user.avatar} style={{width:'50px',height:'50px'}} className="img-circle"/></Link></td>
			                      <td>{feedback.content}</td>
			                      <td>{Moment.unix(feedback.created / 1000).fromNow()}</td>
			                      <td>
			                      	<ButtonToolbar>
			                      	  <a className="btn btn-danger btn-block btn-flat" onClick={() => this.deleteFeedback(feedback.id)}>Delete</a>
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