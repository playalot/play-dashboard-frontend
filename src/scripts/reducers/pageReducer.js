import Immutable from 'immutable'
import {
    PAGE_RECEIVE_PAGE,
    PAGE_CLEAR_PAGE,
    PAGE_TOGGLE_PUB,
    PAGE_TOGGLE_REC,
    PAGE_TOGGLE_SHARE,
    PAGE_DELETE_ARTICLE,
    PAGE_SET_COVER_TYPE,
    PAGE_ADD_TOY,
    PAGE_REMOVE_TOY,
} from '../actions/pageAction'

export default (state = Immutable.fromJS({ pages: [],totalPages:100,query:'',filter:'',nextRaw:{} }),action)=>{
    switch (action.type) {
        case PAGE_RECEIVE_PAGE:
            return state
                .updateIn(['pages'], (pages) => pages.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPages',action.totalPages)
                .set('page',action.page)
                .set('query',action.query)
                .set('filter',action.filter)
        case PAGE_CLEAR_PAGE:
            return state
                .updateIn(['pages'], (pages) => pages.clear())
                .set('totalPages',100)
                .set('page',null)
                .set('query','')
                .set('filter','')
        case PAGE_TOGGLE_PUB:
            return state.updateIn(['pages'], (pages) => {
                return pages.update(
                    pages.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isPub', !item.get('isPub'));
                    }
                )
            })
        case PAGE_TOGGLE_REC:
            return state.updateIn(['pages'], (pages) => {
                return pages.update(
                    pages.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isRec', !item.get('isRec'));
                    }
                )
            })
        case PAGE_DELETE_ARTICLE:
            return state.updateIn(['pages'],(pages) => {
                return pages.delete(pages.findKey((article) => {
                    return article.get('id') === action.id
                }))
            })
        case PAGE_SET_COVER_TYPE:
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
        case PAGE_ADD_TOY:
            return state.updateIn(['pages'], (pages) => {
                return pages.update(
                    pages.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.updateIn(['toys'],toys => {
                            return toys.push(action.toy)
                        })
                    }
                )
            })
        case PAGE_REMOVE_TOY:
            return state.updateIn(['pages'],(pages) => {
                return pages.update(
                    pages.findIndex((item) => {
                        return item.get('id') === action.id
                    }), (item) => {
                        return item.set('toys',[])
                    }
                )
            })
        case PAGE_TOGGLE_SHARE:
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