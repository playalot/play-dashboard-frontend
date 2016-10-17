import Immutable from 'immutable'
import { 
    UD_RECEIVE_INFO, 
    UD_RECEIVE_POST,
    UD_RECEIVE_PAGE, 
    UD_CLAER_POST,
    UD_DELETE_POST, 
    
    UD_TOGGLE_RECOMMEND, 
    UD_TOGGLE_BLOCK, 
    UD_TOGGLE_R18,
    UD_ADD_TAG, 
    UD_REMOVE_TAG,
    UD_SET_CLASSIFICATION,
    UD_REMOVE_CLASSIFICATION,
    UD_ADD_SKU,
    UD_REMOVE_TOY,

    //page
    UD_PAGE_TOGGLE_PUB,
    UD_PAGE_TOGGLE_REC,
    UD_PAGE_DELETE_ARTICLE,
    UD_PAGE_SET_COVER_TYPE,
} from '../actions/userDetailAction'

export default ( state = Immutable.fromJS({user:{},posts:[],pages:[],status:{ts:''}}),action ) => {
    switch (action.type) {
        case UD_RECEIVE_INFO:
            return state.updateIn(['user'], (user) => {
                return user.clear().mergeDeep(Immutable.fromJS(action.res))
            })
        case UD_RECEIVE_POST:
            return state.updateIn(['posts'], (posts) => {
                return posts.concat(Immutable.fromJS(action.res))
            }).updateIn(['status'], (status) => {
                return status.set('ts', action.ts)
            })
        case UD_RECEIVE_PAGE:
            return state.updateIn(['pages'],pages => {
                return pages.clear().concat(Immutable.fromJS(action.res))
            })
        case UD_CLAER_POST:
            return state.updateIn(['posts'], (posts) => {
                return posts.clear()
            }).updateIn(['status'], (status) => {
                return status.set('ts', '')
            })
        case UD_ADD_SKU:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('toy', action.toy)
                    }
                )
            })
        case UD_REMOVE_TOY:
            return state.updateIn(['posts'],(posts) => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('toy',null)
                    }
                )
            })
        case UD_TOGGLE_RECOMMEND:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('isRec', !item.get('isRec'));
                    }
                )
            })
        case UD_ADD_TAG:
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
        case UD_REMOVE_TAG:
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
        case UD_TOGGLE_BLOCK:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('isBlk', !item.get('isBlk'))
                    }
                )
            })
        case UD_TOGGLE_R18:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('isR18', !item.get('isR18'))
                    }
                )
            })
        case UD_SET_CLASSIFICATION:
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
        case UD_REMOVE_CLASSIFICATION:
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
        case UD_DELETE_POST:
            return state.updateIn(['posts'], (posts) => {
                return posts.delete(posts.findKey((post) => {
                    return post.get('id') === action.id
                }))
            })
        //page
        case UD_PAGE_TOGGLE_PUB:
            return state.updateIn(['pages'], (pages) => {
                return pages.update(
                    pages.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isPub', !item.get('isPub'));
                    }
                )
            })
        case UD_PAGE_TOGGLE_REC:
            return state.updateIn(['pages'], (pages) => {
                return pages.update(
                    pages.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isRec', !item.get('isRec'));
                    }
                )
            })
        case UD_PAGE_DELETE_ARTICLE:
            return state.updateIn(['pages'],(pages) => {
                return pages.delete(pages.findKey((article) => {
                    return article.get('id') === action.id
                }))
            })
        case UD_PAGE_SET_COVER_TYPE:
            return state.updateIn(['pages'],(pages) => {
                let flag = action.val ? 'l' : 's'
                return pages.update(
                    pages.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('coverType',flag)
                    }
                )
            })
        default:
            return state
    }
}