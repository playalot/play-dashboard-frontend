import React, { Component } from 'react'
import { Link } from 'react-router'
import Moment from 'moment'

export default class ReportList extends Component{
	constructor(props) {
	  	super(props)
	  	this.deleteFeedback = (id) => confirm('Delete this Feedback?') && this.props.deleteFeedback(id)
	}
	componentWillMount() {
		!this.props.loaded && this.props.fetchFeedback()
	}
	render() {
		return(
			<div className="content">
		        <div className="table-responsive">
		            <table className="table table-striped">
		              	<thead><tr><th>ID</th><th>User</th><th>Content</th><th style={{'minWidth': '150px'}}>Created</th></tr></thead>
		              	<tbody>
			              	{
			              		this.props.feedbacks.map((feedback) => {
			              			return(
					                    <tr key={`feedback_${feedback.id}`}>
					                      	<td>{feedback.id}</td>
					                      	<td><Link to={'/user/'+feedback.user.id}><img src={feedback.user.avatar} style={{width:'50px',height:'50px'}} className="img-circle"/></Link></td>
					                      	<td>{feedback.content}</td>
					                      	<td>{Moment.unix(feedback.created / 1000).fromNow()}</td>
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
          	</div>
		)
	}
}