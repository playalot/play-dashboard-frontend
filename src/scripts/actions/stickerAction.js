import Request from 'superagent'

export const STL_RECEIVE_SET = 'STL_RECEIVE_SET'
export const STL_ADD_STICKER_SET = 'STL_ADD_STICKER_SET'
export const STL_UP_STICKER_SET = 'STL_UP_STICKER_SET'
export const STL_UP_STICKER = 'STL_UP_STICKER'
export const STL_DELETE_STICKER = 'STL_DELETE_STICKER'

function receiveSet(res) {
    return {
        type: STL_RECEIVE_SET,
        res
    }
}
function _addStickerSet(res) {
    return {
        type: STL_ADD_STICKER_SET,
        res
    }
}
function _riseStickerSet(id) {
    return {
        type: STL_UP_STICKER_SET,
        id
    }
}
function _riseSticker(id,sid) {
    return {
        type : STL_UP_STICKER,
        id,
        sid
    }
}
function _deleteSticker(id,sid) {
    return {
        type: STL_DELETE_STICKER,
        id,
        sid
    }
}
export function fetchSets() {
    return (dispatch) => {
        return Request
            .get(`/api/stickers`)
            .end((err,res) => {
                dispatch(receiveSet(res.body.sets))
            })
    }
}

export function addStickerSet() {
    return (dispatch) => {
        return Request
            .post(`/api/sticker/set`)
            .end((err,res) => {
                dispatch(_addStickerSet(res.body))
            })
    }
}
export function riseStickerSet(id) {
    return (dispatch) => {
        return Request
            .post(`/api/stickerset/${id}/up`)
            .end((err,res) => {
                dispatch(_riseStickerSet(id))
            })
    }
}
export function riseSticker(id,sid) {
    return (dispatch) => {
        return Request
            .post(`/api/sticker/${sid}/up`)
            .end((err,res) => {
                dispatch(_riseSticker(id,sid))
            })
    }
}

export function deleteSticker(id,sid) {
    return (dispatch) => {
        return Request
            .del(`/api/sticker/${sid}`)
            .end((err,res) => {
                dispatch(_deleteSticker(id,sid))
            })
    }
}