import Request from 'superagent'

export const RH_RECEIVE_HOMEADS = 'RH_RECEIVE_HOMEADS'
export const RH_DELETE_HOMEAD = 'RH_DELETE_HOMEAD'

function receiveHomeads(res) {
    return {
        type: RH_RECEIVE_HOMEADS,
        res
    }
}
function _deleteHomeAd(id) {
    return {
        type: RH_DELETE_HOMEAD,
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