import Immutable from 'immutable'
import {
	TOL_RECEIVE_TOY, TOL_TOGGLE_R18, TOL_TOGGLE_RECOMMEND, TOL_DELETE_TOY, TOL_ADD_TOY,
    TOY_RECEIVE_TOY_BY_QUERY,TOY_CLEAR_SUGGESTION,TOY_ADD_TOY_CLASS,TOY_REMOVE_TOY_CLASS
} from '../actions/toyAction'

export default (state = Immutable.fromJS({ toys: [],totalPages:100,filter:'',query:'',sort:'created',month:'',year:'',toyResults:[] }),action)=>{
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
        case TOY_RECEIVE_TOY_BY_QUERY:
            return state.set('toyResults',Immutable.fromJS(action.res))
        case TOY_CLEAR_SUGGESTION:
            return state.updateIn(['toyResults'],(toyResults) => {
                return toyResults.clear()
            })
        case TOY_ADD_TOY_CLASS:
            return state.updateIn(['toys'], (toys) => {
                return toys.update(
                    toys.findIndex((item) => {
                        return item.get('id') === action.tid
                    }), (item) => {
                        return item.updateIn(['cls'], (cls) => {
                            return cls.push(action.c)
                        })
                    }
                )
            })
        case TOY_REMOVE_TOY_CLASS:
            return state.updateIn(['toys'], (toys) => {
                return toys.update(
                    toys.findIndex((item) => {
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
