import Request from 'superagent'

export const HOME_RECEIVE_STATS = 'HOME_RECEIVE_STATS'
export const HOME_RECEIVE_ACTIVITIES = 'HOME_RECEIVE_ACTIVITIES'

function receiveStats(res) {
    res.last.map((item,i) => {
        item.x = item.d
        item.y = item.n
    })
    res.aggregate.map((item,i) => {
        item.x = item.d
        item.y = item.n
    })
    return {
        type: HOME_RECEIVE_STATS,
        res
    }
}

function receiveActivities(res,totalPages,page) {
    return {
        type: HOME_RECEIVE_ACTIVITIES,
        res,
        totalPages,
        page
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

export function getActivities(page = 0) {
    return (dispatch,getState) => {
        let params = { page }
        return Request
            .get(`/api/activities`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveActivities(res.body.activities,res.body.totalPages,page))
            })
    }
}