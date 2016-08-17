import Immutable from 'immutable'
import { RECEIVE_USER, RECEIVE_USER_NEW } from '../actions/userAction'

export default (state = Immutable.fromJS({ users: [] }),action)=>{
    switch (action.type) {
        case RECEIVE_USER:
        	return state.updateIn(['users'], (users) => users.concat(Immutable.fromJS(action.res)))
        case RECEIVE_USER_NEW:
        	return state.updateIn(['users'], (users) => users.clear().concat(Immutable.fromJS(action.res)))
        default:
            return state
    }
}