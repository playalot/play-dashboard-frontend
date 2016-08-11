import Request from 'superagent'

export const HOME_RECEIVE_STATS = 'HOME_RECEIVE_STATS'

function receiveStats(res) {
    return {
        type: HOME_RECEIVE_STATS,
        res
    }
}

export function fetchStats() {
    return (dispatch) => {
        return Request
            .get(`/api/stats`)
            .end((err,res) => {
                dispatch(receiveStats(res.body))
            })
    }
}