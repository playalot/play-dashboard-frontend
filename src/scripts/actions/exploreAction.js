import Request from 'superagent'

export const EXPLORE_RECEIVE_BANNER = 'EXPLORE_RECEIVE_BANNER'
export const EXPLORE_RECEIVE_THEME = 'EXPLORE_RECEIVE_THEME'
export const EXPLORE_RECEIVE_THEME_MORE = 'EXPLORE_RECEIVE_THEME_MORE'
export const EXPLORE_SET_THEME_NO_MORE = 'EXPLORE_SET_THEME_NO_MORE'

export const EXPLORE_ADD_BANNER = 'EXPLORE_ADD_BANNER'
export const EXPLORE_DELETE_BANNER = 'EXPLORE_DELETE_BANNER'
export const EXPLORE_ADD_THEME = 'EXPLORE_ADD_THEME'
export const EXPLORE_DELETE_THEME = 'EXPLORE_DELETE_THEME'

function receiveBanner(res) {
    return {
        type: EXPLORE_RECEIVE_BANNER,
        res
    }
}
function receiveTheme(res) {
    return {
        type: EXPLORE_RECEIVE_THEME,
        res
    }
}
function setThemeNoMore(flag) {
    return {
        type: EXPLORE_SET_THEME_NO_MORE,
        flag
    }
}
function _addBanner(res) {
    return {
        type: EXPLORE_ADD_BANNER,
        res
    }
}
function _deleteBanner(id) {
    return {
        type: EXPLORE_DELETE_BANNER,
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
