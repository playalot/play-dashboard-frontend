import Immutable from 'immutable'
import { ADMIN_RECEIVE_INFO } from '../actions/adminAction'

    switch (action.type) {
        case ADMIN_RECEIVE_INFO:
            return state.updateIn(['user'],user => {
            	return user.set('id',action.res.id)
            		.set('nickName',action.res.nickname)
            		.set('avatar',action.res.avatar)
            })
        default:
            return state
    }
}
