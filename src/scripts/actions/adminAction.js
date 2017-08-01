import Request from 'superagent'

export const ADMIN_RECEIVE_INFO = 'ADMIN_RECEIVE_INFO'
export const ADMIN_SET_TOUID_NULL = 'ADMIN_SET_TOUID_NULL'
export const ADMIN_SET_TOUID = 'ADMIN_SET_TOUID'

export function fetchInfo() {
    return (dispatch) => {
        return Request
            .get(`/api/my/info`)
            .end((err,res) => {
                if(!err) {
                    dispatch({type:ADMIN_RECEIVE_INFO,res:res.body.user,email:res.body.email})
                }
            })
    }
}
export function setTouid(touid,toAvatar) {
    return {
        type: ADMIN_SET_TOUID,
        touid,
        toAvatar,
    }
}
export function setTouidNull() {
    return {
        type: ADMIN_SET_TOUID_NULL
    }
}
