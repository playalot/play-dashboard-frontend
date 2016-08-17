import Request from 'superagent'

export const EP_RECEIVE_BANNER = 'EP_RECEIVE_BANNER'
export const EP_RECEIVE_THEME = 'EP_RECEIVE_THEME'
export const EP_RECEIVE_THEME_MORE = 'EP_RECEIVE_THEME_MORE'
export const EP_SET_THEME_NO_MORE = 'EP_SET_THEME_NO_MORE'

export const EP_ADD_BANNER = 'EP_ADD_BANNER'
export const EP_DELETE_BANNER = 'EP_DELETE_BANNER'
export const EP_ADD_THEME = 'EP_ADD_THEME'
export const EP_DELETE_THEME = 'EP_DELETE_THEME'

function receiveBanner(res) {
    return {
        type: EP_RECEIVE_BANNER,
        res
    }
}
function receiveTheme(res) {
    return {
        type: EP_RECEIVE_THEME,
        res
    }
}
function receiveThemeMore(res) {
    return {
        type: EP_RECEIVE_THEME_MORE,
        res
    }
}
function setThemeNoMore(flag) {
    return {
        type: EP_SET_THEME_NO_MORE,
        flag
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
export function fetchTheme() {
    return (dispatch) => {
        return Request
            .get(`/api/themes`)
            .query({page:0})
            .end((err,res) => {
                dispatch(receiveTheme(res.body.themes))
            })
    }
}
export function fetchThemeMore() {
    return (dispatch,getState) => {
        let page = getState().exploreReducer.getIn(['status','page'])
        console.warn(page)
        return Request
            .get(`/api/themes`)
            .query({page})
            .end((err,res) => {
                if(!res.body.themes.length){
                    return dispatch(setThemeNoMore(true))
                }
                dispatch(receiveThemeMore(res.body.themes))
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