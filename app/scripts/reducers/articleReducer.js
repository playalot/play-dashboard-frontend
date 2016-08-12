import Immutable from 'immutable'
import { AL_RECEIVE_ARTICLE, AL_RECEIVE_ARTICLE_MORE } from '../actions/articleAction'

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
        default:
            return state
    }
}