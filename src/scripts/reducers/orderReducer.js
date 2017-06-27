import Immutable from 'immutable'
import { ORDER_L_RECEIVE_ORDER, ORDER_L_RECEIVE_ORDER_BY_TOY,ORDER_L_RECEIVE_ORDER_BY_USER, ORDER_L_ADD_TRACKING,ORDER_L_SET_STATUS,ORDER_L_START_PAY } from '../actions/orderAction'

export default (state = Immutable.fromJS({ orders: [],toy:{}, totalPages:100,order:{},status:'',merchant:'',summary:{},filter:'' }),action)=>{
    switch (action.type) {
        case ORDER_L_RECEIVE_ORDER:
            return state
                .updateIn(['orders'], (orders) => orders.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPages',action.totalPages)
                .set('page',action.page)
                .set('status',action.status)
                .set('merchant',action.merchant)
                .set('year',action.year)
                .set('month',action.month)
                .set('init',true)
                .set('summary',action.summary || {count:0,totalPrice:0})
                .set('filter',action.filter)
        case ORDER_L_RECEIVE_ORDER_BY_TOY:
            return state
                .updateIn(['orders'], orders => orders.clear().concat(Immutable.fromJS(action.orders)))
                .set('toy',action.toy)
        case ORDER_L_RECEIVE_ORDER_BY_USER:
            return state
                .updateIn(['orders'], orders => orders.clear().concat(Immutable.fromJS(action.orders)))
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
        case ORDER_L_START_PAY:
            return state.updateIn(['orders'], orders => {
                return orders.update(
                    orders.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('status','due')
                    }
                )
            })
        default:
            return state
    }
}