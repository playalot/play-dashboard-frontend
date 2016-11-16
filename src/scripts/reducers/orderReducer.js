import Immutable from 'immutable'
import { ORDER_L_RECEIVE_ORDER, ORDER_L_ADD_TRACKING,ORDER_L_SET_STATUS } from '../actions/orderAction'

export default (state = Immutable.fromJS({ orders: [], totalPages:100,order:{} }),action)=>{
    switch (action.type) {
        case ORDER_L_RECEIVE_ORDER:
            return state
                .updateIn(['orders'], (orders) => orders.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPages',action.totalPages)
                .set('page',action.page)
        case ORDER_L_ADD_TRACKING:
        	return state.updateIn(['orders'],(orders) => {
        		return orders.update(
        			orders.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.setIn(['tracking'],{number:action.trackNo})
                    }
        		)
        	})
        case ORDER_L_SET_STATUS:
            return state.updateIn(['orders'], orders => {
                return orders.update(
                    orders.findIndex((item) => {
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