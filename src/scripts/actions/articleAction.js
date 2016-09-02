import Request from 'superagent'

export const AL_RECEIVE_ARTICLE = 'AL_RECEIVE_ARTICLE'
export const AL_RECEIVE_ARTICLE_MORE = 'AL_RECEIVE_ARTICLE_MORE'
export const AL_TOGGLE_PUB = 'AL_TOGGLE_PUB'

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
    return (dispatch) => {
        dispatch(_togglePub(id))
    }
}