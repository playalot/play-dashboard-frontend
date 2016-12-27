import Immutable from 'immutable'
import { 
    EXPLORE_RECEIVE_DATA,
	EXPLORE_ADD_BANNER,
	EXPLORE_DELETE_BANNER, 
	EXPLORE_ADD_TOPIC,
} from '../actions/exploreAction'

export default (state = Immutable.fromJS({ 
    banners:[],topics:[],toys:[],loaded:false,
}),action) => {
    switch (action.type) {
        case EXPLORE_RECEIVE_DATA:
            return state.set('topics',Immutable.fromJS(action.topics))
                        .set('banners',Immutable.fromJS(action.banners))
                        .set('toys',Immutable.fromJS(action.toys))
                        .set('loaded',true)
        case EXPLORE_ADD_BANNER:
        	return state.updateIn(['banners'],(banners) => {
        		return banners.unshift(Immutable.fromJS(action.res))
        	})
        case EXPLORE_ADD_TOPIC:
        	return state.updateIn(['topics'],(topics) => {
        		return topics.unshift(Immutable.fromJS(action.res))
        	})
        case EXPLORE_DELETE_BANNER:
            let target = `${action.target}s`
            return state.updateIn([target],(target) => {
                return target.delete(target.findKey((banner) => {
                    return banner.get('id') === action.id
                }))
            })
        default:
            return state
    }
}