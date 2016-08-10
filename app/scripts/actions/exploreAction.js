import Request from 'superagent'

export const RECEIVE_BANNER = 'RECEIVE_BANNER'
export const RECEIVE_THEME = 'RECEIVE_THEME'
export const RECEIVE_THEME_MORE = 'RECEIVE_THEME_MORE'

export const EP_ADD_BANNER = 'EP_ADD_BANNER'
export const EP_DELETE_BANNER = 'EP_DELETE_BANNER'
export const EP_ADD_THEME = 'EP_ADD_THEME'
export const EP_DELETE_THEME = 'EP_DELETE_THEME'

function receiveBanner(res) {
    return {
        type: RECEIVE_BANNER,
        res
    }
}
function receiveTheme(res) {
    return {
        type: RECEIVE_THEME,
        res
    }
}
function receiveThemeMore(res) {
    return {
        type: RECEIVE_THEME_MORE,
        res
    }
}
function _addBanner(res) {
    return {
        type: EP_ADD_BANNER,
        res
    }
}
function _deleteBanner(id) {
    return {
        type: EP_DELETE_BANNER,
        id
    }
}
function _addTheme(res) {
    return {
        type: EP_ADD_THEME,
        res
    }
}
function _deleteTheme(id) {
    return {
        type: EP_DELETE_THEME,
        id
    }
}
export function fetchBanner() {
    return (dispatch) => {
        return Request
            .get(`/api/banners`)
            .end(function(err,res){
                dispatch(receiveBanner(res.body.banners))
            })
    }
}
const status = {
    page:0,
}
export function fetchTheme(more) {
    more ? ++status.page : (status.page = 0)
    return (dispatch) => {
        return Request
            .get(`/api/themes`)
            .query({page:status.page})
            .end(function(err,res){
                more ? dispatch(receiveThemeMore(res.body.themes)) : dispatch(receiveTheme(res.body.themes))
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

export function deleteBanner(id) {
    return (dispatch) => {
        return Request
            .del(`/api/recommend/${id}`)
            .end((err,res) => {
                dispatch(_deleteBanner(id))
            })
        
    }
}

export function addTheme() {
    return (dispatch) => {
        return Request
            .post(`/api/recommend?place=theme`)
            .end((err,res) => {
                dispatch(_addTheme(res.body))
            })
    }
}

export function deleteTheme(id) {
    return (dispatch) => {
        return Request
            .del(`/api/recommend/${id}`)
            .end((err,res) => {
                dispatch(_deleteTheme(id))
            })
        
    }
}