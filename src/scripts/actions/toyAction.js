import Request from 'superagent'

export const TOL_RECEIVE_TOY = 'TOL_RECEIVE_TOY'
export const TOL_TOGGLE_R18 = 'TOL_TOGGLE_R18'
export const TOL_TOGGLE_RECOMMEND = 'TOL_TOGGLE_RECOMMEND'
export const TOL_DELETE_TOY = 'TOL_DELETE_TOY'
export const TOL_ADD_TOY = 'TOL_ADD_TOY'
export const TOY_RECEIVE_TOY_BY_QUERY = 'TOY_RECEIVE_TOY_BY_QUERY'
export const TOY_CLEAR_SUGGESTION = 'TOY_CLEAR_SUGGESTION'
export const TOY_ADD_TOY_CLASS = 'TOY_ADD_TOY_CLASS'
export const TOY_REMOVE_TOY_CLASS = 'TOY_REMOVE_TOY_CLASS'

function receiveToy(res,totalPages,page,filter,query,sort,year,month) {
    return {
        type: TOL_RECEIVE_TOY,
        res,
        totalPages,
        page,
        filter,
        query,
        sort,
        year,
        month
    }
}
function _toggleR18(id) {
    return {
        type: TOL_TOGGLE_R18,
        id,
    }
}
function _toggleRecommend(id) {
    return {
        type: TOL_TOGGLE_RECOMMEND,
        id
    }
}
function _deleteToy(id) {
    return {
        type: TOL_DELETE_TOY,
        id
    }
}
function _addToy(res) {
    res.cls = []
    return {
        type: TOL_ADD_TOY,
        res
    }
}
function receiveToyByQuery(res) {
    return {
        type: TOY_RECEIVE_TOY_BY_QUERY,
        res
    }
}
function _addToyClass(tid, c) {
    return {
        type: TOY_ADD_TOY_CLASS,
        tid,
        c
    }
}
function _removeToyClass(tid, c) {
    return {
        type: TOY_REMOVE_TOY_CLASS,
        tid,
        c
    }
}
export function clearSuggestion() {
    return {
        type: TOY_CLEAR_SUGGESTION
    }
}
export function toggleR18(id) {
    return (dispatch,getState) => {
        let value = null
        let index = getState().toyReducer.get('toys').findIndex((item) => {
            value = item.get('id') === id ? item.get('isR18') : null
            return item.get('id') === id
        })
        Request
            .post(`/api/toy/${id}/r18`)
            .send({
                r18: !value
            })
            .end((err,res) => {
                dispatch(_toggleR18(id))
            })
    }
}
export function toggleRecommend(id) {
    return (dispatch,getState) => {
        let value = null
        let index = getState().toyReducer.get('toys').findIndex((item) => {
            value = item.get('id') === id ? item.get('isRec') : null
            return item.get('id') === id
        })
        Request
            .post(`/api/toy/${id}/recommend`)
            .send({
                recommend: !value
            })
            .end((err,res) => {
                dispatch(_toggleRecommend(id))
            })
    }
}
export function deleteToy(id) {
    return (dispatch) => {
        Request
            .del(`/api/toy/${id}`)
            .end((err,res) => {
                dispatch(_deleteToy(id))
            })
    }
}
export function recommend(id) {
    return (dispatch) => {
        Request
            .post(`/api/recommend/home/${id}?type=toy`)
            .end((err,res) => {

            })
    }
}
export function addToy() {
    return (dispatch) => {
        Request
            .post(`/api/toy`)
            .end((err,res) => {
                dispatch(_addToy(res.body))
            })
    }
}

export function getToy (page = 0) {
    return (dispatch,getState) => {
        let params = { page }
        const { filter, query,sort,year,month } = getState().toyReducer.toJS()
        if(filter) {
            params.filter = filter
        }
        if(query) {
            params.query = query
        }
        if(sort) {
            params.sort = sort
        }
        if(year) {
            params.year = year
        }
        if(month) {
            params.month = month
        }
        return Request
            .get(`/api/toys`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveToy(res.body.toys,res.body.totalPages,page,filter,query,sort,year,month))
            })
    }
}

export function getToyBy (filter = '',query = '',sort = 'created',year,month) {
    return (dispatch,getState) => {
        let page = 0
        let params = { page }
        if(filter) {
            params.filter = filter
        }
        if(query) {
            params.query = query
        }
        if(sort) {
            params.sort = sort
        }
        if(year) {
            params.year = year
        }
        if(month) {
            params.month = month
        }
        return Request
            .get(`/api/toys`)
            .query(params)
            .end((err, res) => {
                dispatch(receiveToy(res.body.toys,res.body.totalPages,page,filter,query,sort,year,month))
            })
    }
}

export function fetchToyByQuery(query) {
    return (dispatch) => {
        return Request
            .get(`/api/toys`)
            .query({query})
            .end((err,res) => {
                dispatch(receiveToyByQuery(res.body.toys))
            })
    }
}

export const addToyClass = (tid, c) => {
    return (dispatch, getState) => {
        return Request
            .post(`/api/toy/${tid}/class/${c}`)
            .end((err, res) =>{
                dispatch(_addToyClass(tid, c))
            })
    }
}
export const removeToyClass = (tid, c) => {
    return (dispatch, getState) => {
        return Request
            .del(`/api/toy/${tid}/class/${c}`)
            .end((err, res) => {
                dispatch(_removeToyClass(tid, c))
            })
    }
}