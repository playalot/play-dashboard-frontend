import Immutable from 'immutable'
import { USER_L_RECEIVE_USER, USER_L_RECEIVE_USER_NEW } from '../actions/userAction'

export default (state = Immutable.fromJS({ users: [],filter:'',totalPages:100 }),action)=>{
    switch (action.type) {
        case USER_L_RECEIVE_USER:
            return state
                .updateIn(['users'], (users) => users.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPages',action.totalPages)
                .set('page',action.page)
                .set('filter',action.query)
        case USER_L_RECEIVE_USER_NEW:
        	return state.updateIn(['users'], (users) => users.clear().concat(Immutable.fromJS(action.res)))
        default:
            return state
    }
}