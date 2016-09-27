import Request from 'superagent'

export const TOL_RECEIVE_TOY = 'TOL_RECEIVE_TOY'
export const TOL_RECEIVE_TOY_NEW = 'TOL_RECEIVE_TOY_NEW'

export const TOL_TOGGLE_R18 = 'TOL_TOGGLE_R18'
export const TOL_TOGGLE_RECOMMEND = 'TOL_TOGGLE_RECOMMEND'
export const TOL_DELETE_TOY = 'TOL_DELETE_TOY'
export const TOL_ADD_TOY = 'TOL_ADD_TOY'

function receiveToy(res) {
    return {
        type: TOL_RECEIVE_TOY,
        res
    }
}
function receiveToyNew(res) {
    return {
        type: TOL_RECEIVE_TOY_NEW,
        res
    }
}
function _toggleR18(id) {
    return {
        type: TOL_TOGGLE_R18,
        id,
    }
}
function _toggleRecommend(id) {
    return {
        type: TOL_TOGGLE_RECOMMEND,
        id
    }
}
function _deleteToy(id) {
    return {
        type: TOL_DELETE_TOY,
        id
    }
}
function _addToy(res) {
    return {
        type: TOL_ADD_TOY,
        res
    }
}
export function toggleR18(id) {
    return (dispatch,getState) => {
        let value = null
        let index = getState().toyReducer.get('toys').findIndex((item) => {
            value = item.get('id') === id ? item.get('isR18') : null
            return item.get('id') === id
        })
        Request
            .post(`/api/toy/${id}/r18`)
            .send({
                r18: !value
            })
            .end((err,res) => {
                dispatch(_toggleR18(id))
            })
    }
}
export function toggleRecommend(id) {
    return (dispatch,getState) => {
        let value = null
        let index = getState().toyReducer.get('toys').findIndex((item) => {
            value = item.get('id') === id ? item.get('isRec') : null
            return item.get('id') === id
        })
        Request
            .post(`/api/toy/${id}/recommend`)
            .send({
                recommend: !value
            })
            .end((err,res) => {
                dispatch(_toggleRecommend(id))
            })
    }
}
export function deleteToy(id) {
    return (dispatch) => {
        Request
            .del(`/api/toy/${id}`)
            .end((err,res) => {
                dispatch(_deleteToy(id))
            })
    }
}
export function recommend(id) {
    return (dispatch) => {
        Request
            .post(`/api/recommend/home/${id}?type=toy`)
            .end((err,res) => {

            })
    }
}
export function addToy() {
    return (dispatch) => {
        Request
            .post(`/api/toy`)
            .end((err,res) => {
                dispatch(_addToy(res.body))
            })
    }
}
const status = {
    filter: '',
    query: '',
    sort: 'created',
    page: 0,
    overload: false,
    year:'',
    month:'',
}
export function fetchToys(filter, query, sort, year, month, newPage) {
    if (status.query !== query || status.filter !== filter || status.sort !== sort || status.year !== year || status.month !== month || newPage) {
          status.filter = filter
          status.query = query
          status.sort = sort
          status.year = year
          status.month = month
          status.page = 0
          status.overload = true
    } else {
        status.overload = false
    }
    let params = {}
    if (status.page !== 0) {
        params.page = status.page
    }
    if (status.filter !== '') {
        params.filter = status.filter
    }
    if (status.query !== '') {
        params.query = status.query
    }
    if (status.year !== '') {
        params.year = status.year
    }
    if (status.year !=='' && status.month !== '') {
        params.month = status.month
    }
    if (status.sort !== '') {
        params.sort = status.sort
    }
    return (dispatch) => {
        return Request
            .get(`/api/toys`)
            .query(params)
            .end((err,res) => {
                status.page = res.body.nextPage
                status.overload ? dispatch(receiveToyNew(res.body.toys)) : dispatch(receiveToy(res.body.toys))
            })
    }
}
