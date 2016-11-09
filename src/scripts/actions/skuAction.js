import Request from 'superagent'

export const SKL_RECEIVE_SKU = 'SKL_RECEIVE_SKU'
export const SKL_RECEIVE_SKU_NEW = 'SKL_RECEIVE_SKU_NEW'

export const SKL_TOGGLE_REC = 'SKL_TOGGLE_REC'
export const SKL_TOGGLE_BLK = 'SKL_TOGGLE_BLK'

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
function _toggleRec(id) {
    return {
        type: SKL_TOGGLE_REC,
        id
    }
} 
function _toggleBlk(id) {
    return {
        type: SKL_TOGGLE_BLK,
        id
    }
}
export function toggleBlk(id) {
    return (dispatch) => {
        dispatch(_toggleBlk(id))
    }
}
export function toggleRec(id) {
    return (dispatch) => {
        dispatch(_toggleRec(id))
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
export function fetchSku(filter, query, sort, year, month, newPage) {
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
            .get(`/api/skus`)
            // .query(params)
            .end((err,res) => {
                // status.page = res.body.nextPage
                // status.overload ? dispatch(receiveToyNew(res.body.toys)) : dispatch(receiveToy(res.body.toys))
                dispatch(receiveSkuNew(res.body.skus))
            })
    }
}
