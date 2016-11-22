import Request from 'superagent'
//info
export const UD_RECEIVE_INFO = 'UD_RECEIVE_INFO'
//page
export const UD_RECEIVE_PAGE = 'UD_RECEIVE_PAGE'
export const UD_PAGE_TOGGLE_PUB = 'UD_PAGE_TOGGLE_PUB'
export const UD_PAGE_TOGGLE_REC = 'UD_PAGE_TOGGLE_REC'
export const UD_PAGE_DELETE_PAGE = 'UD_PAGE_DELETE_PAGE'
export const UD_PAGE_SET_COVER_TYPE = 'UD_PAGE_SET_COVER_TYPE'
export const UD_RECEIVE_POST = 'UD_RECEIVE_POST'

//user
export const UD_USER_SET_ACTIVE = 'UD_USER_SET_ACTIVE'
//post
export const UD_SET_CLASSIFICATION = 'UD_SET_CLASSIFICATION'
export const UD_REMOVE_CLASSIFICATION = 'UD_REMOVE_CLASSIFICATION'
export const UD_POST_TOGGLE_RECOMMEND = 'UD_POST_TOGGLE_RECOMMEND'
export const UD_POST_TOGGLE_BLOCK = 'UD_POST_TOGGLE_BLOCK'
export const UD_POST_TOGGLE_R18 = 'UD_POST_TOGGLE_R18'
export const UD_POST_ADD_TAG = 'UD_POST_ADD_TAG'
export const UD_POST_REMOVE_TAG = 'UD_POST_REMOVE_TAG'
export const UD_POST_ADD_TOY = 'UD_POST_ADD_TOY'
export const UD_POST_REMOVE_TOY = 'UD_POST_REMOVE_TOY'
export const UD_POST_DELETE_POST = 'UD_POST_DELETE_POST'

//info
export function fetchUserInfo(id) {
    return (dispatch) => {
        return Request
            .get(`/api/user/${id}`)
            .end((err,res) => {
                dispatch(receiveUserInfo(res.body))
            })
    }
}
function receiveUserInfo(res) {
    return {
        type: UD_RECEIVE_INFO,
        res
    }
}

//user
export function setActive(id) {
    return (dispatch,getState) => {
        let act = getState().userDetail.getIn(['user','isActive'])
        return Request
            .post(`/api/user/${id}/active`)
            .send({
                active:!act
            })
            .end((err,res) => {
                dispatch(_setActive())
            })
    }
}
function _setActive() {
    return {
        type: UD_USER_SET_ACTIVE
    }
}

//page
export function togglePub(id) {
    return (dispatch,getState) => {
        let value = null
        let index = getState().userDetail.get('pages').findIndex((item) => {
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
        let index = getState().userDetail.get('pages').findIndex((item) => {
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
export function deletePage(id) {
    return (dispatch) => {
        Request
            .del(`/api/page/${id}`)
            .end((err,res) => {
                dispatch(_deletePage(id))
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
export function fetchUserPage(id) {
    return (dispatch) => {
        return Request
            .get(`/api/user/${id}/pages`)
            .end((err,res) => {
                dispatch(receiveUserPage(res.body.pages))
            })
    }
}
function _togglePub(id) {
    return {
        type: UD_PAGE_TOGGLE_PUB,
        id
    }
}
function _toggleRec(id) {
    return {
        type: UD_PAGE_TOGGLE_REC,
        id
    }
}
function _deletePage(id) {
    return {
        type: UD_PAGE_DELETE_PAGE,
        id
    }
}
function _setCoverType(val,id) {
    return {
        type: UD_PAGE_SET_COVER_TYPE,
        val,
        id
    }
}
function receiveUserPage(res) {
    return {
        type: UD_RECEIVE_PAGE,
        res
    }
}

//post
export function getUserPost(id,page = 0) {
    return (dispatch,getState) => {
        let params = { page }
        return Request
            .get(`/api/user/${id}/posts`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveUserPost(res.body.posts,res.body.totalPages,page))
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
export const deletePost = (id) => {
    return (dispatch, getState) => {
        return Request
            .del(`/api/post/${id}`)
            .end((err, res) => {
                dispatch(_deletePost(id))
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
        let index = getState().userDetail.get('posts').findIndex((item) => {
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
        let index = getState().userDetail.get('posts').findIndex((item) => {
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
        let index = getState().userDetail.get('posts').findIndex((item) => {
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
function receiveUserPost(res,totalPages,page) {
    return {
        type: UD_RECEIVE_POST,
        res,
        totalPages,
        page
    }
}
function _setClassification(pid, cid) {
    return {
        type: UD_SET_CLASSIFICATION,
        pid,
        cid
    }
}
function _removeClassification(pid, c) {
    return {
        type: UD_REMOVE_CLASSIFICATION,
        pid,
        c
    }
}
function _deletePost(id) {
    return {
        type: UD_POST_DELETE_POST,
        id
    }
}
function _addToy(id, toy) {
    return {
        type: UD_POST_ADD_TOY,
        id,
        toy
    }
}
function _removeToy(id) {
    return {
        type: UD_POST_REMOVE_TOY,
        id
    }
}
function _addTag(id, text) {
    return {
        type: UD_POST_ADD_TAG,
        id,
        text
    }
}
function _removeTag(id, tid) {
    return {
        type: UD_POST_REMOVE_TAG,
        id,
        tid
    }
}
function _toggleRecommend(id) {
    return {
        type: UD_POST_TOGGLE_RECOMMEND,
        id
    }
}
function _toggleBlock(id) {
    return {
        type: UD_POST_TOGGLE_BLOCK,
        id
    }
}
function _toggleR18(id) {
    return {
        type: UD_POST_TOGGLE_R18,
        id
    }
}
