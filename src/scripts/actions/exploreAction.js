import Request from 'superagent'

export const EXPLORE_RECEIVE_DATA = 'EXPLORE_RECEIVE_DATA'
export const EXPLORE_DELETE_BANNER = 'EXPLORE_DELETE_BANNER'

export function fetchExplore() {
    return(dispatch) => {
        return Request
            .get(`/api/recommends`)
            .end((err,res) => {
                const { banners,themes,toys,drafts } = res.body
                dispatch({
                    type: EXPLORE_RECEIVE_DATA,
                    banners, themes, toys, drafts
                })
            })
    }
}

export function deleteBanner(id,target) {
    return (dispatch) => {
        return Request
            .del(`/api/recommend/${id}`)
            .end((err,res) => {
                dispatch({
                    type: EXPLORE_DELETE_BANNER,
                    id,target
                })
            })

    }
}
