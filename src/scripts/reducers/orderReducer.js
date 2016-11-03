import Immutable from 'immutable'
import { ORDER_L_RECEIVE_ORDER, ORDER_L_ADD_TRACKING } from '../actions/orderAction'

export default (state = Immutable.fromJS({ orders: [], loaded:false }),action)=>{
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
        default:
            return state
    }
}