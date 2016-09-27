import Immutable from 'immutable'
import { REC_HOME_RECEIVE_HOMEADS, REC_HOME_DELETE_HOMEAD } from '../actions/recommendHomeAction'

export default (state = Immutable.fromJS({ homeads: [],loaded:false }),action)=>{
    switch (action.type) {
        case REC_HOME_RECEIVE_HOMEADS:
            return state.set('homeads',Immutable.fromJS(action.res)).set('loaded',true)
        case REC_HOME_DELETE_HOMEAD:
        	return state.updateIn(['homeads'], (homeads) => {
                return homeads.delete(homeads.findKey((homead) => {
                    return homead.get('id') === action.id
                }))
            })
        default:
            return state
    }
}