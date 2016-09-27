import Immutable from 'immutable'
import {
    PAGE_L_RECEIVE_ARTICLE,
    PAGE_L_RECEIVE_ARTICLE_MORE,
    PAGE_L_TOGGLE_PUB,
    PAGE_L_TOGGLE_REC,
    PAGE_L_DELETE_ARTICLE,
} from '../actions/pageAction'
export default (state = Immutable.fromJS({ articles: [], loaded:false,ts:null }),action)=>{
    switch (action.type) {
        case PAGE_L_RECEIVE_ARTICLE:
        	return state.updateIn(['articles'],(articles) => {
        		return articles.clear().concat(Immutable.fromJS(action.res))
        	}).set('loaded',true).set('ts',action.ts)
        case PAGE_L_RECEIVE_ARTICLE_MORE:
        	return state.updateIn(['articles'],(articles) => {
        		return articles.concat(Immutable.fromJS(action.res))
        	}).set('ts',action.ts)
        case PAGE_L_TOGGLE_PUB:
            return state.updateIn(['articles'], (articles) => {
                return articles.update(
                    articles.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isPub', !item.get('isPub'));
                    }
                )
            })
        case PAGE_L_TOGGLE_REC:
            return state.updateIn(['articles'], (articles) => {
                return articles.update(
                    articles.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isRec', !item.get('isRec'));
                    }
                )
            })
        case PAGE_L_DELETE_ARTICLE:
            return state.updateIn(['articles'],(articles) => {
                return articles.delete(articles.findKey((article) => {
                    return article.get('id') === action.id
                }))
            })
        default:
            return state
    }
}