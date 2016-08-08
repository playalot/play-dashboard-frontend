import Request from 'superagent'

export const UD_RECEIVE_INFO = 'UD_RECEIVE_INFO'
export const UD_RECEIVE_POST = 'UD_RECEIVE_POST'
export const UD_CLAER_POST = 'UD_CLAER_POST'
export const UD_DELETE_POST = 'UD_DELETE_POST'


export const UD_TOGGLE_RECOMMEND = 'UD_TOGGLE_RECOMMEND'
export const UD_TOGGLE_BLOCK = 'UD_TOGGLE_BLOCK'
export const UD_TOGGLE_R18 = 'UD_TOGGLE_R18'
export const UD_ADD_TAG = 'UD_ADD_TAG'
export const UD_REMOVE_TAG = 'UD_REMOVE_TAG'
export const UD_SET_CLASSIFICATION = 'UD_SET_CLASSIFICATION'
export const UD_REMOVE_CLASSIFICATION = 'UD_REMOVE_CLASSIFICATION'
export const UD_ADD_SKU = 'UD_ADD_SKU'

function receiveUserDetailInfo(res) {
    return {
        type: UD_RECEIVE_INFO,
        res
    }
}
function receiveUserDetailPost(res,ts) {
    return {
        type: UD_RECEIVE_POST,
        res,
        ts
    }
}
export function clearUserDetailPost() {
    return {
        type: UD_CLAER_POST
    }
}
export function fetchUserInfo(id) {
    return (dispatch) => {
        return Request
            .get(`/api/user/${id}`)
            .end(function(err,res){
                dispatch(receiveUserDetailInfo(res.body))
            })
    }
}
export  function fetchUserPost(id) {
    return (dispatch,getState) => {
        let ts = getState().userDetailReducer.getIn(['status','ts'])
        let params = {}
        if (ts !== '' && ts !== null) {
            params.ts = ts
        }
        return Request
            .get(`/api/user/${id}/posts`)
            .query(params)
            .end(function(err,res){
                dispatch(receiveUserDetailPost(res.body.posts,res.body.nextTs))
            })
    }
}

function _toggleRecommend(id) {
    return {
        type: UD_TOGGLE_RECOMMEND,
        id
    }
}
function _toggleBlock(id) {
    return {
        type: UD_TOGGLE_BLOCK,
        id
    }
}
function _toggleR18(id) {
    return {
        type: UD_TOGGLE_R18,
        id
    }
}
function _addTag(id,text) {
    return {
        type: UD_ADD_TAG,
        id,
        text
    }
}
function _removeTag(id,tid) {
    return {
        type: UD_REMOVE_TAG,
        id,
        tid
    }
}
function _setClassification(pid,cid) {
    return {
        type: UD_SET_CLASSIFICATION,
        pid,
        cid
    }
}
function _removeClassification(pid,c) {
    return {
        type: UD_REMOVE_CLASSIFICATION,
        pid,
        c
    }
}
function _addSku(id,sku) {
    return {
        type: UD_ADD_SKU,
        id,
        sku
    }
}
function _deletePost(id) {
    return {
        type: UD_DELETE_POST,
        id
    }
}
export const addTag = (id,text) => {
    return (dispatch,getState) => {
        return Request
            .post(`/api/post/${id}/tag/${text}`)
            .end(function(err,res){
                dispatch(_addTag(id,res.body))
            })
    }
}
export const removeTag = (id,tid) => {
    return (dispatch,getState) => {
        return Request
            .del(`/api/post/${id}/tag/${tid}`)
            .end(function(err,res){
                dispatch(_removeTag(id,tid))
            })
    }
}
export const toggleR18 = (id) => {
    return (dispatch,getState) => {
        let value  = null
        let index = getState().postReducer.get('posts').findIndex((item) => {
            value = item.get('id') === id ? item.get('isR18') : null
            return item.get('id') === id
        })
        return Request
            .post(`/api/post/${id}/r18`)
            .send({r18:!value})
            .end(function(err,res){
                dispatch(_toggleR18(id))
            })
        
    }
}
export const toggleBlock = (id) => {
    return (dispatch,getState) => {
        let value  = null
        let index = getState().userDetailReducer.get('posts').findIndex((item) => {
            value = item.get('id') === id ? item.get('isBlk') : null
            return item.get('id') === id
        })
        return Request
            .post(`/api/post/${id}/block`)
            .send({block:!value})
            .end(function(err,res){
                dispatch(_toggleBlock(id))
            })
        
    }
}
export const toggleRecommend = (id) => {
    return function(dispatch,getState) {
        let value  = null
        let index = getState().userDetailReducer.get('posts').findIndex((item) => {
            value = item.get('id') === id ? item.get('isRec') : null
            return item.get('id') === id
        })
        return Request
            .post(`/api/post/${id}/recommend`)
            .send({recommend:!value})
            .end(function(err,res){
                dispatch(_toggleRecommend(id))
            })
    }
}
export const setClassification = (pid,cid) => {
    return (dispatch,getState) => {
        return Request
            .post(`/api/post/${pid}/class/${cid}`)
            .end(function(err,res){
                dispatch(_setClassification(pid,cid))
            })
    }
}
export const removeClassification = (pid,c) => {
    return (dispatch,getState) => {
        return Request
            .del(`/api/post/${pid}/class/${c}`)
            .end(function(err,res){
                dispatch(_removeClassification(pid,c))
            })
    }
}
export const addSku = (id,sid) => {
    return (dispatch,getState) => {
        return Request
            .post(`/api/post/${id}/sku/${sid}`)
            .end(function(err,res){
                dispatch(_addSku(id,res.body))
            })
    }
}
export const deletePost = (id) => {
    return (dispatch,getState) => {
        return Request
            .del(`/api/post/${id}`)
            .end(function(err,res){
                dispatch(_deletePost(id))
            })
    }
}