import Immutable from 'immutable'
import { 
    //info
    UD_RECEIVE_INFO, 
    //page
    UD_RECEIVE_PAGE, 
    UD_PAGE_TOGGLE_PUB,
    UD_PAGE_TOGGLE_REC,
    UD_PAGE_DELETE_PAGE,
    UD_PAGE_SET_COVER_TYPE,
    //user
    UD_USER_SET_ACTIVE,
    //post
    UD_RECEIVE_POST,
    UD_SET_CLASSIFICATION,
    UD_REMOVE_CLASSIFICATION,
    UD_POST_TOGGLE_RECOMMEND,
    UD_POST_TOGGLE_BLOCK,
    UD_POST_TOGGLE_R18,
    UD_POST_ADD_TAG,
    UD_POST_REMOVE_TAG,
    UD_POST_ADD_TOY,
    UD_POST_REMOVE_TOY,
    UD_POST_DELETE_POST
} from '../actions/userDetailAction'

export default ( state = Immutable.fromJS({user:{},posts:[],pages:[],totalPages:10}),action ) => {
    switch (action.type) {
        //post
        case UD_RECEIVE_POST:
            return state
                .updateIn(['posts'], (posts) => posts.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPages',action.totalPages)
                .set('page',action.page)
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
        case UD_POST_ADD_TOY:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('toy',action.toy)
                    }
                )
            })
        case UD_POST_REMOVE_TOY:
            return state.updateIn(['posts'],(posts) => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('toy',null)
                    }
                )
            })
        case UD_POST_TOGGLE_RECOMMEND:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isRec', !item.get('isRec'));
                    }
                )
            })
        case UD_POST_ADD_TAG: 
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
        case UD_POST_REMOVE_TAG:
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
        case UD_POST_TOGGLE_BLOCK:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isBlk', !item.get('isBlk'))
                    }
                )
            })
        case UD_POST_TOGGLE_R18:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isR18', !item.get('isR18'))
                    }
                )
            })
        case UD_POST_DELETE_POST: 
            return state.updateIn(['posts'], (posts) => {
                return posts.delete(posts.findKey((post) => {
                    return post.get('id') === action.id
                }))
            })
        //info
        case UD_RECEIVE_INFO:
            return state.updateIn(['user'], (user) => {
                return user.clear().mergeDeep(Immutable.fromJS(action.res))
            })
        //page
        case UD_RECEIVE_PAGE:
            return state.updateIn(['pages'],pages => {
                return pages.clear().concat(Immutable.fromJS(action.res))
            })
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
        case UD_PAGE_DELETE_PAGE:
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
        //user
        case UD_USER_SET_ACTIVE:
            return state.updateIn(['user'],user => {
                return user.set('isActive',!user.get('isActive'))
            })
        default:
            return state
    }
}