import Request from 'superagent'

export const POST_RECEIVE_POST = 'POST_RECEIVE_POST'
export const POST_TOGGLE_RECOMMEND = 'POST_TOGGLE_RECOMMEND'
export const POST_TOGGLE_BLOCK = 'POST_TOGGLE_BLOCK'
export const POST_TOGGLE_R18 = 'POST_TOGGLE_R18'
export const POST_ADD_TAG = 'POST_ADD_TAG'
export const POST_REMOVE_TAG = 'POST_REMOVE_TAG'
export const POST_SET_CLASSIFICATION = 'POST_SET_CLASSIFICATION'
export const POST_REMOVE_CLASSIFICATION = 'POST_REMOVE_CLASSIFICATION'
export const POST_REMOVE_ALL_CLASSIFICATION = 'POST_REMOVE_ALL_CLASSIFICATION'
export const POST_ADD_TOY = 'POST_ADD_TOY'
export const POST_REMOVE_TOY = 'POST_REMOVE_TOY'
export const POST_DELETE_POST = 'POST_DELETE_POST'
export const POST_GET_UN_CLS = 'POST_GET_UN_CLS'

function receivePost(res,totalPages,page,filter,query) {
    return {
        type: POST_RECEIVE_POST,
        res,
        totalPages,
        page,
        filter,
        query
    }
}
function _toggleRecommend(id) {
    return {
        type: POST_TOGGLE_RECOMMEND,
        id
    }
}
function _toggleBlock(id) {
    return {
        type: POST_TOGGLE_BLOCK,
        id
    }
}
function _toggleR18(id) {
    return {
        type: POST_TOGGLE_R18,
        id
    }
}
function _addTag(id, text) {
    return {
        type: POST_ADD_TAG,
        id,
        text
    }
}
function _removeTag(id, tid) {
    return {
        type: POST_REMOVE_TAG,
        id,
        tid
    }
}
function _setClassification(pid, cid) {
    return {
        type: POST_SET_CLASSIFICATION,
        pid,
        cid
    }
}
function _removeClassification(pid, c) {
    return {
        type: POST_REMOVE_CLASSIFICATION,
        pid,
        c
    }
}
function _removeAllClassification(pid) {
    return {
        type: POST_REMOVE_ALL_CLASSIFICATION,
        pid
    }
}
function _addToy(id, toy) {
    return {
        type: POST_ADD_TOY,
        id,
        toy
    }
}
function _removeToy(id) {
    return {
        type: POST_REMOVE_TOY,
        id
    }
}
function _deletePost(id) {
    return {
        type: POST_DELETE_POST,
        id
    }
}
function _getUnCls() {
    return {
        type: POST_GET_UN_CLS,
    }
}
function _clearPost() {
    return {
        type: POST_CLEAR_POST
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
            .end((err, res) => {
                dispatch(_addTag(id, res.body))
            })
    }
}
export const removeTag = (id, tid) => {
    return (dispatch, getState) => {
        return Request
            .del(`/api/post/${id}/tag/${tid}`)
            .end((err, res) => {
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
            .end((err, res) => {
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
            .end((err, res) => {
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
            .end((err, res) => {
                dispatch(_toggleRecommend(id))
            })
    }
}
export const setClassification = (pid, cid) => {
    return (dispatch, getState) => {
        return Request
            .post(`/api/post/${pid}/class/${cid}`)
            .end((err, res) =>{
                dispatch(_setClassification(pid, cid))
            })
    }
}
export const removeClassification = (pid, c) => {
    return (dispatch, getState) => {
        return Request
            .del(`/api/post/${pid}/class/${c}`)
            .end((err, res) => {
                dispatch(_removeClassification(pid, c))
            })
    }
}
export const removeAllClassification = (pid) => {
    return (dispatch,getState) => {
        let cls = null
        getState().postReducer.get('posts').findIndex((item) => {
            cls = item.get('id') === pid ? item.get('cls') : null
            return item.get('id') === pid
        })
        Promise.all(cls.map((c) => {
            return Request.del(`/api/post/${pid}/class/${c}`)
        }))
        .then(() => {
            dispatch(_removeAllClassification(pid)) 
        })
    }
}
export const addToy = (id, sid) => {
    return (dispatch, getState) => {
        return Request
            .post(`/api/post/${id}/toy/${sid}`)
            .end((err, res) => {
                dispatch(_addToy(id, res.body))
            })
    }
}
export const removeToy = (id) => {
    return (dispatch) => {
        return Request
            .del(`/api/post/${id}/toy`)
            .end((err,res) => {
                dispatch(_removeToy(id))
            })
    }
}
export const deletePost = (id) => {
    return (dispatch, getState) => {
        return Request
            .del(`/api/post/${id}`)
            .end((err, res) => {
                dispatch(_deletePost(id))
            })
    }
}
export function getPost (page = 0) {
    return (dispatch,getState) => {
        let params = { page }
        const { filter, query } = getState().postReducer.toJS()
        if(filter) {
            params.filter = filter
        }
        if(query) {
            params.query = query
        }
        return Request
            .get(`/api/posts`)
            .query(params)
            .end((err, res) => {
                dispatch(receivePost(res.body.posts,res.body.totalPages,page,filter,query))
            })
    }
}

export function getPostBy (filter = '',query ='') {
    return (dispatch,getState) => {
        let page = 0
        let params = { page }
        if(filter) {
            params.filter = filter
        }
        if(query) {
            params.query = query
        }
        return Request
            .get(`/api/posts`)
            .query(params)
            .end((err, res) => {
                dispatch(receivePost(res.body.posts,res.body.totalPages,page,filter,query))
            })
    }
}


export function getUserPost (id) {
    return (dispatch,getState) => {
        return Request
            .get(`/api/user/${id}/posts`)
            .end((err, res) => {
                dispatch(receivePost(res.body.posts))
            })
    }
}