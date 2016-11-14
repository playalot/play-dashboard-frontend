import Immutable from 'immutable'
import { ORDER_L_RECEIVE_ORDER, ORDER_L_ADD_TRACKING, ORDER_L_FETCH_BY_ID } from '../actions/orderAction'

export default (state = Immutable.fromJS({ orders: [], loaded:false,order:{} }),action)=>{
    switch (action.type) {
        case ORDER_L_RECEIVE_ORDER:
            return state.updateIn(['orders'],(orders) => orders.clear().concat(Immutable.fromJS(action.res))).set('loaded',true)
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
        case ORDER_L_FETCH_BY_ID:
            let index = state.get('orders').findIndex((item) => {
                return item.get('id') === action.id
            })
            return state.set('order',state.getIn(['orders',index]))
        default:
            return state
    }
}