import Immutable from 'immutable'
import {
	SKL_RECEIVE_SKU, SKL_RECEIVE_SKU_NEW,
    SKL_TOGGLE_BLK,SKL_TOGGLE_REC,
    SKL_SET_STOCK
} from '../actions/skuAction'

export default (state = Immutable.fromJS({ skus: [], loaded:false,stock:{} }),action)=>{
    switch (action.type) {
        case SKL_RECEIVE_SKU:
            return state.updateIn(['skus'], (skus) => skus.concat(Immutable.fromJS(action.res))).set('loaded',true)
        case SKL_RECEIVE_SKU_NEW:
            return state.updateIn(['skus'], (skus) => skus.clear().concat(Immutable.fromJS(action.res)))
        case SKL_TOGGLE_BLK:
            return state.updateIn(['skus'], (skus) => {
                return skus.update(
                    skus.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('isBlk', !item.get('isBlk'));
                    }
                )
            })
        case SKL_TOGGLE_REC:
            return state.updateIn(['skus'], (skus) => {
                return skus.update(
                    skus.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('isRec', !item.get('isRec'));
                    }
                )
            })
        case SKL_SET_STOCK:
            return state.updateIn(['stock'],(stock) => stock.clear().merge(Immutable.fromJS(action.res)))
        default:
            return state
    }
}
