import Request from 'superagent'

export const FB_L_RECEIVE_FEEDBACK = 'FB_L_RECEIVE_FEEDBACK'
export const FB_L_DELETE_FEEDBACK = 'FB_L_DELETE_FEEDBACK'

function receiveFeedback(res,totalPages,page) {
    return {
        type: FB_L_RECEIVE_FEEDBACK,
        res,
        totalPages,
        page
    }
}
function _deleteFeedback(id) {
    return {
        type: FB_L_DELETE_FEEDBACK,
        id
    }
}
export function deleteFeedback(id) {
    return (dispatch) => {
        return Request
            .del(`/api/feedback/${id}`)
            .end((err,res) => {
                dispatch(_deleteFeedback(id))
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
                dispatch(receiveFeedback(res.body.feedbacks,res.body.totalPages,page))
            })
    }
}
