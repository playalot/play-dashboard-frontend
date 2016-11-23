import Immutable from 'immutable'
import { ADMIN_RECEIVE_INFO } from '../actions/adminAction'

export default (state = Immutable.fromJS({ user: {id:'',nickName:'nickName',avatar:'https://almsaeedstudio.com/themes/AdminLTE/dist/img/user2-160x160.jpg'}, loaded:false }),action)=>{
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