import Request from 'superagent'

export const SKL_RECEIVE_SKU = 'SKL_RECEIVE_SKU'

export const SKL_TOGGLE_REC = 'SKL_TOGGLE_REC'
export const SKL_TOGGLE_BLK = 'SKL_TOGGLE_BLK'
export const SKL_DELETE_SKU = 'SKL_DELETE_SKU'
export const SKU_ADD_TOY_CLASS = 'SKU_ADD_TOY_CLASS'
export const SKU_REMOVE_TOY_CLASS = 'SKU_REMOVE_TOY_CLASS'

function receiveSku(res,totalPages,page,filter,filterType) {
    return {
        type: SKL_RECEIVE_SKU,
        res,
        totalPages,
        page,
        filter,
        filterType,
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
function _deleteSku(id,sid) {
    return {
        type: SKL_DELETE_SKU,
        id,
        sid
    }
}

function _addToyClass(tid, c) {
    return {
        type: SKU_ADD_TOY_CLASS,
        tid,
        c
    }
}
function _removeToyClass(tid, c) {
    return {
        type: SKU_REMOVE_TOY_CLASS,
        tid,
        c
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

export function getSku (page = 0) {
    return (dispatch,getState) => {
        let params = { page }
        const { filter, filterType } = getState().sku.toJS()
        if(filter) {
            params.merchant = filter
        }
        if(filterType) {
            params.type = filterType
        }
        return Request
            .get(`/api/stocks`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveSku(res.body.stocks,res.body.totalPages,page,filter,filterType))
            })
    }
}

export function getSkuBy (filter = '',filterType = '') {
    return (dispatch,getState) => {
        let page = 0
        let params = { page }
        if(filter) {
            params.merchant = filter
        }
        if(filterType) {
            params.type = filterType
            if(filterType === 'preOrder') {
                params.orderBy = 'orderClose'
            }
        }
        return Request
            .get(`/api/stocks`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveSku(res.body.stocks,res.body.totalPages,page,filter,filterType))
            })
    }
}

export function deleteSku(id,sid) {
    return dispatch => {
        return Request
            .del(`/api/toy/${id}/stock/${sid}`)
            .end((err,res) => {
                dispatch(_deleteSku(id,sid))
            })
    }
}

export const addToyClass = (tid, c) => {
    return (dispatch, getState) => {
        return Request
            .post(`/api/toy/${tid}/class/${c}`)
            .end((err, res) =>{
                dispatch(_addToyClass(tid, c))
            })
    }
}
export const removeToyClass = (tid, c) => {
    return (dispatch, getState) => {
        return Request
            .del(`/api/toy/${tid}/class/${c}`)
            .end((err, res) => {
                dispatch(_removeToyClass(tid, c))
            })
    }
}