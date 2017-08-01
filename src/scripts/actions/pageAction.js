import Request from 'superagent'

export const PAGE_TOGGLE_PUB = 'PAGE_TOGGLE_PUB'
export const PAGE_TOGGLE_REC = 'PAGE_TOGGLE_REC'
export const PAGE_TOGGLE_SHARE = 'PAGE_TOGGLE_SHARE'
export const PAGE_SET_COVER_TYPE = 'PAGE_SET_COVER_TYPE'
export const PAGE_ADD_TOY = 'PAGE_ADD_TOY'
export const PAGE_REMOVE_TOY = 'PAGE_REMOVE_TOY'
export const PAGE_CLEAR_PAGE = 'PAGE_CLEAR_PAGE'
export const PAGE_DELETE_ARTICLE = 'PAGE_DELETE_ARTICLE'

export const PAGE_RECEIVE_PAGE = 'PAGE_RECEIVE_PAGE'


function receivePage(res,totalPages = 10,page,filter = '',query = '') {
    return {
        type: PAGE_RECEIVE_PAGE,
        res,
        totalPages,
        page,
        filter,
        query
    }
}

export function togglePub(id,isPub) {
    return (dispatch,getState) => {
        return Request
            .post(`/api/page/${id}/pub`)
            .send({ isPub })
            .end((err,res) => {
                dispatch({type:PAGE_TOGGLE_PUB,id})
            })
    }
}
export function toggleRec(id,recommend) {
    return (dispatch,getState) => {
        return Request
            .post(`/api/page/${id}/recommend`)
            .send({ recommend })
            .end((err,res) => {
                dispatch({type:PAGE_TOGGLE_REC,id})
            })
    }
}
export function toggleShare(id,forShare) {
    return (dispatch,getState) => {
        return Request
            .post(`/api/page/${id}/share`)
            .send({ forShare })
            .end((err,res) => {
                dispatch({type:PAGE_TOGGLE_SHARE,id})
            })
    }
}

export function deleteArticle(id) {
    return (dispatch) => {
        Request
            .del(`/api/page/${id}`)
            .end((err,res) => {
                dispatch({type:PAGE_DELETE_ARTICLE,id})
            })
    }
}

export function setCoverType(id,val) {
    return (dispatch) => {
        let coverType = val ? 'l' : 's'
        Request
            .post(`/api/page/${id}/cover`)
            .send({ coverType })
            .end((err,res) => {
                dispatch({type:PAGE_SET_COVER_TYPE,id,val})
            })
    }
}

export function addToy(id, sid) {
    return (dispatch) => {
        return Request
            .post(`/api/page/${id}/toy/${sid}`)
            .end((err, res) => {
                dispatch({type:PAGE_ADD_TOY,id,toy:res.body})
            })
    }
}
export function removeToy(id) {
    return (dispatch) => {
        return Request
            .del(`/api/page/${id}/toy`)
            .end((err,res) => {
                dispatch({type:PAGE_REMOVE_TOY,id})
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

export function getUserPage(id) {
    return dispatch => {
        return Request
            .get(`/api/user/${id}/pages`)
            .end((err,res) => {
                dispatch(receivePage(res.body.pages))
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

export function clearPage() {
    return {
        type: PAGE_CLEAR_PAGE
    }
}