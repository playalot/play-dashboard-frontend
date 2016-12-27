import Request from 'superagent'

export const EXPLORE_RECEIVE_DATA = 'EXPLORE_RECEIVE_DATA'


export const EXPLORE_ADD_BANNER = 'EXPLORE_ADD_BANNER'
export const EXPLORE_DELETE_BANNER = 'EXPLORE_DELETE_BANNER'
export const EXPLORE_ADD_TOPIC = 'EXPLORE_ADD_TOPIC'

function receiveExplore(res) {
    return {
        type: EXPLORE_RECEIVE_DATA,
        banners:res.banners,
        topics:res.topics,
        toys:res.toys
    }
}
        
function _addBanner(res) {
    return {
        type: EXPLORE_ADD_BANNER,
        res
    }
}
function _addTopic(res) {
    return {
        type: EXPLORE_ADD_TOPIC,
        res
    }
}
function _deleteBanner(id,target) {
    return {
        type: EXPLORE_DELETE_BANNER,
        id,
        target,
    }
}

export function fetchExplore() {
    return(dispatch) => {
        return Request
            .get(`/api/banners`)
            .end((err,res) => {
                dispatch(receiveExplore(res.body))
            })
    }
}

export function addBanner() {
    return (dispatch) => {
        return Request
            .post(`/api/recommend?place=banner`)
            .end((err,res) => {
                dispatch(_addBanner(res.body))
            })
    }
}

export function deleteBanner(id,target) {
    return (dispatch) => {
        return Request
            .del(`/api/recommend/${id}`)
            .end((err,res) => {
                dispatch(_deleteBanner(id,target))
            })

    }
}

export function addTopic() {
    return (dispatch) => {
        return Request
            .post(`/api/recommend?place=topic`)
            .end((err,res) => {
                dispatch(_addTopic(res.body))
            })
    }
}
