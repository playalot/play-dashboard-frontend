import Request from 'superagent'

export const TRADE_L_RECEIVE_TRADE = 'TRADE_L_RECEIVE_TRADE'
export const TRADE_L_CHANGE_STATUS = 'TRADE_L_CHANGE_STATUS'

function receiveTrade(res,totalPages,page) {
	return {
		type: TRADE_L_RECEIVE_TRADE,
		res,
		totalPages,
		page,
	} 
}
function _changeStatus(id,status) {
    return {
        type: TRADE_L_CHANGE_STATUS,
        id,
        status
    }
}

export function getTrade(page = 0) {
	return (dispatch,getState) => {
        let params = { page }
        return Request
            .get(`/api/trades`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveTrade(res.body.items,res.body.totalPages,page))
            })
    }
}
export function changeStatus(id,status) {
    return (dispatch) => {
        return Request
            .post(`/api/trade/${id}/status`)
            .send({ status })
            .end((err,res) => {
                dispatch(_changeStatus(id,status))
            })
    }
}