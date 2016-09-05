import Request from 'superagent'

export const AL_RECEIVE_ARTICLE = 'AL_RECEIVE_ARTICLE'
export const AL_RECEIVE_ARTICLE_MORE = 'AL_RECEIVE_ARTICLE_MORE'
export const AL_TOGGLE_PUB = 'AL_TOGGLE_PUB'
export const AL_DELETE_ARTICLE = 'AL_DELETE_ARTICLE'

function receiveArticle(res,ts) {
    return {
        type: AL_RECEIVE_ARTICLE,
        res,
        ts
    }
}
function receiveArticleMore(res,ts) {
    return {
        type: AL_RECEIVE_ARTICLE_MORE,
        res,
        ts
    }
}
function _togglePub(id) {
    return {
        type: AL_TOGGLE_PUB,
        id
    }
}
function _deleteArticle(id) {
    return {
        type: AL_DELETE_ARTICLE,
        id
    }
}
export function fetchArticle() {
    return (dispatch) => {
        return Request
            .get(`/api/pages`)
            .end((err,res) => {
                dispatch(receiveArticle(res.body.articles,res.body.nextTs))
            })
    }
}

export function fetchArticleMore() {
    return (dispatch,getState) => {
        let ts = getState().articleReducer.get('ts')
        return Request
            .get(`/api/pages`)
            .query({ts})
            .end((err,res) => {
                dispatch(receiveArticleMore(res.body.articles,res.body.nextTs))
            })
    }
}

export function togglePub(id) {
    return (dispatch,getState) => {
        let value = null
        let index = getState().articleReducer.get('articles').findIndex((item) => {
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

export function deleteArticle(id) {
    return (dispatch) => {
        Request
            .del(`/api/page/${id}`)
            .end((err,res) => {
                dispatch(_deleteArticle(id))
            })
    }
}