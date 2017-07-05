import Immutable from 'immutable'
import { 
    POST_RECEIVE_POST, 
    POST_TOGGLE_RECOMMEND, 
    POST_TOGGLE_BLOCK, 
    POST_TOGGLE_R18,
    POST_ADD_TAG, 
    POST_REMOVE_TAG,
    POST_SET_CLASSIFICATION,
    POST_REMOVE_CLASSIFICATION,
    POST_REMOVE_ALL_CLASSIFICATION,
    POST_ADD_TOY,
    POST_REMOVE_TOY,
    POST_DELETE_POST,
    POST_GET_UN_CLS,
} from '../actions/postAction'

export default (state = Immutable.fromJS({ posts:[],totalPages:100,filter:'',query:''}),action)=>{
    switch (action.type) {
        case POST_RECEIVE_POST:
            return state
                .updateIn(['posts'], (posts) => posts.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPages',action.totalPages)
                .set('page',action.page)
                .set('filter',action.filter)
                .set('query',action.query)
        case POST_ADD_TOY:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('toy',action.toy)
                    }
                )
            })
        case POST_REMOVE_TOY:
            return state.updateIn(['posts'],(posts) => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('toys',[])
                    }
                )
            })
        case POST_TOGGLE_RECOMMEND:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isRec', !item.get('isRec'));
                    }
                )
            })
        case POST_ADD_TAG: 
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
        case POST_REMOVE_TAG:
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
        case POST_TOGGLE_BLOCK:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isBlk', !item.get('isBlk'))
                    }
                )
            })
        case POST_TOGGLE_R18:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isR18', !item.get('isR18'))
                    }
                )
            })
        case POST_SET_CLASSIFICATION:
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
        case POST_REMOVE_CLASSIFICATION:
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
        case POST_REMOVE_ALL_CLASSIFICATION:
            return state.updateIn(['posts'], posts => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.pid
                    }), (item) => {
                        return item.updateIn(['cls'], (cls) => {
                            return cls.clear()
                        })
                    }
                )
            })
        case POST_DELETE_POST: 
            return state.updateIn(['posts'], (posts) => {
                return posts.delete(posts.findKey((post) => {
                    return post.get('id') === action.id
                }))
            })
        case POST_GET_UN_CLS:
            return state.updateIn(['posts'], (posts) => {
                return posts.filter((item) => {
                    return item.get('cls').size === 0
                })
            })
        default:
            return state
    }
}

