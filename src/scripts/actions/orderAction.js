import Request from 'superagent'

export const ORDER_L_RECEIVE_ORDER = 'ORDER_L_RECEIVE_ORDER'
export const ORDER_L_ADD_TRACKING = 'ORDER_L_ADD_TRACKING'
export const ORDER_L_SET_STATUS = 'ORDER_L_SET_STATUS'

function receiveOrder(res,totalPages,page,status,merchant) {
    return {
        type: ORDER_L_RECEIVE_ORDER,
        res,
        totalPages,
        page,
        status,
        merchant
    }
}
function _addTracking(id,trackNo) {
    return {
        type: ORDER_L_ADD_TRACKING,
        id,
        trackNo
    }
}
function _setStatus(id,status) {
    return {
        type : ORDER_L_SET_STATUS,
        id,
        status
    }
}

export function addTracking(id,trackNo) {
    return (dispatch) => {
        return Request
            .post(`/api/order/${id}/track`)
            .send({
                trackNo
            })
            .end((err,res) => {
                if(!err){
                    dispatch(_addTracking(id,trackNo))
                }
            })
    }
}


export function setStatus(id,status) {
    return dispatch => {
        return Request
            .post(`/api/order/${id}/status`)
            .send({status})
            .end((err,res) => {
                dispatch(_setStatus(id,status))
            })
    }
}

export function getOrder (page = 0,status = '',merchant = '') {
    return (dispatch,getState) => {
        let params = { page }
        if(status) {
            params.status = status
        }
        if(merchant) {
            params.merchant = merchant
        }
        return Request
            .get(`/api/orders`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveOrder(res.body.orders,res.body.totalPages,page,status,merchant))
            })
    }
}
export function getOrderBy (status = '',merchant ='') {
    return (dispatch,getState) => {
        let page = 0
        let params = { page }
        return Request
            .get(`/api/orders`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveOrder(res.body.orders,res.body.totalPages,page,status,merchant))
            })
    }
}
