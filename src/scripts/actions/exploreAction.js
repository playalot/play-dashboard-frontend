import Request from 'superagent'

export const EXPLORE_RECEIVE_DATA = 'EXPLORE_RECEIVE_DATA'


export const EXPLORE_ADD_BANNER = 'EXPLORE_ADD_BANNER'
export const EXPLORE_DELETE_BANNER = 'EXPLORE_DELETE_BANNER'
export const EXPLORE_ADD_TOPIC = 'EXPLORE_ADD_TOPIC'
export const EXPLORE_ADD_TOY = 'EXPLORE_ADD_TOY'

function receiveExplore(res) {
    return {
        type: EXPLORE_RECEIVE_DATA,
        banners:res.banners,
        themes:res.themes,
        toys:res.toys,
        drafts:res.drafts,
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
function _addToy(res) {
    return {
        type: EXPLORE_ADD_TOY,
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
            .get(`/api/recommends`)
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
            .post(`/api/recommend?place=theme`)
            .end((err,res) => {
                dispatch(_addTopic(res.body))
            })
    }
}

export function addToy() {
    return (dispatch) => {
        return Request
            .post(`/api/recommend?place=toy`)
            .end((err,res) => {
                dispatch(_addToy(res.body))
            })
    }
}