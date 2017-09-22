import Request from 'superagent'

export const TL_RECEIVE_TAG = 'TL_RECEIVE_TAG'

export const TL_SET_CLASSIFICATION = 'TL_SET_CLASSIFICATION'
export const TL_REMOVE_CLASSIFICATION = 'TL_REMOVE_CLASSIFICATION'

export const TL_RECOMMEND_TAG = 'TL_RECOMMEND_TAG'
export const TL_DELETE_TAG = 'TL_DELETE_TAG'
export const TL_RECEIVE_SUGGESTION = 'TL_RECEIVE_SUGGESTION'
export const TL_CLEAR_SUGGESTION = 'TL_CLEAR_SUGGESTION'

function receiveTag(res,totalPages,page,filter,query,children) {
    return {
        type: TL_RECEIVE_TAG,
        res,
        totalPages,
        page,
        filter,
        query,
        children
    }
}
function _setClassification(tid, cid) {
    return {
        type: TL_SET_CLASSIFICATION,
        tid,
        cid
    }
}
function _removeClassification(tid, c) {
    return {
        type: TL_REMOVE_CLASSIFICATION,
        tid,
        c
    }
}
function _recommendTag(tid) {
    return {
        type: TL_RECOMMEND_TAG,
        tid,
    }
}
function _deleteTag(tid) {
    return {
        type: TL_DELETE_TAG,
        tid,
    }
}
function receiveSuggestion(res) {
    return {
        type: TL_RECEIVE_SUGGESTION,
        res
    }
}
function _clearSuggestion() {
    return {
        type: TL_CLEAR_SUGGESTION
    }
}

export const setClassification = (tid, cid) => {
    return (dispatch, getState) => {
        return Request
            .post(`/api/tag/${tid}/class/${cid}`)
            .end(function(err, res) {
                dispatch(_setClassification(tid, cid))
            })
    }
}
export const removeClassification = (tid, c) => {
    return (dispatch, getState) => {
        return Request
            .del(`/api/tag/${tid}/class/${c}`)
            .end(function(err, res) {
                dispatch(_removeClassification(tid, c))
            })
    }
}

export const recommendTag = (tid) => {
    return (dispatch) => {
        return Request
            .post(`/api/recommend/home/${tid}?type=tag`)
            .end((err,res) => {
                dispatch(_recommendTag(tid))
            })
    }
}
export const deleteTag = (tid) => {
    return (dispatch) => {
        return Request
            .del(`/api/tag/${tid}`)
            .end((err,res) => {
                dispatch(_deleteTag(tid))
            })
    }
}

export const fetchSuggestion = (q) => {
    return (dispatch) => {
        return Request
            .get(`/api/tags/search`)
            .query({ q })
            .end((err,res) => {
                dispatch(receiveSuggestion(res.body.tags))
            })
    }
}

export const clearSuggestion = () => {
    return (dispatch) => {
        dispatch(_clearSuggestion())
    }
}

export function getTag(page = 0,query = '') {
    return (dispatch,getState) => {
        let params = { page }
        const { type } = getState().tagReducer.toJS()
        if(type) {
            params.type = type
        }
        if(query) {
            params.query = query
        }
        return Request
            .get(`/api/tags`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveTag(res.body.tags,res.body.totalPages,page,type,query,res.body.children))
            })
    }
}

export function getTagBy (page = 0 ,type = '',query ='') {
    return (dispatch,getState) => {
        let params = { page }
        if(type) {
            params.type = type
        }
        if(query) {
            params.query = query
        }
        return Request
            .get(`/api/tags`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveTag(res.body.tags,res.body.totalPages,page,type,query,res.body.children))
            })
    }
}