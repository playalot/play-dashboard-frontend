import Immutable from 'immutable'
import { 
    RECEIVE_POST, 
    RECEIVE_POST_NEW, 
    TOGGLE_RECOMMEND_POST, 
    TOGGLE_BLOCK_POST, 
    TOGGLE_R18_POST,
    ADD_TAG_POST, 
    REMOVE_TAG_POST,
    SET_POST_CLASSIFICATION,
    REMOVE_POST_CLASSIFICATION,
    ADD_SKU_POST,
    DELETE_POST,
} from '../actions/postAction'

export default (state = Immutable.fromJS({ posts:[] }),action)=>{
    switch (action.type) {
        case RECEIVE_POST:
            return state.updateIn(['posts'], (posts) => posts.concat(Immutable.fromJS(action.res.posts)))
        case RECEIVE_POST_NEW:
            return state.updateIn(['posts'], (posts) => posts.clear().concat(Immutable.fromJS(action.res.posts)))
        case ADD_SKU_POST:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('sku',action.sku)
                    }
                )
            })
        case TOGGLE_RECOMMEND_POST:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isRec', !item.get('isRec'));
                    }
                )
            })
        case ADD_TAG_POST: 
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
        case REMOVE_TAG_POST:
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
        case TOGGLE_BLOCK_POST:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isBlk', !item.get('isBlk'))
                    }
                )
            })
        case TOGGLE_R18_POST:
            return state.updateIn(['posts'], (posts) => {
                return posts.update(
                    posts.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isR18', !item.get('isR18'))
                    }
                )
            })
        case SET_POST_CLASSIFICATION:
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
        case REMOVE_POST_CLASSIFICATION:
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
        case DELETE_POST: 
            return state.updateIn(['posts'], (posts) => {
                return posts.delete(posts.findKey((post) => {
                    return post.get('id') === action.id
                }))
            })
        default:
            return state
    }
}

