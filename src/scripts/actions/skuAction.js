import Request from 'superagent'

export const SKL_RECEIVE_SKU = 'SKL_RECEIVE_SKU'

export const SKL_TOGGLE_REC = 'SKL_TOGGLE_REC'
export const SKL_TOGGLE_BLK = 'SKL_TOGGLE_BLK'
export const SKL_DELETE_SKU = 'SKL_DELETE_SKU'

function receiveSku(res,totalPages,page,filter) {
    return {
        type: SKL_RECEIVE_SKU,
        res,
        totalPages,
        page,
        filter
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
        const { filter } = getState().sku.toJS()
        if(filter) {
            params.filter = filter
        }
        return Request
            .get(`/api/stocks`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveSku(res.body.stocks,res.body.totalPages,page,filter))
            })
    }
}

export function getSkuBy (filter = '') {
    return (dispatch,getState) => {
        let page = 0
        let params = { page }
        if(filter) {
            params.filter = filter
        }
        return Request
            .get(`/api/stocks`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveSku(res.body.stocks,res.body.totalPages,page,filter))
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