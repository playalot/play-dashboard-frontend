import Immutable from 'immutable'
import { 
	SKL_RECEIVE_SKU, SKL_RECEIVE_SKU_NEW, 
	SKL_TOGGLE_R18, SKL_TOGGLE_RECOMMEND, SKL_DELETE_SKU, SKL_ADD_SKU
} from '../actions/skuAction'

export default (state = Immutable.fromJS({ skus: [], loaded:false }),action)=>{
    switch (action.type) {
        case SKL_RECEIVE_SKU:
            return state.updateIn(['skus'], (skus) => skus.concat(Immutable.fromJS(action.res))).set('loaded',true)
        case SKL_RECEIVE_SKU_NEW:
            return state.updateIn(['skus'], (skus) => skus.clear().concat(Immutable.fromJS(action.res)))
        case SKL_TOGGLE_R18:
        	return state.updateIn(['skus'], (skus) => {
        		return skus.update(
        			skus.findIndex((item) => {
        				return item.get('id') === action.id
        			}),(item) => {
        				return item.set('isR18', !item.get('isR18'))
        			}
        		)
        	})
        case SKL_TOGGLE_RECOMMEND:
        	return state.updateIn(['skus'], (skus) => {
                return skus.update(
                    skus.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isRec', !item.get('isRec'));
                    }
                )
            })
        case SKL_DELETE_SKU:
        	return state.updateIn(['skus'], (skus) => {
                return skus.delete(skus.findKey((skus) => {
                    return skus.get('id') === action.id
                }))
            })
        case SKL_ADD_SKU:
        	return state.updateIn(['skus'], (skus) => {
        		return skus.unshift(Immutable.fromJS(action.res))
        	})
        default:
            return state
    }
}