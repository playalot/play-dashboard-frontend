import Immutable from 'immutable'
import {
	SKL_RECEIVE_SKU, SKL_RECEIVE_SKU_NEW,
} from '../actions/skuAction'

export default (state = Immutable.fromJS({ skus: [], loaded:false }),action)=>{
    switch (action.type) {
        case SKL_RECEIVE_SKU:
            return state.updateIn(['skus'], (skus) => skus.concat(Immutable.fromJS(action.res))).set('loaded',true)
        case SKL_RECEIVE_SKU_NEW:
            return state.updateIn(['skus'], (skus) => skus.clear().concat(Immutable.fromJS(action.res)))
        default:
            return state
    }
}
