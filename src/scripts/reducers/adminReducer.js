import Immutable from 'immutable'
import { ADMIN_RECEIVE_INFO,ADMIN_SET_TOUID_NULL,ADMIN_SET_TOUID } from '../actions/adminAction'

export default (state = Immutable.fromJS({ 
    user: {id:'',nickName:'nickName',avatar:''}, loaded:false,
    baichuan:{
        touid:'none',
        toAvatar:'',
    } 
}),action)=>{
    switch (action.type) {
        case ADMIN_RECEIVE_INFO:
            return state.updateIn(['user'],user => {
            	return user.set('id',action.res.id)
            		.set('nickName',action.res.nickname)
                    .set('avatar',action.res.avatar)
            		.set('email',action.email)
            })
        case ADMIN_SET_TOUID:
            return state.updateIn(['baichuan'], baichuan => {
                return baichuan.set('touid',action.touid).set('toAvatar',action.toAvatar)
            })
        case ADMIN_SET_TOUID_NULL:
            return state.updateIn(['baichuan'], baichuan => {
                return baichuan.set('touid','none')
            })
        default:
            return state
    }
}