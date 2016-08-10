import Request from 'superagent'

export const RECEIVE_USER = 'RECEIVE_USER'
export const RECEIVE_USER_NEW = 'RECEIVE_USER_NEW'

function receiveUser(res) {
    return {
        type: RECEIVE_USER,
        res
    }
}
function receiveUserNew(res) {
    return {
        type: RECEIVE_USER_NEW,
        res
    }
}
const status = {
    filter: '',
    page:0,
    overload: false,
}
export function fetchUser(filter) {
    if (filter !== status.filter) {
        status.filter = filter
        status.page = 0
        status.overload = true
    } else {
        status.overload = false
    }
    let params = {}
    params.page = status.page
    if (status.filter !== '') {
        params.filter = status.filter
    }
    return (dispatch) => {
        return Request
            .get(`/api/users`)
            .query(params)
            .end(function(err,res){
                status.page++
                status.overload ? dispatch(receiveUserNew(res.body.users)) : dispatch(receiveUser(res.body.users))
            })
    }
}

export function recommendUser(id) {
    return (dispatch) => {
        return Request
            .post(`/api/recommend/home/${id}?type=user`)
            .end((err,res) => {
            })
    }
}