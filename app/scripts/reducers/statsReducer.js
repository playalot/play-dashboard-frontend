import Immutable from 'immutable'
import { RECEIVE_STATS } from '../actions/statsAction'

export default (state = Immutable.Map({ stats: {} }),action)=>{
    switch (action.type) {
        case RECEIVE_STATS:
            return state.mergeDeep({
                stats: action.res
            })
        default:
            return state
    }
}