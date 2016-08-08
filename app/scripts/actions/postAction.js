import Request from 'superagent'

export const RECEIVE_POST = 'RECEIVE_POST'
export const RECEIVE_POST_NEW = 'RECEIVE_POST_NEW'
export const TOGGLE_RECOMMEND_POST = 'TOGGLE_RECOMMEND_POST'
export const TOGGLE_BLOCK_POST = 'TOGGLE_BLOCK_POST'
export const TOGGLE_R18_POST = 'TOGGLE_R18_POST'
export const ADD_TAG_POST = 'ADD_TAG_POST'
export const REMOVE_TAG_POST = 'REMOVE_TAG_POST'
export const SET_POST_CLASSIFICATION = 'SET_POST_CLASSIFICATION'
export const REMOVE_POST_CLASSIFICATION = 'REMOVE_POST_CLASSIFICATION'
export const ADD_SKU_POST = 'ADD_SKU_POST'
export const DELETE_POST = 'DELETE_POST'

function receivePost(res) {
    return {
        type: RECEIVE_POST,
        res
    }
}
function receivePostNew(res) {
    return {
        type: RECEIVE_POST_NEW,
        res
    }
}
function toggleRecommend(id) {
    return {
        type: TOGGLE_RECOMMEND_POST,
        id
    }
}
function toggleBlock(id) {
    return {
        type: TOGGLE_BLOCK_POST,
        id
    }
}
function toggleR18(id) {
    return {
        type: TOGGLE_R18_POST,
        id
    }
}
function addTag(id,text) {
    return {
        type: ADD_TAG_POST,
        id,
        text
    }
}
function removeTag(id,tid) {
    return {
        type: REMOVE_TAG_POST,
        id,
        tid
    }
}
function setPostClasses(pid,cid) {
    return {
        type: SET_POST_CLASSIFICATION,
        pid,
        cid
    }
}
function removePostClasses(pid,c) {
    return {
        type: REMOVE_POST_CLASSIFICATION,
        pid,
        c
    }
}
function addSku(id,sku) {
    return {
        type: ADD_SKU_POST,
        id,
        sku
    }
}
function removePost(id) {
    return {
        type: DELETE_POST,
        id
    }
}
export const addTagPost = (id,text) => {
    return (dispatch,getState) => {
        return Request
            .post(`/api/post/${id}/tag/${text}`)
            .end(function(err,res){
                dispatch(addTag(id,res.body))
            })
    }
}
export const removeTagPost = (id,tid) => {
    return (dispatch,getState) => {
        return Request
            .del(`/api/post/${id}/tag/${tid}`)
            .end(function(err,res){
                dispatch(removeTag(id,tid))
            })
    }
}
export const toggleR18Post = (id) => {
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
                dispatch(toggleR18(id))
            })
        
    }
}
export const toggleBlockPost = (id) => {
    return (dispatch,getState) => {
        let value  = null
        let index = getState().postReducer.get('posts').findIndex((item) => {
            value = item.get('id') === id ? item.get('isBlk') : null
            return item.get('id') === id
        })
        return Request
            .post(`/api/post/${id}/block`)
            .send({block:!value})
            .end(function(err,res){
                dispatch(toggleBlock(id))
            })
        
    }
}
export const toggleRecommendPost = (id) => {
    return function(dispatch,getState) {
        let value  = null
        let index = getState().postReducer.get('posts').findIndex((item) => {
            value = item.get('id') === id ? item.get('isRec') : null
            return item.get('id') === id
        })
        return Request
            .post(`/api/post/${id}/recommend`)
            .send({recommend:!value})
            .end(function(err,res){
                dispatch(toggleRecommend(id))
            })
    }
}
export const setPostClassification = (pid,cid) => {
    return (dispatch,getState) => {
        return Request
            .post(`/api/post/${pid}/class/${cid}`)
            .end(function(err,res){
                dispatch(setPostClasses(pid,cid))
            })
    }
}
export const removePostClassification = (pid,c) => {
    return (dispatch,getState) => {
        return Request
            .del(`/api/post/${pid}/class/${c}`)
            .end(function(err,res){
                dispatch(removePostClasses(pid,c))
            })
    }
}
export const addSkuPost = (id,sid) => {
    return (dispatch,getState) => {
        return Request
            .post(`/api/post/${id}/sku/${sid}`)
            .end(function(err,res){
                dispatch(addSku(id,res.body))
            })
    }
}
export const deletePost = (id) => {
    return (dispatch,getState) => {
        return Request
            .del(`/api/post/${id}`)
            .end(function(err,res){
                dispatch(removePost(id))
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
    }else{
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
            .end(function(err,res){
                status.timestamp = res.body.nextTs
                status.overload ? dispatch(receivePostNew(res.body)) : dispatch(receivePost(res.body))
            })
    }
}