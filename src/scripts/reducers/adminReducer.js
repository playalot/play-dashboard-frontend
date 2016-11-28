import Immutable from 'immutable'
import { ADMIN_RECEIVE_INFO } from '../actions/adminAction'

export default (state = Immutable.fromJS({ user: {id:'',nickName:'nickName',avatar:''}, loaded:false }),action)=>{
    switch (action.type) {
        case ADMIN_RECEIVE_INFO:
            return state.updateIn(['user'],user => {
            	return user.set('id',action.res.id)
            		.set('nickName',action.res.nickname)
                    .set('avatar',action.res.avatar)
            		.set('email',action.email)
            })
        default:
            return state
    }
}