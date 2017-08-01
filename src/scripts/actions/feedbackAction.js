import Request from 'superagent'

export const FEEDBACK_RECEIVE_DATA = 'FEEDBACK_RECEIVE_DATA'
export const FEEDBACK_DELETE_FEEDBACK = 'FEEDBACK_DELETE_FEEDBACK'

export const REPORT_RECEIVE_DATA = 'REPORT_RECEIVE_DATA'
export const REPORT_DELETE_REPORT = 'REPORT_DELETE_REPORT'
export const REPORT_TOGGLE_BLK = 'REPORT_TOGGLE_BLK'


export function deleteFeedback(id) {
    return (dispatch) => {
        return Request
            .del(`/api/feedback/${id}`)
            .end((err,res) => {
                dispatch({
                    type: FEEDBACK_DELETE_FEEDBACK,
                    id
                })
            })
    }
}

export function getFeedback (page = 0) {
    return (dispatch,getState) => {
        let params = { page }
        return Request
            .get(`/api/feedbacks`)
            .query(params)
            .end((err, res) => {
                const { feedbacks,totalPages } = res.body
                dispatch({
                    type: FEEDBACK_RECEIVE_DATA,
                    feedbacks,
                    totalPages,
                    page
                })
            })
    }
}

export function getReport (page = 0) {
    return (dispatch,getState) => {
        let params = { page }
        return Request
            .get(`/api/reports`)
            .query(params)
            .end((err, res) => {
                dispatch({
                    type:REPORT_RECEIVE_DATA,
                    reports:res.body.reports,
                    totalPages:res.body.totalPages,
                    page
                })
            })
    }
}

export function deleteReport(id) {
    return (dispatch) => {
        return Request
            .del(`/api/report/${id}`)
            .end((err,res) => {
                dispatch({
                    type: REPORT_DELETE_REPORT,
                    id
                })
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
            .end((err, res) => {
                dispatch({
                    type: REPORT_TOGGLE_BLK,
                    id
                })
            })
    }
}