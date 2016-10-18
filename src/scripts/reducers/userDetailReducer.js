import Immutable from 'immutable'
import { 
    UD_RECEIVE_INFO, 
    //page
    UD_RECEIVE_PAGE, 
    UD_PAGE_TOGGLE_PUB,
    UD_PAGE_TOGGLE_REC,
    UD_PAGE_DELETE_PAGE,
    UD_PAGE_SET_COVER_TYPE,
} from '../actions/userDetailAction'

export default ( state = Immutable.fromJS({user:{},posts:[],pages:[],status:{ts:''}}),action ) => {
    switch (action.type) {
        case UD_RECEIVE_INFO:
            return state.updateIn(['user'], (user) => {
                return user.clear().mergeDeep(Immutable.fromJS(action.res))
            })
        //pages
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
        default:
            return state
    }
}