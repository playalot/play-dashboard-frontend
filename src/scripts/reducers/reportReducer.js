import Immutable from 'immutable'
import { REL_RECEIVE_REPORT } from '../actions/reportAction'

export default (state = Immutable.fromJS({ reports: [], loaded:false }),action)=>{
    switch (action.type) {
        case REL_RECEIVE_REPORT:
            return state.updateIn(['reports'],(reports) => reports.concat(Immutable.fromJS(action.res))).set('loaded',true)
        default:
            return state
    }
}