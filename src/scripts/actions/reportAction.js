import Request from 'superagent'

export const REL_RECEIVE_REPORT = 'REL_RECEIVE_REPORT'
export const REL_DELETE_REPORT = 'REL_DELETE_REPORT'

function receiveReport(res) {
    return {
        type: REL_RECEIVE_REPORT,
        res
    }
}
function _deleteReport(id) {
    return {
        type: REL_DELETE_REPORT,
        id
    }
}
export function fetchReport() {
    return (dispatch) => {
        return Request
            .get(`/api/reports`)
            .end((err,res) => {
                dispatch(receiveReport(res.body.reports))
            })
    }
}
export function deleteReport(id) {
    return (dispatch) => {
        return Request
            .del(`/api/reports/${id}`)
            .end((err,res) => {
                dispatch(_deleteReport(id))
            })
    }
}