import Request from 'superagent'

export const FEL_RECEIVE_FEEDBACK = 'FEL_RECEIVE_FEEDBACK'
export const FEL_DELETE_FEEDBACK = 'FEL_DELETE_FEEDBACK'

function receiveFeedback(res) {
    return {
        type: FEL_RECEIVE_FEEDBACK,
        res
    }
}
function _deleteFeedback(id) {
    return {
        type: FEL_DELETE_FEEDBACK,
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
            .del(`/api/feedbacks/${id}`)
            .end((err,res) => {
                dispatch(_deleteFeedback(id))
            })
    }
}