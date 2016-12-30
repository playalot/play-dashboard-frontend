import Request from 'superagent'

export const RECEIVE_TAG_CLASS = 'RECEIVE_TAG_CLASS'
export const RECEIVE_TOY_CLASS = 'RECEIVE_TOY_CLASS'

function receiveTagClass(res) {
    return {
        type: RECEIVE_TAG_CLASS,
        res
    }
}

// function receiveToyClass(res) {
//     return {
//         type: RECEIVE_TOY_CLASS,
//         res
//     }
// }
export function fetchTagClass() {
    return function(dispatch) {
        return Request
            .get(`/api/classifications`)
            .end(function(err,res){
                dispatch(receiveTagClass(res.body.tags))
            })
    }
}

// export function fetchToyClass() {
//     return function(dispatch) {
//         return Request
//             .get(`/api/classifications`)
//             .end(function(err,res){
//                 dispatch(receiveToyClass(res.body.toys))
//             })
//     }
// }