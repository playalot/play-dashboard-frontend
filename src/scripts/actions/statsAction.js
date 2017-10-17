import Request from 'superagent'

export const HOME_RECEIVE_STATS = 'HOME_RECEIVE_STATS'
export const HOME_RECEIVE_ACTIVITIES_C = 'HOME_RECEIVE_ACTIVITIES_C'
export const HOME_RECEIVE_ACTIVITIES_O = 'HOME_RECEIVE_ACTIVITIES_O'

function receiveStats(res) {
    const { last,aggregate } = res
    const data = last.map((item,i) => {
        return{
            name:item.d + '日',
            last:item.n,
            aggregate:aggregate[i]['n']
        }
    })
    return {
        type: HOME_RECEIVE_STATS,
        res,
        data
    }
}

function receiveActivitiesC(res,totalPages,page) {
    return {
        type: HOME_RECEIVE_ACTIVITIES_C,
        res,
        totalPages,
        page
    }
}
function receiveActivitiesO(res,totalPages,page) {
    return {
        type: HOME_RECEIVE_ACTIVITIES_O,
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

export function getActivitiesC(page = 0) {
    return (dispatch,getState) => {
        let params = { page }
        return Request
            .get(`/api/activities/comment`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveActivitiesC(res.body.activities,res.body.totalPages,page))
            })
    }
}
export function getActivitiesO(page = 0) {
    return (dispatch,getState) => {
        let params = { page }
        return Request
            .get(`/api/activities/other`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveActivitiesO(res.body.activities,res.body.totalPages,page))
            })
    }
}