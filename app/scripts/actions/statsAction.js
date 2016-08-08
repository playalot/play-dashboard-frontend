import Request from 'superagent'

export const RECEIVE_STATS = 'RECEIVE_STATS'

function receiveStats(res) {
    return {
        type: RECEIVE_STATS,
        res
    }
}

export function fetchStats() {
    return function(dispatch) {
        return Request
            .get(`/api/stats`)
            .end(function(err,res){
                dispatch(receiveStats(res.body))
            })
    }
}