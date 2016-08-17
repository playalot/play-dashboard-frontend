import Immutable from 'immutable'
import { 
    PL_RECEIVE_POST, 
    PL_RECEIVE_POST_NEW, 
    PL_TOGGLE_RECOMMEND, 
    PL_TOGGLE_BLOCK, 
    PL_TOGGLE_R18,
    PL_ADD_TAG, 
    PL_REMOVE_TAG,
    PL_SET_CLASSIFICATION,
    PL_REMOVE_CLASSIFICATION,
    PL_ADD_SKU,
    PL_DELETE_POST,
    PL_GET_UN_CLS,
} from '../actions/postAction'

export default (state = Immutable.fromJS({ posts:[] }),action)=>{
    switch (action.type) {
        case PL_RECEIVE_POST:
            return state.updateIn(['posts'], (posts) => posts.concat(Immutable.fromJS(action.res.posts)))
        case PL_RECEIVE_POST_NEW:
            return state.updateIn(['posts'], (posts) => posts.clear().concat(Immutable.fromJS(action.res.posts)))
        case PL_ADD_SKU:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('sku',action.sku)
                    }
                )
            })
        case PL_TOGGLE_RECOMMEND:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isRec', !item.get('isRec'));
                    }
                )
            })
        case PL_ADD_TAG: 
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.updateIn(['tags'], (tags) => {
                            return tags.push(Immutable.fromJS(action.text))
                        })
                    }
                )
            })
        case PL_REMOVE_TAG:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.updateIn(['tags'], (tags) => {
                            return tags.delete(tags.findKey((tag) => {
                                return tag.get('id') === action.tid
                            }))
                        })
                    }
                )
            })
        case PL_TOGGLE_BLOCK:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isBlk', !item.get('isBlk'))
                    }
                )
            })
        case PL_TOGGLE_R18:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isR18', !item.get('isR18'))
                    }
                )
            })
        case PL_SET_CLASSIFICATION:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.pid
                    }), (item) => {
                        return item.updateIn(['cls'], (cls) => {
                            return cls.push(action.cid)
                        })
                    }
                )
            })
        case PL_REMOVE_CLASSIFICATION:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.pid
                    }), (item) => {
                        return item.updateIn(['cls'], (cls) => {
                            return cls.delete(cls.findKey((cl) => {
                                return cl === action.c
                            }))
                        })
                    }
                )
            })
        case PL_DELETE_POST: 
            return state.updateIn(['posts'], (posts) => {
                return posts.delete(posts.findKey((post) => {
                    return post.get('id') === action.id
                }))
            })
        case PL_GET_UN_CLS:
            return state.updateIn(['posts'], (posts) => {
                return posts.filter((item) => {
                    return item.get('cls').size === 0
                })
            })
        default:
            return state
    }
}

