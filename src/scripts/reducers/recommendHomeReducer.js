import Immutable from 'immutable'
import { RH_RECEIVE_HOMEADS, RH_DELETE_HOMEAD } from '../actions/recommendHomeAction'

export default (state = Immutable.fromJS({ homeads: [],loaded:false }),action)=>{
    switch (action.type) {
        case RH_RECEIVE_HOMEADS:
            return state.set('homeads',Immutable.fromJS(action.res)).set('loaded',true)
        case RH_DELETE_HOMEAD:
        	return state.updateIn(['homeads'], (homeads) => {
                return homeads.delete(homeads.findKey((homead) => {
                    return homead.get('id') === action.id
                }))
            })
        default:
            return state
    }
}