import Request from 'superagent'

export const RECEIVE_TAG_CLASS = 'RECEIVE_TAG_CLASS'

function receiveTagClass(res) {
    return {
        type: RECEIVE_TAG_CLASS,
        res
    }
}

export function fetchTagClass() {
    return function(dispatch) {
        return Request
            .get(`/api/classifications`)
            .end(function(err,res){
                dispatch(receiveTagClass(res.body))
            })
    }
}