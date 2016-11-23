import Request from 'superagent'

export const ADMIN_RECEIVE_INFO = 'ADMIN_RECEIVE_INFO'

function receiveInfo(res) {
    return {
        type: ADMIN_RECEIVE_INFO,
        res
    }
}

export function fetchInfo() {
    return (dispatch) => {
        return Request
            .get(`/api/admin/current`)
            .end((err,res) => {
                if(!err) {
                    dispatch(receiveInfo(res.body.user))
                } 
            })
    }
}