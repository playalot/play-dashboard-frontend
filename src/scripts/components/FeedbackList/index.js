import { connect } from 'react-redux'
import FeedbackList from './FeedbackList'

import {fetchFeedback} from '../../actions/feedbackAction'
const mapActionCreators = {
	fetchFeedback
}

const mapStateToProps = (state) => {
	const { feedbacks,loaded }  = state.feedbackReducer.toJS()
    return {
    	feedbacks,
    	loaded,
    }
}

export default connect(mapStateToProps, mapActionCreators)(FeedbackList)