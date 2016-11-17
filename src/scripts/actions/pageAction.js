import Request from 'superagent'

export const PAGE_L_RECEIVE_PAGE = 'PAGE_L_RECEIVE_PAGE'
export const PAGE_L_TOGGLE_PUB = 'PAGE_L_TOGGLE_PUB'
export const PAGE_L_TOGGLE_REC = 'PAGE_L_TOGGLE_REC'
export const PAGE_L_DELETE_ARTICLE = 'PAGE_L_DELETE_ARTICLE'
export const PAGE_L_SET_COVER_TYPE = 'PAGE_L_SET_COVER_TYPE'
export const PAGE_L_ADD_TOY = 'PAGE_L_ADD_TOY'
export const PAGE_L_TOGGLE_SHARE = 'PAGE_L_TOGGLE_SHARE'


function receivePage(res,totalPages,page,filter,query) {
    return {
        type: PAGE_L_RECEIVE_PAGE,
        res,
        totalPages,
        page,
        filter,
        query
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
function _toggleShare(id) {
    return {
        type: PAGE_L_TOGGLE_SHARE,
        id
    }
}
const status = {
    query: '',
    ts: null,
    overload: false,
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

export function toggleShare(id) {
    return (dispatch,getState) => {
        let value = null
        let index = getState().page.get('pages').findIndex((item) => {
            value = item.get('id') === id ? item.get('forShare') : null
            return item.get('id') === id
        })
        return Request
            .post(`/api/page/${id}/share`)
            .send({
                forShare: !value
            })
            .end((err,res) => {
                dispatch(_toggleShare(id))
            })
    }
}



export function getPage (page = 0) {
    return (dispatch,getState) => {
        let params = { page }
        const { query,filter } = getState().page.toJS()
        if(query) {
            params.query = query
        }
        if(filter) {
            params.filter = filter
        }
        return Request
            .get(`/api/pages`)
            .query(params)
            .end((err, res) => {
                dispatch(receivePage(res.body.pages,res.body.totalPages,page,filter,query))
            })
    }
}

export function getPageBy (filter = '',query = '') {
    return (dispatch,getState) => {
        let page = 0
        let params = { page }
        if(query) {
            params.query = query
        }
        if(filter) {
            params.filter = filter
        }
        return Request
            .get(`/api/pages`)
            .query(params)
            .end((err, res) => {
                dispatch(receivePage(res.body.pages,res.body.totalPages,page,filter,query))
            })
    }
}