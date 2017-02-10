import Request from 'superagent'

export const REL_RECEIVE_REPORT = 'REL_RECEIVE_REPORT'
export const REL_DELETE_REPORT = 'REL_DELETE_REPORT'
export const REL_TOGGLE_BLK = 'REL_TOGGLE_BLK'

function receiveReport(res,totalPages,page) {
    return {
        type: REL_RECEIVE_REPORT,
        res,
        totalPages,
        page
    }
}
function _deleteReport(id) {
    return {
        type: REL_DELETE_REPORT,
        id
    }
}
function _toggleBlk(id) {
    return {
        type: REL_TOGGLE_BLK,
        id
    }
}
export function getReport (page = 0) {
    return (dispatch,getState) => {
        let params = { page }
        return Request
            .get(`/api/reports`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveReport(res.body.reports,res.body.totalPages,page))
            })
    }
}

export function deleteReport(id) {
    return (dispatch) => {
        return Request
            .del(`/api/report/${id}`)
            .end((err,res) => {
                dispatch(_deleteReport(id))
            })
    }
}

export function toggleBlk(id) {
    return (dispatch, getState) => {
        let value = null
        let index = getState().report.get('reports').findIndex((item) => {
            value = item.get('targetId') === id ? item.getIn(['target','isBlk']) : null
            return item.get('targetId') === id
        })
        return Request
            .post(`/api/post/${id}/block`)
            .send({
                block: !value
            })
            .end(function(err, res) {
                dispatch(_toggleBlk(id))
            })
    }
}