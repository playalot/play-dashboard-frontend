import Immutable from 'immutable'
import {
    PAGE_L_RECEIVE_PAGE,
    PAGE_L_TOGGLE_PUB,
    PAGE_L_TOGGLE_REC,
    PAGE_L_DELETE_ARTICLE,
    PAGE_L_SET_COVER_TYPE,
    PAGE_L_ADD_TOY,
    PAGE_L_TOGGLE_SHARE,
} from '../actions/pageAction'
export default (state = Immutable.fromJS({ pages: [],totalPages:100,query:'',filter:'' }),action)=>{
    switch (action.type) {
        case PAGE_L_RECEIVE_PAGE:
            return state
                .updateIn(['pages'], (pages) => pages.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPages',action.totalPages)
                .set('page',action.page)
                .set('query',action.query)
                .set('filter',action.filter)
        case PAGE_L_TOGGLE_PUB:
            return state.updateIn(['pages'], (pages) => {
                return pages.update(
                    pages.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isPub', !item.get('isPub'));
                    }
                )
            })
        case PAGE_L_TOGGLE_REC:
            return state.updateIn(['pages'], (pages) => {
                return pages.update(
                    pages.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isRec', !item.get('isRec'));
                    }
                )
            })
        case PAGE_L_DELETE_ARTICLE:
            return state.updateIn(['pages'],(pages) => {
                return pages.delete(pages.findKey((article) => {
                    return article.get('id') === action.id
                }))
            })
        case PAGE_L_SET_COVER_TYPE:
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
        case PAGE_L_ADD_TOY:
            return state.updateIn(['pages'], (pages) => {
                return pages.update(
                    pages.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.updateIn(['toys'],toys => {
                            return toys.push(Immutable.fromJS(action.toy))
                        })
                    }
                )
            })
        case PAGE_L_TOGGLE_SHARE:
            return state.updateIn(['pages'], pages => {
                return pages.update(
                    pages.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('forShare',!item.get('forShare'))
                    }
                )
            })
        default:
            return state
    }
}