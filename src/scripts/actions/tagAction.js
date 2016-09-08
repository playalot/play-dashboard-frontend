import Request from 'superagent'

export const TL_RECEIVE_TAG = 'TL_RECEIVE_TAG'
export const TL_RECEIVE_TAG_NEW = 'TL_RECEIVE_TAG_NEW'

export const TL_SET_CLASSIFICATION = 'TL_SET_CLASSIFICATION'
export const TL_REMOVE_CLASSIFICATION = 'TL_REMOVE_CLASSIFICATION'

export const TL_RECOMMEND_TAG = 'TL_RECOMMEND_TAG'
export const TL_DELETE_TAG = 'TL_DELETE_TAG'
export const TL_RECEIVE_SUGGESTION = 'TL_RECEIVE_SUGGESTION'
export const TL_CLEAR_SUGGESTION = 'TL_CLEAR_SUGGESTION'

function receiveTag(res) {
    return {
        type: TL_RECEIVE_TAG,
        res
    }
}
function receiveTagNew(res) {
    return {
        type: TL_RECEIVE_TAG_NEW,
        res
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
const status = {
    query: '',
    type: '',
    page:0,
    overload: false,
}
export const fetchTag = (query, type, newPage) => {
    if (query !== status.query || type !== status.type || newPage) {
        status.query = query
        status.type = type
        status.page = 0
        status.overload = true
    } else {
        status.overload = false
    }
    let params = {}
    params.page = status.page
    if (status.query !== '') {
        params.query = status.query
    }
    if (status.type !== '') {
        params.type = status.type
    }
    return function(dispatch) {
        return Request
            .get(`/api/tags`)
            .query(params)
            .end(function(err, res) {
                status.page = res.body.nextPage
                status.overload ? dispatch(receiveTagNew(res.body)) : dispatch(receiveTag(res.body))
            })
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
