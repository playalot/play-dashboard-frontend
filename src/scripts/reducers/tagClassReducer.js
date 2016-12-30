import Immutable from 'immutable'
import { RECEIVE_TAG_CLASS,RECEIVE_TOY_CLASS } from '../actions/tagClassAction'

export default (state = Immutable.fromJS({classifications:[], loaded: false,toyClass:[],toyLoaded:false }),action)=>{
    switch (action.type) {
        case RECEIVE_TAG_CLASS:
            let classes = {}
            action.res.forEach((k,i) => {
                classes[k.id] = k
            })
            return state.set('classifications',classes).set('loaded',true)
        case RECEIVE_TOY_CLASS:
            let toyClass = {}
            action.res.forEach((k,i) => {
                toyClass[k.id] = k
            })
            return state.set('toyClass',toyClass).set('toyLoaded',true)
        default:
            return state
    }
}