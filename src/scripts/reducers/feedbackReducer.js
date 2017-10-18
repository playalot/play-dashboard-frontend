import Immutable from 'immutable'
import { 
    FEEDBACK_RECEIVE_DATA, FEEDBACK_DELETE_FEEDBACK, FEEDBACK_REPLY_LOG,
    REPORT_RECEIVE_DATA, REPORT_DELETE_REPORT, REPORT_TOGGLE_BLK,REPORT_TOGGLE_R18,REPORT_REPLY_LOG
} from '../actions/feedbackAction'

export default (state = Immutable.fromJS({ 
    feedbacks: [],fPages:10,
    reports:[],rPages:10,

}),action)=>{
    switch (action.type) {
        case FEEDBACK_RECEIVE_DATA:
            return state.updateIn(['feedbacks'],(feedbacks) => feedbacks.clear().concat(Immutable.fromJS(action.feedbacks)))
                .set('fPages',action.totalPages)
                .set('fPage',action.page)
        case FEEDBACK_DELETE_FEEDBACK:
        	return state.updateIn(['feedbacks'],(feedbacks) => {
        		return feedbacks.delete(feedbacks.findKey((feedback) => {
                    return feedback.get('id') === action.id
                }))
            })

        case REPORT_RECEIVE_DATA:
            return state.updateIn(['reports'],(reports) => reports.clear().concat(Immutable.fromJS(action.reports)))
                .set('rPages',action.totalPages)
                .set('rPage',action.page)
        case REPORT_DELETE_REPORT:
        	return state.updateIn(['reports'],(reports) => {
        		return reports.delete(reports.findKey((report) => {
                    return report.get('id') === action.id
                }))
        	})
        case REPORT_TOGGLE_BLK:
            return state.updateIn(['reports'],(reports) => {
                return reports.update(
                    reports.findIndex((item) => {
                        return item.get('targetId') === action.id
                    }), (item) => {
                        return item.setIn(['target','isBlk'], !item.getIn(['target','isBlk']));
                    }
                )
            })
        case REPORT_TOGGLE_R18:
            return state.updateIn(['reports'],(reports) => {
                return reports.update(
                    reports.findIndex((item) => {
                        return item.get('targetId') === action.id
                    }), (item) => {
                        return item.setIn(['target','isR18'], !item.getIn(['target','isR18']));
                    }
                )
            })
        case REPORT_REPLY_LOG:
            return state.updateIn(['reports'], (reports) => {
                return reports.update(
                    reports.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.updateIn(['logs'], (logs) => {
                            return logs.push(Immutable.fromJS(action.log))
                        })
                    }
                )
            })
        case FEEDBACK_REPLY_LOG:
            return state.updateIn(['feedbacks'], (feedbacks) => {
                return feedbacks.update(
                    feedbacks.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.updateIn(['logs'], (logs) => {
                            return logs.push(Immutable.fromJS(action.log))
                        })
                    }
                )
            })
        default:
            return state
    }
}