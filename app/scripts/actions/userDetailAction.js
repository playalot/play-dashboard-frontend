import Request from 'superagent'

export const RECEIVE_USER_DETAIL_INFO = 'RECEIVE_USER_DETAIL_INFO'
export const RECEIVE_USER_DETAIL_POST = 'RECEIVE_USER_DETAIL_POST'

function receiveUserDetailInfo(res) {
    return {
        type: RECEIVE_USER_DETAIL_INFO,
        res
    }
}
function receiveUserDetailPost(res) {
    return {
        type: RECEIVE_USER_DETAIL_POST,
        res
    }
}
export function fetchUserInfo(id) {
    return (dispatch) => {
        return Request
            .get(`/api/user/${id}`)
            .end(function(err,res){
                dispatch(receiveUserDetailInfo(res.body))
            })
    }
}

export  function fetchUserPost(id) {
    return (dispatch) => {
        return Request
            .get(`/api/user/${id}/posts`)
            .end(function(err,res){
                dispatch(receiveUserDetailPost(res.body.posts))
            })
    }
}