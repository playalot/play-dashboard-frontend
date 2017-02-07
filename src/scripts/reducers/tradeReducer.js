import Immutable from 'immutable'
import { TRADE_L_RECEIVE_TRADE, TRADE_L_CHANGE_STATUS } from '../actions/tradeAction'

export default (state = Immutable.fromJS({ trades:[], totalPages:10, }),action)=>{
    switch (action.type) {
        case TRADE_L_RECEIVE_TRADE:
            return state
                .updateIn(['trades'], (trades) => trades.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPages',action.totalPages)
                .set('page',action.page)
        case TRADE_L_CHANGE_STATUS:
        	return state
        		.updateIn(['trades'],(trades) => {
        			return trades.update(
	        			trades.findIndex((item) => {
	                        return item.get('id') === action.id
	                    }), (item) => {
	                        return item.set('status',action.status)
	                    }
        			)
        		})
        default:
            return state
    }
}