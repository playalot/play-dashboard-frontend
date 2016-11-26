import Immutable from 'immutable'
import {
	SKL_RECEIVE_SKU, SKL_DELETE_SKU,
    SKL_TOGGLE_BLK,SKL_TOGGLE_REC,
} from '../actions/skuAction'

export default (state = Immutable.fromJS({ skus: [],totalPages:100,filter:'',filterType:'' }),action)=>{
    switch (action.type) {
        case SKL_RECEIVE_SKU:
            return state
                .updateIn(['skus'], (skus) => skus.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPages',action.totalPages)
                .set('page',action.page)
                .set('filter',action.filter)
                .set('filterType',action.filterType)
        case SKL_DELETE_SKU:
           return state.updateIn(['skus'], (skus) => {
                return skus.update(
                    skus.findIndex((items) => {
                        return items.get('id') === action.id
                    }), (item) => {
                        return item.updateIn(['stocks'],stocks => {
                            return stocks.delete(stocks.findIndex((stock) => {
                                stock.stockId = action.sid
                            }))
                        })
                    }
                )
            })
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
        default:
            return state
    }
}
