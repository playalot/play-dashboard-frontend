import Immutable from 'immutable'
import { REL_RECEIVE_REPORT, REL_DELETE_REPORT } from '../actions/reportAction'

export default (state = Immutable.fromJS({ reports: [], loaded:false }),action)=>{
    switch (action.type) {
        case REL_RECEIVE_REPORT:
            return state.updateIn(['reports'],(reports) => reports.concat(Immutable.fromJS(action.res))).set('loaded',true)
        case REL_DELETE_REPORT:
        	return state.updateIn(['reports'],(reports) => {
        		return reports.delete(reports.findKey((report) => {
                    return report.get('id') === action.id
                }))
        	})
        default:
            return state
    }
}