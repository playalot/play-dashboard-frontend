import Immutable from 'immutable'
import { HOME_RECEIVE_STATS,HOME_RECEIVE_ACTIVITIES } from '../actions/statsAction'

export default (state = Immutable.fromJS({ stats: {}, loaded:false,activities:[] }),action)=>{
    switch (action.type) {
        case HOME_RECEIVE_STATS:
            return state.mergeDeep({
                stats: action.res,
                loaded:true
            })
        case HOME_RECEIVE_ACTIVITIES:
        	return state
                .updateIn(['activities'], (activities) => activities.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPages',action.totalPages)
                .set('page',action.page)
        default:
            return state
    }
}