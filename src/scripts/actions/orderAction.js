import Request from 'superagent'

export const ORDER_L_RECEIVE_ORDER = 'ORDER_L_RECEIVE_ORDER'
export const ORDER_L_RECEIVE_ORDER_BY_TOY = 'ORDER_L_RECEIVE_ORDER_BY_TOY'
export const ORDER_L_RECEIVE_ORDER_BY_USER = 'ORDER_L_RECEIVE_ORDER_BY_USER'
export const ORDER_L_ADD_TRACKING = 'ORDER_L_ADD_TRACKING'
export const ORDER_L_SET_STATUS = 'ORDER_L_SET_STATUS'
export const ORDER_L_START_PAY = 'ORDER_L_START_PAY'

function receiveOrder(res,totalPages,page,status,merchant,year,month,summary,filter) {
    return {
        type: ORDER_L_RECEIVE_ORDER,
        res,
        totalPages,
        page,
        status,
        merchant,
        year,
        month,
        summary,
        filter
    }
}
function receiveOrderByToy(orders,toy) {
    return {
        type: ORDER_L_RECEIVE_ORDER_BY_TOY,
        orders,
        toy
    }
}
function receiveOrderByUser(orders) {
    return {
        type: ORDER_L_RECEIVE_ORDER_BY_USER,
        orders,
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
function _startPay(id) {
    return {
        type : ORDER_L_START_PAY,
        id
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
export function startPay(id) {
    return dispatch => {
        return Request
            .post(`/api/order/${id}/startPay`)
            .end((err,res) => {
                if(err){
                    alert('通知补款失败')
                }else{
                    alert('通知补款成功')
                    dispatch(_startPay(id))
                }
            })
    }
}

export function getOrderByToy(id) {
    return dispatch => {
        return Request
            .get(`/api/toy/${id}/orders`)
            .end((err,res) => {
                dispatch(receiveOrderByToy(res.body.orders,res.body.toy))
            })
    }
}

export function getOrderByUser(id) {
    return dispatch => {
        return Request
            .get(`/api/user/${id}/orders`)
            .end((err,res) => {
                dispatch(receiveOrderByUser(res.body.orders))
            })
    }
}

export function getOrder (page = 0,status = 'paid',merchant = '',year,month,filter) {
    return (dispatch,getState) => {
        let params = { page }
        if(status) {
            params.status = status
        }
        if(merchant) {
            params.merchant = merchant
        }
        if(year) {
            params.year = year
        }
        if(month) {
            params.month = month
        }
        if(filter) {
            params.filter = filter
        }
        return Request
            .get(`/api/orders`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveOrder(res.body.orders,res.body.totalPages,page,status,merchant,year,month,res.body.summary,filter))
            })
    }
}

