import Request from 'superagent'

export const UD_RECEIVE_INFO = 'UD_RECEIVE_INFO'
//pages
export const UD_RECEIVE_PAGE = 'UD_RECEIVE_PAGE'
export const UD_PAGE_TOGGLE_PUB = 'UD_PAGE_TOGGLE_PUB'
export const UD_PAGE_TOGGLE_REC = 'UD_PAGE_TOGGLE_REC'
export const UD_PAGE_DELETE_PAGE = 'UD_PAGE_DELETE_PAGE'
export const UD_PAGE_SET_COVER_TYPE = 'UD_PAGE_SET_COVER_TYPE'

//user
export const UD_USER_SET_ACTIVE = 'UD_USER_SET_ACTIVE'


function receiveUserInfo(res) {
    return {
        type: UD_RECEIVE_INFO,
        res
    }
}
export function fetchUserInfo(id) {
    return (dispatch) => {
        return Request
            .get(`/api/user/${id}`)
            .end((err,res) => {
                dispatch(receiveUserInfo(res.body))
            })
    }
}

export function togglePub(id) {
    return (dispatch,getState) => {
        let value = null
        let index = getState().userDetail.get('pages').findIndex((item) => {
            value = item.get('id') === id ? item.get('isPub') : null
            return item.get('id') === id
        })
        return Request
            .post(`/api/page/${id}/pub`)
            .send({
                isPub: !value
            })
            .end((err,res) => {
                dispatch(_togglePub(id))
            })
    }
}
export function toggleRec(id) {
    return (dispatch,getState) => {
        let value = null
        let index = getState().userDetail.get('pages').findIndex((item) => {
            value = item.get('id') === id ? item.get('isRec') : null
            return item.get('id') === id
        })
        return Request
            .post(`/api/page/${id}/recommend`)
            .send({
                recommend: !value
            })
            .end((err,res) => {
                dispatch(_toggleRec(id))
            })
    }
}
export function deletePage(id) {
    return (dispatch) => {
        Request
            .del(`/api/page/${id}`)
            .end((err,res) => {
                dispatch(_deletePage(id))
            })
    }
}
export function setCoverType(val,id) {
    return (dispatch) => {
        let flag = val ? 'l' : 's'
        Request
            .post(`/api/page/${id}/cover`)
            .send({
                coverType: flag
            })
            .end((err,res) => {
                dispatch(_setCoverType(val,id))    
            })
    }
}
export function fetchUserPage(id) {
    return (dispatch) => {
        return Request
            .get(`/api/user/${id}/pages`)
            .end((err,res) => {
                dispatch(receiveUserPage(res.body.pages))
            })
    }
}

export function setActive(id) {
    return (dispatch,getState) => {
        let act = getState().userDetail.getIn(['user','isActive'])
        return Request
            .post(`/api/user/${id}/active`)
            .send({
                active:!act
            })
            .end((err,res) => {
                dispatch(_setActive())
            })
    }
}
function _setActive() {
    return {
        type: UD_USER_SET_ACTIVE
    }
}
function _togglePub(id) {
    return {
        type: UD_PAGE_TOGGLE_PUB,
        id
    }
}
function _toggleRec(id) {
    return {
        type: UD_PAGE_TOGGLE_REC,
        id
    }
}
function _deletePage(id) {
    return {
        type: UD_PAGE_DELETE_PAGE,
        id
    }
}
function _setCoverType(val,id) {
    return {
        type: UD_PAGE_SET_COVER_TYPE,
        val,
        id
    }
}
function receiveUserPage(res) {
    return {
        type: UD_RECEIVE_PAGE,
        res
    }
}