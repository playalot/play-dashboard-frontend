import Request from 'superagent'

export const POST_TOGGLE_RECOMMEND = 'POST_TOGGLE_RECOMMEND'
export const POST_TOGGLE_BLOCK = 'POST_TOGGLE_BLOCK'
export const POST_TOGGLE_R18 = 'POST_TOGGLE_R18'
export const POST_ADD_TAG = 'POST_ADD_TAG'
export const POST_REMOVE_TAG = 'POST_REMOVE_TAG'
export const POST_ADD_TOY = 'POST_ADD_TOY'
export const POST_REMOVE_TOY = 'POST_REMOVE_TOY'
export const POST_CLEAR_POST = 'POST_CLEAR_POST'
export const POST_GET_UN_CLS = 'POST_GET_UN_CLS'
export const POST_GET_VIDEO = 'POST_GET_VIDEO'
export const POST_SET_CLASSIFICATION = 'POST_SET_CLASSIFICATION'
export const POST_REMOVE_CLASSIFICATION = 'POST_REMOVE_CLASSIFICATION'
export const POST_REMOVE_ALL_CLASSIFICATION = 'POST_REMOVE_ALL_CLASSIFICATION'


export const POST_RECEIVE_POST = 'POST_RECEIVE_POST'
export const POST_DELETE_POST = 'POST_DELETE_POST'

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

export const getUnCls = () => {
    return {
        type: POST_GET_UN_CLS,
    }
}
export const getVideoPost = () => {
    return {
        type:POST_GET_VIDEO
    }
}
export const addTag = (id, text) => {
    return (dispatch, getState) => {
        return Request
            .post(`/api/post/${id}/tag/${text}`)
            .end((err, res) => {
                dispatch({type:POST_ADD_TAG,id,text:res.body})
            })
    }
}
export const removeTag = (id, tid) => {
    return (dispatch, getState) => {
        return Request
            .del(`/api/post/${id}/tag/${tid}`)
            .end((err, res) => {
                dispatch({type: POST_REMOVE_TAG,id,tid})
            })
    }
}
export const toggleR18 = (id,r18) => {
    return (dispatch, getState) => {
        return Request
            .post(`/api/post/${id}/r18`)
            .send({ r18 })
            .end(() => {
                dispatch({type: POST_TOGGLE_R18,id})
            })
    }
}
export const toggleBlock = (id,block) => {
    return (dispatch, getState) => {
        return Request
            .post(`/api/post/${id}/block`)
            .send({ block })
            .end((err, res) => {
                dispatch({type: POST_TOGGLE_BLOCK,id})
            })
    }
}
export const toggleRecommend = (id,recommend) => {
    return function(dispatch, getState) {
        return Request
            .post(`/api/post/${id}/recommend`)
            .send({ recommend })
            .end((err, res) => {
                dispatch({type:POST_TOGGLE_RECOMMEND,id})
            })
    }
}
export const setClassification = (pid, cid) => {
    return (dispatch, getState) => {
        return Request
            .post(`/api/post/${pid}/class/${cid}`)
            .end((err, res) =>{
                dispatch({type:POST_SET_CLASSIFICATION,pid,cid})
            })
    }
}
export const removeClassification = (pid, c) => {
    return (dispatch, getState) => {
        return Request
            .del(`/api/post/${pid}/class/${c}`)
            .end((err, res) => {
                dispatch({type:POST_REMOVE_CLASSIFICATION,pid,c})
            })
    }
}
export const removeAllClassification = (pid,cls = []) => {
    return (dispatch,getState) => {
        Promise.all(cls.map((c) => {
            return Request.del(`/api/post/${pid}/class/${c}`)
        }))
        .then(() => {
            dispatch({type:POST_REMOVE_ALL_CLASSIFICATION,pid})
        })
    }
}
export const addToy = (id, sid) => {
    return (dispatch, getState) => {
        return Request
            .post(`/api/post/${id}/toy/${sid}`)
            .end((err, res) => {
                dispatch({type:POST_ADD_TOY,id,toy:res.body})
            })
    }
}
export const removeToy = (id) => {
    return (dispatch) => {
        return Request
            .del(`/api/post/${id}/toy`)
            .end((err,res) => {
                dispatch({type:POST_REMOVE_TOY,id})
            })
    }
}
export const deletePost = (id) => {
    return (dispatch, getState) => {
        return Request
            .del(`/api/post/${id}`)
            .end((err, res) => {
                dispatch({type:POST_DELETE_POST,id})
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


export function getUserPost (id,page = 0) {
    return (dispatch,getState) => {
        let params = { page }
        return Request
            .get(`/api/user/${id}/posts`)
            .query(params)
            .end((err, res) => {
                dispatch(receivePost(res.body.posts,res.body.totalPages))
            })
    }
}

export function clearPost() {
    return {
        type:POST_CLEAR_POST
    }
}