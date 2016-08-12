import Request from 'superagent'

export const AL_RECEIVE_ARTICLE = 'AL_RECEIVE_ARTICLE'
export const AL_RECEIVE_ARTICLE_MORE = 'AL_RECEIVE_ARTICLE_MORE'

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

export function fetchArticle() {
    return (dispatch) => {
        return Request
            .get(`/api/articles`)
            .end((err,res) => {
                dispatch(receiveArticle(res.body.articles,res.body.nextTs))
            })
    }
}

export function fetchArticleMore() {
    return (dispatch,getState) => {
        let ts = getState().articleReducer.get('ts')
        return Request
            .get(`/api/articles`)
            .query({ts})
            .end((err,res) => {
                dispatch(receiveArticleMore(res.body.articles,res.body.nextTs))
            })
    }
}