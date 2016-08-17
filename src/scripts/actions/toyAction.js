import Request from 'superagent'

export const SKL_RECEIVE_TOY = 'SKL_RECEIVE_TOY'
export const SKL_RECEIVE_TOY_NEW = 'SKL_RECEIVE_TOY_NEW'

export const SKL_TOGGLE_R18 = 'SKL_TOGGLE_R18'
export const SKL_TOGGLE_RECOMMEND = 'SKL_TOGGLE_RECOMMEND'
export const SKL_DELETE_TOY = 'SKL_DELETE_TOY'
export const SKL_ADD_TOY = 'SKL_ADD_TOY'

function receiveToy(res) {
    return {
        type: SKL_RECEIVE_TOY,
        res
    }
}
function receiveToyNew(res) {
    return {
        type: SKL_RECEIVE_TOY_NEW,
        res
    }
}
function _toggleR18(id) {
    return {
        type: SKL_TOGGLE_R18,
        id,
    }
}
function _toggleRecommend(id) {
    return {
        type: SKL_TOGGLE_RECOMMEND,
        id
    }
}
function _deleteToy(id) {
    return {
        type: SKL_DELETE_TOY,
        id
    }
}
function _addToy(res) {
    return {
        type: SKL_ADD_TOY,
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
    $.ajax({
          url: '/api/toy',
          dataType: 'json',
          type: 'POST',
          context: this,
          success: function(data) {
            console.log(data);
            this.toys.unshift(data);
            this.trigger(this.toys);
          }
      });
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
}
export function fetchToys(filter, query, sort) {
    if (status.query !== query || status.filter !== filter || status.sort !== sort) {
          status.filter = filter
          status.query = query
          status.sort = sort
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
