import { connect } from 'react-redux'
import FeedbackList from './FeedbackList'

import { getFeedback, deleteFeedback,getReport, deleteReport, toggleBlk,toggleR18,reportPushReply,feedbackPushReply } from '../../actions/feedbackAction'
import { setTouid } from '../../actions/adminAction'
const mapActionCreators = {
	getFeedback,
	deleteFeedback,

	getReport,
	deleteReport,
	toggleBlk,
	toggleR18,
	reportPushReply,
	feedbackPushReply,
	
	setTouid,
}

const mapStateToProps = (state) => {
	const { feedbacks,fPage,fPages,reports,rPage,rPages }  = state.feedback.toJS()
    return {
		feedbacks,fPage,fPages,
		reports,rPages,rPage
	}

}

export default connect(mapStateToProps, mapActionCreators)(FeedbackList)