import { connect } from 'react-redux'
import FeedbackList from './FeedbackList'

import { getFeedback, deleteFeedback } from '../../actions/feedbackAction'
const mapActionCreators = {
	getFeedback,
	deleteFeedback
}

const mapStateToProps = (state) => {
	const { feedbacks,page,totalPages }  = state.feedback.toJS()
    return {
    	feedbacks,
    	page,
    	totalPages,
    }
}

export default connect(mapStateToProps, mapActionCreators)(FeedbackList)