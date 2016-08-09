import Immutable from 'immutable'
import { RECEIVE_HOMEADS, DELETE_HOMEADS } from '../actions/recommendHomeAction'

export default (state = Immutable.fromJS({ homeads: [] }),action)=>{
    switch (action.type) {
        case RECEIVE_HOMEADS:
            return state.set('homeads',Immutable.fromJS(action.res))

        case DELETE_HOMEADS:
        	return state.updateIn(['homeads'], (homeads) => {
                return homeads.delete(homeads.findKey((homead) => {
                    return homead.get('id') === action.id
                }))
            })
        default:
            return state
    }
}