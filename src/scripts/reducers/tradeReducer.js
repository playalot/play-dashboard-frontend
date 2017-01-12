import Immutable from 'immutable'
import { TRADE_L_RECEIVE_TRADE } from '../actions/tradeAction'

export default (state = Immutable.fromJS({ trades:[], totalPages:10, }),action)=>{
    switch (action.type) {
        case TRADE_L_RECEIVE_TRADE:
            return state
                .updateIn(['trades'], (trades) => trades.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPages',action.totalPages)
                .set('page',action.page)
        default:
            return state
    }
}