import Immutable from 'immutable'
import {
	SKL_RECEIVE_SKU, SKL_DELETE_SKU,
    SKL_TOGGLE_BLK,SKL_TOGGLE_REC,
    SKU_REMOVE_TOY_CLASS,SKU_ADD_TOY_CLASS
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
        case SKU_ADD_TOY_CLASS:
            return state.updateIn(['skus'], (skus) => {
                return skus.update(
                    skus.findIndex((item) => {
                        return item.get('id') === action.tid
                    }), (item) => {
                        return item.updateIn(['cls'], (cls) => {
                            return cls.push(action.c)
                        })
                    }
                )
            })
        case SKU_REMOVE_TOY_CLASS:
            return state.updateIn(['skus'], (skus) => {
                return skus.update(
                    skus.findIndex((item) => {
                        return item.get('id') === action.tid
                    }), (item) => {
                        return item.updateIn(['cls'], (cls) => {
                            return cls.delete(cls.findKey((cl) => {
                                return cl === action.c
                            }))
                        })
                    }
                )
            })
        default:
            return state
    }
}
