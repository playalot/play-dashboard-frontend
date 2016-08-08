import Request from 'superagent'

export const REQUEST_TAG_CLASS = 'REQUEST_TAG_CLASS'
export const RECEIVE_TAG_CLASS = 'RECEIVE_TAG_CLASS'

function requestTagClass() {
    return {
        type: REQUEST_TAG_CLASS
    }
}

function receiveTagClass(res) {
    return {
        type: RECEIVE_TAG_CLASS,
        res
    }
}

export function fetchTagClass() {
    return function(dispatch) {
        dispatch(requestTagClass())
        return Request
            .get(`/api/classifications`)
            .end(function(err,res){
                dispatch(receiveTagClass(res.body))
            })
    }
}