import Immutable from 'immutable'
import { ORDER_L_RECEIVE_ORDER } from '../actions/orderAction'

export default (state = Immutable.fromJS({ orders: [], loaded:false }),action)=>{
    switch (action.type) {
        case ORDER_L_RECEIVE_ORDER:
            return state.updateIn(['orders'],(orders) => orders.clear().concat(Immutable.fromJS(action.res))).set('loaded',true)
        default:
            return state
    }
}