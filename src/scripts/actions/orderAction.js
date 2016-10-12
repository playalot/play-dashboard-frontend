import Request from 'superagent'

export const ORDER_L_RECEIVE_ORDER = 'ORDER_L_RECEIVE_ORDER'

function receiveOrder(res) {
    return {
        type: ORDER_L_RECEIVE_ORDER,
        res
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
            })
    }
}