import Request from 'superagent'

export const SKL_RECEIVE_SKU = 'SKL_RECEIVE_SKU'
export const SKL_RECEIVE_SKU_NEW = 'SKL_RECEIVE_SKU_NEW'

export const SKL_TOGGLE_R18 = 'SKL_TOGGLE_R18'
export const SKL_TOGGLE_RECOMMEND = 'SKL_TOGGLE_RECOMMEND'
export const SKL_DELETE_SKU = 'SKL_DELETE_SKU'
export const SKL_ADD_SKU = 'SKL_ADD_SKU'

function receiveSku(res) {
    return {
        type: SKL_RECEIVE_SKU,
        res
    }
}
function receiveSkuNew(res) {
    return {
        type: SKL_RECEIVE_SKU_NEW,
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
function _deleteSku(id) {
    return {
        type: SKL_DELETE_SKU,
        id
    }
}
function _addSku(res) {
    return {
        type: SKL_ADD_SKU,
        res
    }
}
export function toggleR18(id) {
    return (dispatch,getState) => {
        let value = null
        let index = getState().skuReducer.get('skus').findIndex((item) => {
            value = item.get('id') === id ? item.get('isR18') : null
            return item.get('id') === id
        })
        Request
            .post(`/api/sku/${id}/r18`)
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
        let index = getState().skuReducer.get('skus').findIndex((item) => {
            value = item.get('id') === id ? item.get('isRec') : null
            return item.get('id') === id
        })
        Request
            .post(`/api/sku/${id}/recommend`)
            .send({
                recommend: !value
            })
            .end((err,res) => {
                dispatch(_toggleRecommend(id))
            })
    }
}
export function deleteSku(id) {
    return (dispatch) => {
        Request
            .del(`/api/sku/${id}`)
            .end((err,res) => {
                dispatch(_deleteSku(id))
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
export function addSku() {
    $.ajax({
          url: '/api/sku',
          dataType: 'json',
          type: 'POST',
          context: this,
          success: function(data) {
            console.log(data);
            this.skus.unshift(data);
            this.trigger(this.skus);
          }
      });
    return (dispatch) => {
        Request
            .post(`/api/sku`)
            .end((err,res) => {
                dispatch(_addSku(res.body))
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
export function fetchSku(filter, query, sort) {
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
            .get(`/api/skus`)
            .query(params)
            .end((err,res) => {
                status.page = res.body.nextPage
                status.overload ? dispatch(receiveSkuNew(res.body.skus)) : dispatch(receiveSku(res.body.skus))
            })
    }
}