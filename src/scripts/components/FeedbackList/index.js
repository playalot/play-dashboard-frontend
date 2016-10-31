import { connect } from 'react-redux'
import FeedbackList from './FeedbackList'

import { fetchFeedback, deleteFeedback } from '../../actions/feedbackAction'
const mapActionCreators = {
	fetchFeedback,
	deleteFeedback
}

const mapStateToProps = (state) => {
	const { feedbacks,loaded }  = state.feedback.toJS()
    return {
    	feedbacks,
    	loaded,
    }
}

export default connect(mapStateToProps, mapActionCreators)(FeedbackList)