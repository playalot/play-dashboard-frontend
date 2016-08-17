import Immutable from 'immutable'
import {
	SKL_RECEIVE_TOY, SKL_RECEIVE_TOY_NEW,
	SKL_TOGGLE_R18, SKL_TOGGLE_RECOMMEND, SKL_DELETE_TOY, SKL_ADD_TOY
} from '../actions/toyAction'

export default (state = Immutable.fromJS({ toys: [], loaded:false }),action)=>{
    switch (action.type) {
        case SKL_RECEIVE_TOY:
            return state.updateIn(['toys'], (toys) => toys.concat(Immutable.fromJS(action.res))).set('loaded',true)
        case SKL_RECEIVE_TOY_NEW:
            return state.updateIn(['toys'], (toys) => toys.clear().concat(Immutable.fromJS(action.res)))
        case SKL_TOGGLE_R18:
        	return state.updateIn(['toys'], (toys) => {
        		return toys.update(
        			toys.findIndex((item) => {
        				return item.get('id') === action.id
        			}),(item) => {
        				return item.set('isR18', !item.get('isR18'))
        			}
        		)
        	})
        case SKL_TOGGLE_RECOMMEND:
        	return state.updateIn(['toys'], (toys) => {
                return toys.update(
                    toys.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('isRec', !item.get('isRec'));
                    }
                )
            })
        case SKL_DELETE_TOY:
        	return state.updateIn(['toys'], (toys) => {
                return toys.delete(toys.findKey((toys) => {
                    return toys.get('id') === action.id
                }))
            })
        case SKL_ADD_TOY:
        	return state.updateIn(['toys'], (toys) => {
        		return toys.unshift(Immutable.fromJS(action.res))
        	})
        default:
            return state
    }
}
