import Immutable from 'immutable'
import { HOME_RECEIVE_STATS } from '../actions/statsAction'

export default (state = Immutable.Map({ stats: {}, loaded:false }),action)=>{
    switch (action.type) {
        case HOME_RECEIVE_STATS:
            return state.mergeDeep({
                stats: action.res,
                loaded:true
            })
        default:
            return state
    }
}