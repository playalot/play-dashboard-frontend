import Immutable from 'immutable'
import { FEL_RECEIVE_FEEDBACK, FEL_DELETE_FEEDBACK } from '../actions/feedbackAction'

export default (state = Immutable.fromJS({ feedbacks: [], loaded:false }),action)=>{
    switch (action.type) {
        case FEL_RECEIVE_FEEDBACK:
            return state.updateIn(['feedbacks'],(feedbacks) => feedbacks.concat(Immutable.fromJS(action.res))).set('loaded',true)
        case FEL_DELETE_FEEDBACK:
        	return state.updateIn(['feedbacks'],(feedbacks) => {
        		return feedbacks.delete(feedbacks.findKey((feedback) => {
                    return feedback.get('id') === action.id
                }))
        	})
        default:
            return state
    }
}