import Request from 'superagent'

export const FEL_RECEIVE_FEEDBACK = 'FEL_RECEIVE_FEEDBACK'

function receiveFeedback(res) {
    return {
        type: FEL_RECEIVE_FEEDBACK,
        res
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