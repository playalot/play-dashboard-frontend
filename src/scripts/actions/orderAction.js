import Request from 'superagent'

export const ORDER_ADD_TRACKING = 'ORDER_ADD_TRACKING'
export const ORDER_SET_STATUS = 'ORDER_SET_STATUS'
export const ORDER_START_PAY = 'ORDER_START_PAY'
export const ORDER_CLEAR_ORDER = 'ORDER_CLEAR_ORDER'


export const ORDER_L_RECEIVE_ORDER = 'ORDER_L_RECEIVE_ORDER'
export const ORDER_L_RECEIVE_ORDER_BY_TOY = 'ORDER_L_RECEIVE_ORDER_BY_TOY'
export const ORDER_L_RECEIVE_ORDER_BY_USER = 'ORDER_L_RECEIVE_ORDER_BY_USER'

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


export function addTracking(id,trackNo) {
    return (dispatch) => {
        return Request
            .post(`/api/order/${id}/track`)
            .send({ trackNo })
            .end((err,res) => {
                dispatch({
                    type: ORDER_ADD_TRACKING,
                    id,
                    trackNo
                })
            })
    }
}
export function setStatus(id,status) {
    return dispatch => {
        return Request
            .post(`/api/order/${id}/status`)
            .send({status})
            .end((err,res) => {
                dispatch({
                    type : ORDER_SET_STATUS,
                    id,
                    status
                })
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
                    dispatch({
                        type : ORDER_START_PAY,
                        id
                    })
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

export function getOrder (page = 0,status = '',merchant = '',year,month,filter) {
    return (dispatch,getState) => {
        let params = { page }
        status ? params.status = status : null
        merchant ? params.merchant = merchant : null
        year ? params.year = year : null
        month ? params.month = month : null
        filter ? params.filter = filter : null

        return Request
            .get(`/api/orders`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveOrder(res.body.orders,res.body.totalPages,page,status,merchant,year,month,res.body.summary,filter))
            })
    }
}

export function clearOrder() {
    return {
        type:ORDER_CLEAR_ORDER
    }
}
