import Immutable from 'immutable'
import { 
    EXPLORE_RECEIVE_DATA,
	EXPLORE_DELETE_BANNER, 
} from '../actions/exploreAction'

export default (state = Immutable.fromJS({ 
    banners:[],themes:[],toys:[],loaded:false,
}),action) => {
    switch (action.type) {
        case EXPLORE_RECEIVE_DATA:
            return state.set('themes',Immutable.fromJS(action.themes))
                        .set('banners',Immutable.fromJS(action.banners))
                        .set('toys',Immutable.fromJS(action.toys))
                        .set('drafts',Immutable.fromJS(action.drafts))
                        .set('loaded',true)
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