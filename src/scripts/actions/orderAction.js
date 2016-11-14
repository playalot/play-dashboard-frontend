import Request from 'superagent'

export const ORDER_L_RECEIVE_ORDER = 'ORDER_L_RECEIVE_ORDER'
export const ORDER_L_ADD_TRACKING = 'ORDER_L_ADD_TRACKING'
export const ORDER_L_FETCH_BY_ID = 'ORDER_L_FETCH_BY_ID'

function receiveOrder(res) {
    return {
        type: ORDER_L_RECEIVE_ORDER,
        res
    }
}
function _addTracking(id,trackNo) {
    return {
        type: ORDER_L_ADD_TRACKING,
        id,
        trackNo
    }
}
export function fetchOrder() {
    return (dispatch) => {
        return Request
            .get(`/api/orders`)
            .end((err,res) => {
                dispatch(receiveOrder(res.body.orders))
            })
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

export function fetchOrderDetail(id) {
    return {
        type: ORDER_L_FETCH_BY_ID,
        id
    }
}