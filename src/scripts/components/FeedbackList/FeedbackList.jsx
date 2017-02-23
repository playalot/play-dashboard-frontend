import React, { Component } from 'react'
import { Link } from 'react-router'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'
import PlayAliBaichuan from '../Common/PlayAliBaichuan'
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
		        <div className="table-responsive" style={{paddingBottom:50}}>
		            <table className="table table-striped">
		              	<thead><tr><th>User</th><th>Content</th><th style={{'minWidth': '150px'}}>Created</th><th>userAgent</th></tr></thead>
		              	<tbody>
			              	{
			              		this.props.feedbacks.map((feedback) => {
			              			return(
					                    <tr key={`feedback_${feedback.id}`}>
					                    	<td>
					                    		<div className="btn-group">
												  <img style={{width:'30px'}} src={feedback.user.avatar}  data-toggle="dropdown" className="img-circle"/>
												  <ul className="dropdown-menu">
												    <li><a onClick={() => this.context.router.push(`/user/${feedback.user.id}`)}>查看<small>({feedback.user.nickname})</small></a></li>
												    <li><a onClick={() => this.props.setTouid(feedback.user.id,feedback.user.avatar)}>私信</a></li>
												  </ul>
												</div>
					                    	</td>
					                      	<td>{feedback.content}</td>
					                      	<td>{Moment.unix(feedback.created / 1000).fromNow()}</td>
					                      	<td>{feedback.userAgent||''}</td>
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
		        <PlayAliBaichuan/>
          	</div>
		)
	}
}


FeedbackList.contextTypes = {
  	router : React.PropTypes.object
}
