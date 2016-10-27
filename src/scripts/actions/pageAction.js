import Request from 'superagent'

export const PAGE_L_RECEIVE_ARTICLE = 'PAGE_L_RECEIVE_ARTICLE'
export const PAGE_L_RECEIVE_ARTICLE_MORE = 'PAGE_L_RECEIVE_ARTICLE_MORE'
export const PAGE_L_TOGGLE_PUB = 'PAGE_L_TOGGLE_PUB'
export const PAGE_L_TOGGLE_REC = 'PAGE_L_TOGGLE_REC'
export const PAGE_L_DELETE_ARTICLE = 'PAGE_L_DELETE_ARTICLE'
export const PAGE_L_SET_COVER_TYPE = 'PAGE_L_SET_COVER_TYPE'
export const PAGE_L_ADD_TOY = 'PAGE_L_ADD_TOY'

function receiveArticle(res) {
    return {
        type: PAGE_L_RECEIVE_ARTICLE,
        res,
    }
}
function receiveArticleMore(res) {
    return {
        type: PAGE_L_RECEIVE_ARTICLE_MORE,
        res,
    }
}
function _togglePub(id) {
    return {
        type: PAGE_L_TOGGLE_PUB,
        id
    }
}
function _toggleRec(id) {
    return {
        type: PAGE_L_TOGGLE_REC,
        id
    }
}
function _deleteArticle(id) {
    return {
        type: PAGE_L_DELETE_ARTICLE,
        id
    }
}
function _setCoverType(val,id) {
    return {
        type: PAGE_L_SET_COVER_TYPE,
        val,
        id
    }
}
function _addToy(id, toy) {
    return {
        type: PAGE_L_ADD_TOY,
        id,
        toy
    }
}
const status = {
    query: '',
    ts: null,
    overload: false,
}
export function fetchArticle(query) {
    if (status.query !== query) {
          status.query = query
          status.overload = true
          status.ts = null
    } else {
        status.overload = false
    }
    let params = {}
    if (status.query !== '') {
        params.query = status.query
    }
    if (status.ts !== null) {
        params.ts = status.ts
    }
    return (dispatch) => {
        return Request
            .get(`/api/pages`)
            .query(params)
            .end((err,res) => {
                status.ts = res.body.nextTs
                status.overload ? 
                dispatch(receiveArticle(res.body.pages)) 
                : dispatch(receiveArticleMore(res.body.pages))
            })
    }
}

export function togglePub(id) {
    return (dispatch,getState) => {
        let value = null
        let index = getState().page.get('pages').findIndex((item) => {
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
        let index = getState().page.get('pages').findIndex((item) => {
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
export function deleteArticle(id) {
    return (dispatch) => {
        Request
            .del(`/api/page/${id}`)
            .end((err,res) => {
                dispatch(_deleteArticle(id))
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

export function addToy(id, sid) {
    return (dispatch) => {
        return Request
            .post(`/api/page/${id}/toy/${sid}`)
            .end((err, res) => {
                dispatch(_addToy(id, res.body))
            })
    }
}