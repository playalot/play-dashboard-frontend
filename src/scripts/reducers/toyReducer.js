import Immutable from 'immutable'
import {
	TOL_RECEIVE_TOY, TOL_TOGGLE_R18, TOL_TOGGLE_RECOMMEND, TOL_DELETE_TOY, TOL_ADD_TOY
} from '../actions/toyAction'

export default (state = Immutable.fromJS({ toys: [],totalPages:100,filter:'',query:'',sort:'created',month:'',year:'' }),action)=>{
    switch (action.type) {
        case TOL_RECEIVE_TOY:
            return state
                .updateIn(['toys'], (toys) => toys.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPages',action.totalPages)
                .set('page',action.page)
                .set('filter',action.filter)
                .set('query',action.query)
                .set('sort',action.sort)
                .set('year',action.year)
                .set('month',action.month)
        case TOL_TOGGLE_R18:
        	return state.updateIn(['toys'], (toys) => {
        		return toys.update(
        			toys.findIndex((item) => {
        				return item.get('id') === action.id
        			}),(item) => {
        				return item.set('isR18', !item.get('isR18'))
        			}
        		)
        	})
        case TOL_TOGGLE_RECOMMEND:
        	return state.updateIn(['toys'], (toys) => {
                return toys.update(
                    toys.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('isRec', !item.get('isRec'));
                    }
                )
            })
        case TOL_DELETE_TOY:
        	return state.updateIn(['toys'], (toys) => {
                return toys.delete(toys.findKey((toys) => {
                    return toys.get('id') === action.id
                }))
            })
        case TOL_ADD_TOY:
        	return state.updateIn(['toys'], (toys) => {
        		return toys.unshift(Immutable.fromJS(action.res))
        	})
        default:
            return state
    }
}
