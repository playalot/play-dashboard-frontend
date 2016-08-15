import Request from 'superagent'

export const PL_RECEIVE_POST = 'PL_RECEIVE_POST'
export const PL_RECEIVE_POST_NEW = 'PL_RECEIVE_POST_NEW'
export const PL_TOGGLE_RECOMMEND = 'PL_TOGGLE_RECOMMEND'
export const PL_TOGGLE_BLOCK = 'PL_TOGGLE_BLOCK'
export const PL_TOGGLE_R18 = 'PL_TOGGLE_R18'
export const PL_ADD_TAG = 'PL_ADD_TAG'
export const PL_REMOVE_TAG = 'PL_REMOVE_TAG'
export const PL_SET_CLASSIFICATION = 'PL_SET_CLASSIFICATION'
export const PL_REMOVE_CLASSIFICATION = 'PL_REMOVE_CLASSIFICATION'
export const PL_ADD_SKU = 'PL_ADD_SKU'
export const PL_DELETE_POST = 'PL_DELETE_POST'
export const PL_GET_UN_CLS = 'PL_GET_UN_CLS'

function receivePost(res) {
    return {
        type: PL_RECEIVE_POST,
        res
    }
}
function receivePostNew(res) {
    return {
        type: PL_RECEIVE_POST_NEW,
        res
    }
}
function _toggleRecommend(id) {
    return {
        type: PL_TOGGLE_RECOMMEND,
        id
    }
}
function _toggleBlock(id) {
    return {
        type: PL_TOGGLE_BLOCK,
        id
    }
}
function _toggleR18(id) {
    return {
        type: PL_TOGGLE_R18,
        id
    }
}
function _addTag(id, text) {
    return {
        type: PL_ADD_TAG,
        id,
        text
    }
}
function _removeTag(id, tid) {
    return {
        type: PL_REMOVE_TAG,
        id,
        tid
    }
}
function _setClassification(pid, cid) {
    return {
        type: PL_SET_CLASSIFICATION,
        pid,
        cid
    }
}
function _removeClassification(pid, c) {
    return {
        type: PL_REMOVE_CLASSIFICATION,
        pid,
        c
    }
}
function _addSku(id, sku) {
    return {
        type: PL_ADD_SKU,
        id,
        sku
    }
}
function _deletePost(id) {
    return {
        type: PL_DELETE_POST,
        id
    }
}
function _getUnCls() {
    return {
        type: PL_GET_UN_CLS,
    }
}
export const getUnCls = () => {
    return (dispatch) => {
        dispatch(_getUnCls())
    }
}
export const addTag = (id, text) => {
    return (dispatch, getState) => {
        return Request
            .post(`/api/post/${id}/tag/${text}`)
            .end(function(err, res) {
                dispatch(_addTag(id, res.body))
            })
    }
}
export const removeTag = (id, tid) => {
    return (dispatch, getState) => {
        return Request
            .del(`/api/post/${id}/tag/${tid}`)
            .end(function(err, res) {
                dispatch(_removeTag(id, tid))
            })
    }
}
export const toggleR18 = (id) => {
    return (dispatch, getState) => {
        let value = null
        let index = getState().postReducer.get('posts').findIndex((item) => {
            value = item.get('id') === id ? item.get('isR18') : null
            return item.get('id') === id
        })
        return Request
            .post(`/api/post/${id}/r18`)
            .send({
                r18: !value
            })
            .end(function(err, res) {
                dispatch(_toggleR18(id))
            })

    }
}
export const toggleBlock = (id) => {
    return (dispatch, getState) => {
        let value = null
        let index = getState().postReducer.get('posts').findIndex((item) => {
            value = item.get('id') === id ? item.get('isBlk') : null
            return item.get('id') === id
        })
        return Request
            .post(`/api/post/${id}/block`)
            .send({
                block: !value
            })
            .end(function(err, res) {
                dispatch(_toggleBlock(id))
            })

    }
}
export const toggleRecommend = (id) => {
    return function(dispatch, getState) {
        let value = null
        let index = getState().postReducer.get('posts').findIndex((item) => {
            value = item.get('id') === id ? item.get('isRec') : null
            return item.get('id') === id
        })
        return Request
            .post(`/api/post/${id}/recommend`)
            .send({
                recommend: !value
            })
            .end(function(err, res) {
                dispatch(_toggleRecommend(id))
            })
    }
}
export const setClassification = (pid, cid) => {
    return (dispatch, getState) => {
        return Request
            .post(`/api/post/${pid}/class/${cid}`)
            .end(function(err, res) {
                dispatch(_setClassification(pid, cid))
            })
    }
}
export const removeClassification = (pid, c) => {
    return (dispatch, getState) => {
        return Request
            .del(`/api/post/${pid}/class/${c}`)
            .end(function(err, res) {
                dispatch(_removeClassification(pid, c))
            })
    }
}
export const addSku = (id, sid) => {
    return (dispatch, getState) => {
        return Request
            .post(`/api/post/${id}/sku/${sid}`)
            .end(function(err, res) {
                dispatch(_addSku(id, res.body))
            })
    }
}
export const deletePost = (id) => {
    return (dispatch, getState) => {
        return Request
            .del(`/api/post/${id}`)
            .end(function(err, res) {
                dispatch(_deletePost(id))
            })
    }
}
const status = {
    filter: '',
    query: '',
    timestamp: '',
    overload: false,
}
export const fetchPost = (filter, query) => {

    if (query !== status.query || filter !== status.filter) {
        status.filter = filter
        status.query = query
        status.timestamp = ''
        status.overload = true
    } else {
        status.overload = false
    }
    let params = {}
    if (status.timestamp !== '' && status.timestamp !== null) {
        params.ts = status.timestamp
    }
    if (status.filter !== '') {
        params.filter = status.filter
    }
    if (status.query !== '') {
        params.query = status.query
    }
    return function(dispatch) {
        return Request
            .get(`/api/posts`)
            .query(params)
            .end(function(err, res) {
                status.timestamp = res.body.nextTs
                status.overload ? dispatch(receivePostNew(res.body)) : dispatch(receivePost(res.body))
            })
    }
}