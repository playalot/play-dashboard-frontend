import Immutable from 'immutable'
import { RECEIVE_USER_DETAIL_INFO, RECEIVE_USER_DETAIL_POST } from '../actions/userDetailAction'

export default (state = Immutable.fromJS({user:{},posts:[]}),action)=>{
    switch (action.type) {
        case RECEIVE_USER_DETAIL_INFO:
        	return state.updateIn(['user'],(user) => {
        		return user.clear().mergeDeep(Immutable.fromJS(action.res))
        	})
        case RECEIVE_USER_DETAIL_POST:
        	return state.updateIn(['posts'],(posts) => {
        		return posts.clear().concat(Immutable.fromJS(action.res))
        	})
        default:
            return state
    }
}