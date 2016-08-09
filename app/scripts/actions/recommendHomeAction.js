import Request from 'superagent'

export const RECEIVE_HOMEADS = 'RECEIVE_HOMEADS'
export const DELETE_HOMEADS = 'DELETE_HOMEADS'

function receiveHomeads(res) {
    return {
        type: RECEIVE_HOMEADS,
        res
    }
}
function _deleteHomeAd(id) {
    return {
        type: DELETE_HOMEADS,
        id
    }
}

export const fetchHomeads = () => {
    return (dispatch) => {
        return Request
            .get(`/api/recommend/homeads`)
            .end(function(err,res){
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