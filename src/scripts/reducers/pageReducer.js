import Immutable from 'immutable'
import {
    PAGE_L_RECEIVE_ARTICLE,
    PAGE_L_RECEIVE_ARTICLE_MORE,
    PAGE_L_TOGGLE_PUB,
    PAGE_L_TOGGLE_REC,
    PAGE_L_DELETE_ARTICLE,
    PAGE_L_SET_COVER_TYPE,
} from '../actions/pageAction'
export default (state = Immutable.fromJS({ pages: [], loaded:false,ts:null }),action)=>{
    switch (action.type) {
        case PAGE_L_RECEIVE_ARTICLE:
        	return state.updateIn(['pages'],(pages) => {
        		return pages.clear().concat(Immutable.fromJS(action.res))
        	}).set('loaded',true).set('ts',action.ts)
        case PAGE_L_RECEIVE_ARTICLE_MORE:
        	return state.updateIn(['pages'],(pages) => {
        		return pages.concat(Immutable.fromJS(action.res))
        	}).set('ts',action.ts)
        case PAGE_L_TOGGLE_PUB:
            return state.updateIn(['pages'], (pages) => {
                console.info('here')
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
        default:
            return state
    }
}