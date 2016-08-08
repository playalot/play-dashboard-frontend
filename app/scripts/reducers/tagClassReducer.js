import Immutable from 'immutable'
import { RECEIVE_TAG_CLASS } from '../actions/tagClassAction'

export default (state = Immutable.Map({ loaded: false }),action)=>{
    switch (action.type) {
        case RECEIVE_TAG_CLASS:
            let classes = {}
            action.res.forEach((k,i) => {
                classes[k.id] = k
            })
            return state.mergeDeep({
                loaded: true,
                classifications: classes
            })
        default:
            return state
    }
}