import Immutable from 'immutable'
import { AL_RECEIVE_ARTICLE, AL_RECEIVE_ARTICLE_MORE, AL_TOGGLE_PUB, AL_TOGGLE_REC, AL_DELETE_ARTICLE } from '../actions/articleAction'

export default (state = Immutable.fromJS({ articles: [], loaded:false,ts:null }),action)=>{
    switch (action.type) {
        case AL_RECEIVE_ARTICLE:
        	return state.updateIn(['articles'],(articles) => {
        		return articles.clear().concat(Immutable.fromJS(action.res))
        	}).set('loaded',true).set('ts',action.ts)
        case AL_RECEIVE_ARTICLE_MORE:
        	return state.updateIn(['articles'],(articles) => {
        		return articles.concat(Immutable.fromJS(action.res))
        	}).set('ts',action.ts)
        case AL_TOGGLE_PUB:
            return state.updateIn(['articles'], (articles) => {
                return articles.update(
                    articles.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isPub', !item.get('isPub'));
                    }
                )
            })
        case AL_TOGGLE_REC:
            return state.updateIn(['articles'], (articles) => {
                return articles.update(
                    articles.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('isRec', !item.get('isRec'));
                    }
                )
            })
        case AL_DELETE_ARTICLE:
            return state.updateIn(['articles'],(articles) => {
                return articles.delete(articles.findKey((article) => {
                    return article.get('id') === action.id
                }))
            })
        default:
            return state
    }
}