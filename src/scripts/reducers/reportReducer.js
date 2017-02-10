import Immutable from 'immutable'
import { REL_RECEIVE_REPORT, REL_DELETE_REPORT, REL_TOGGLE_BLK } from '../actions/reportAction'

export default (state = Immutable.fromJS({ reports: [], totalPages:10 }),action)=>{
    switch (action.type) {
        case REL_RECEIVE_REPORT:
            return state.updateIn(['reports'],(reports) => reports.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPages',action.totalPages)
                .set('page',action.page)
        case REL_DELETE_REPORT:
        	return state.updateIn(['reports'],(reports) => {
        		return reports.delete(reports.findKey((report) => {
                    return report.get('id') === action.id
                }))
        	})
        case REL_TOGGLE_BLK:
            return state.updateIn(['reports'],(reports) => {
                return reports.update(
                    reports.findIndex((item) => {
                        return item.get('targetId') === action.id
                    }), (item) => {
                        return item.setIn(['target','isBlk'], !item.getIn(['target','isBlk']));
                    }
                )
            })
        default:
            return state
    }
}