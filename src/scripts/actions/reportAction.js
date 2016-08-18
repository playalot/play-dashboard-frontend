import Request from 'superagent'

export const REL_RECEIVE_REPORT = 'REL_RECEIVE_REPORT'

function receiveReport(res) {
    return {
        type: REL_RECEIVE_REPORT,
        res
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