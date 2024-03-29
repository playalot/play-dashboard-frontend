import Immutable from 'immutable'
import { 
    TL_RECEIVE_TAG, 
    TL_SET_CLASSIFICATION,
    TL_REMOVE_CLASSIFICATION,
    TL_RECOMMEND_TAG,
    TL_DELETE_TAG,
    TL_RECEIVE_SUGGESTION,
    TL_CLEAR_SUGGESTION,
} from '../actions/tagAction'

export default (state = Immutable.fromJS({ tags:[],totalPages:100,type:'',query:'',suggestions:[],tagLoaded:false,children:[] }),action)=>{
    switch (action.type) {
        case TL_RECEIVE_TAG:
            return state
                .updateIn(['tags'], (tags) => tags.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPages',action.totalPages)
                .set('page',action.page)
                .set('type',action.filter)
                .set('query',action.query)
                .set('children',action.children)
        case TL_SET_CLASSIFICATION:
            return state.updateIn(['tags'], (tags) => {
                return tags.update(
                    tags.findIndex((item) => {
                        return item.get('id') === action.tid
                    }), (item) => {
                        return item.updateIn(['cls'], (cls) => {
                            return cls.push(action.cid)
                        })
                    }
                )
            })
        case TL_REMOVE_CLASSIFICATION:
            return state.updateIn(['tags'], (tags) => {
                return tags.update(
                    tags.findIndex((item) => {
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
        case TL_RECOMMEND_TAG:
            return state.updateIn(['tags'], (tags) => {
                return tags.update(
                    tags.findIndex((item) => { 
                        return item.get('id') === action.tid 
                    }), (item) => {
                        return item
                    }
                )
            })
        case TL_DELETE_TAG:
            return state.updateIn(['tags'], (tags) => {
                return tags.delete(tags.findKey((tag) => {
                    return tag.get('id') === action.tid
                }))
            })
        case TL_RECEIVE_SUGGESTION:
            return state.updateIn(['suggestions'],(suggestions) => {
                return suggestions.clear().concat(Immutable.fromJS(action.res))
            })
        case TL_CLEAR_SUGGESTION:
            return state.updateIn(['suggestions'],(suggestions) => {
                return suggestions.clear()
            })
        default:
            return state
    }
}

