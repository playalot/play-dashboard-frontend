import React, { Component } from 'react'
import { Link } from 'react-router'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'
export default class FeedbackList extends Component{
	constructor(props) {
	  	super(props)
	  	this.deleteFeedback = (id) => confirm('Delete this Feedback?') && this.props.deleteFeedback(id)
	  	this.goPage = this._goPage.bind(this)
	}
	componentWillMount() {
		const { page } = this.props
		if(typeof page === 'number') {
			this.context.router.push(`/feedback?page=${page}`)
		}else{
			this.props.getFeedback(this.props.location.query.page)
		}
	}
	_goPage(page) {
		this.context.router.push(`/feedback?page=${page}`)
		this.props.getFeedback(page)
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
          	</div>
		)
	}
}


FeedbackList.contextTypes = {
  	router : React.PropTypes.object
}
