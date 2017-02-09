import Request from 'superagent'

export const ADMIN_RECEIVE_INFO = 'ADMIN_RECEIVE_INFO'
export const ADMIN_SET_TOUID_NULL = 'ADMIN_SET_TOUID_NULL'
export const ADMIN_SET_TOUID = 'ADMIN_SET_TOUID'

function receiveInfo(res,email) {
    return {
        type: ADMIN_RECEIVE_INFO,
        res,
        email
    }
}

function _setTouidNull() {
    return {
        type: ADMIN_SET_TOUID_NULL
    }
}
function _setTouid(touid,toAvatar) {
    return {
        type: ADMIN_SET_TOUID,
        touid,
        toAvatar,
    }
}
export function fetchInfo() {
    return (dispatch) => {
        return Request
            .get(`/api/my/info`)
            .end((err,res) => {
                if(!err) {
                    dispatch(receiveInfo(res.body.user,res.body.email))
                }
            })
    }
}

export function setTouidNull() {
    return (dispatch) => {
        dispatch(_setTouidNull())
    }
}
export function setTouid(touid,toAvatar) {
    return (dispatch) => {
        dispatch(_setTouid(touid,toAvatar))
    }
}