import Request from 'superagent'

export const REC_HOME_RECEIVE_HOMEADS = 'REC_HOME_RECEIVE_HOMEADS'
export const REC_HOME_DELETE_HOMEAD = 'REC_HOME_DELETE_HOMEAD'

function receiveHomeads(res) {
    return {
        type: REC_HOME_RECEIVE_HOMEADS,
        res
    }
}
function _deleteHomeAd(id) {
    return {
        type: REC_HOME_DELETE_HOMEAD,
        id
    }
}

export const fetchHomeads = () => {
    return (dispatch) => {
        return Request
            .get(`/api/recommend/homeads`)
            .end((err,res) => {
                dispatch(receiveHomeads(res.body.items))
            })
    }
}
export const deleteHomeAd = (id) => {
    return (dispatch) => {
        return Request
            .del(`/api/recommend/${id}`)
            .end((err, res) => {
                dispatch(_deleteHomeAd(id))
            })
    }
}