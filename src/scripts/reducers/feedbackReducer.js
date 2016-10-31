import Immutable from 'immutable'
import { FB_L_RECEIVE_FEEDBACK, FB_L_DELETE_FEEDBACK } from '../actions/feedbackAction'

export default (state = Immutable.fromJS({ feedbacks: [], loaded:false }),action)=>{
    switch (action.type) {
        case FB_L_RECEIVE_FEEDBACK:
            return state.updateIn(['feedbacks'],(feedbacks) => feedbacks.concat(Immutable.fromJS(action.res))).set('loaded',true)
        case FB_L_DELETE_FEEDBACK:
        	return state.updateIn(['feedbacks'],(feedbacks) => {
        		return feedbacks.delete(feedbacks.findKey((feedback) => {
                    return feedback.get('id') === action.id
                }))
        	})
        default:
            return state
    }
}