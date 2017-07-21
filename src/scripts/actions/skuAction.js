import Request from 'superagent'

export const SKL_RECEIVE_SKU = 'SKL_RECEIVE_SKU'

export const SKL_DELETE_SKU = 'SKL_DELETE_SKU'
export const SKU_ADD_TOY_CLASS = 'SKU_ADD_TOY_CLASS'
export const SKU_REMOVE_TOY_CLASS = 'SKU_REMOVE_TOY_CLASS'
export const SKU_RECEIVE_SKU_BY_QUERY = 'SKU_RECEIVE_SKU_BY_QUERY'
export const SKU_CLEAR_SUGGESTION = 'SKU_CLEAR_SUGGESTION'

function receiveSku(res,totalPages,page,merchant,_type,query,orderBy,asc) {
    return {
        type: SKL_RECEIVE_SKU,
        res,
        totalPages,
        page,
        merchant,
        _type,
        query,
        orderBy,
        asc
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
export function getSku (page = 0) {
    return (dispatch,getState) => {
        const { merchant, type,query,orderBy,asc } = getState().sku.toJS()
        let params = { page,orderBy,asc }
        if(merchant) {
            params.merchant = merchant
        }
        if(type) {
            params.type = type
        }
        if(query) {
            params.query = query
        }
        return Request
            .get(`/api/stocks`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveSku(res.body.stocks,res.body.totalPages,page,merchant,type,query))
            })
    }
}

export function getSkuBy (merchant = '',type = '',query = '',orderBy,asc) {
    return (dispatch,getState) => {
        let page = 0
        let params = { page,orderBy,asc }
        if(query) {
            params.q = query
        }
        if(merchant) {
            params.merchant = merchant
        }
        if(type) {
            params.type = type
        }
        return Request
            .get(`/api/stocks`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveSku(res.body.stocks,res.body.totalPages,page,merchant,type,query,orderBy,asc))
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

export function fetchSkuByQuery(query) {
    return (dispatch) => {
        return Request
            .get(`/api/toys`)
            .query({query,stock:true})
            .end((err,res) => {
                dispatch(receiveSkuByQuery(res.body.toys))
            })
    }
}

export function clearSuggestion() {
    return {
        type: SKU_CLEAR_SUGGESTION
    }
}

function receiveSkuByQuery(res) {
    return {
        type: SKU_RECEIVE_SKU_BY_QUERY,
        res
    }
}