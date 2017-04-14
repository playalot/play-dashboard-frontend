import Request from 'superagent'

export const USER_L_RECEIVE_USER = 'USER_L_RECEIVE_USER'
export const USER_L_RECEIVE_USER_NEW = 'USER_L_RECEIVE_USER_NEW'

function receiveUser(res,totalPages,page,query,filterType) {
    return {
        type: USER_L_RECEIVE_USER,
        res,
        totalPages,
        page,
        query,
        filterType
    }
}
function receiveUserNew(res) {
    return {
        type: USER_L_RECEIVE_USER_NEW,
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

export function approveUser(id,type,note) {
    return (dispatch) => {
        return Request
            .post(`/api/user/${id}/approve`)
            .send({ type,note })
            .end((err,res) => {
                if(!err){
                    alert('认证成功')
                }
            })
    }
}

export function getUser (page = 0) {
    return (dispatch,getState) => {
        let params = { page }
        const { filter,filterType } = getState().user.toJS()
        if(filter) {
            params.filter = filter
        }
        if(filterType) {
            params.type = filterType
        }
        return Request
            .get(`/api/users`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveUser(res.body.users,res.body.totalPages,page,filter,filterType))
            })
    }
}


export function getUserBy (filter,filterType) {
    return (dispatch,getState) => {
        let page = 0
        let params = { page }
        if(filter) {
            params.filter = filter
        }
        if(filterType) {
            params.type = filterType
        }
        return Request
            .get(`/api/users`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveUser(res.body.users,res.body.totalPages,page,filter,filterType))
            })
    }
}