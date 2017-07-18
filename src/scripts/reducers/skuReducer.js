import Immutable from 'immutable'
import {
	SKL_RECEIVE_SKU, SKL_DELETE_SKU,
    SKL_TOGGLE_BLK,SKL_TOGGLE_REC,
    SKU_REMOVE_TOY_CLASS,SKU_ADD_TOY_CLASS,
    SKU_CLEAR_SUGGESTION,SKU_RECEIVE_SKU_BY_QUERY,
} from '../actions/skuAction'

export default (state = Immutable.fromJS({ skus: [],totalPages:100,filter:'',filterType:'',query:'',orderBy:'created',asc:false,skuResults:[] }),action)=>{
    switch (action.type) {
        case SKL_RECEIVE_SKU:
            return state
                .updateIn(['skus'], (skus) => skus.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPages',action.totalPages)
                .set('page',action.page)
                .set('merchant',action.merchant)
                .set('type',action._type)
                .set('query',action.query)
                .set('orderBy',action.orderBy)
                .set('asc',action.asc)
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
        case SKU_RECEIVE_SKU_BY_QUERY:
            return state.set('skuResults',Immutable.fromJS(action.res))
        case SKU_CLEAR_SUGGESTION:
            return state.updateIn(['skuResults'],(toyResults) => {
                return toyResults.clear()
            })
        default:
            return state
    }
}
