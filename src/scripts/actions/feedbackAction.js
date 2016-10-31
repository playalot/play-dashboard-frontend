import Request from 'superagent'

export const FB_L_RECEIVE_FEEDBACK = 'FB_L_RECEIVE_FEEDBACK'
export const FB_L_DELETE_FEEDBACK = 'FB_L_DELETE_FEEDBACK'

function receiveFeedback(res) {
    return {
        type: FB_L_RECEIVE_FEEDBACK,
        res
    }
}
function _deleteFeedback(id) {
    return {
        type: FB_L_DELETE_FEEDBACK,
        id
    }
}
export function fetchFeedback() {
    return (dispatch) => {
        return Request
            .get(`/api/feedbacks`)
            .end((err,res) => {
                dispatch(receiveFeedback(res.body.feedbacks))
            })
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