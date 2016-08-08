import Immutable from 'immutable'
import { REQUEST_TAG_CLASS, RECEIVE_TAG_CLASS } from '../actions/tagClassAction'

export default (state = Immutable.Map({ loading: true }),action)=>{
    switch (action.type) {
        case REQUEST_TAG_CLASS:
            return state.set('loading', true);
        case RECEIVE_TAG_CLASS:
            let classes = {}
            action.res.forEach((k,i) => {
                classes[k.id] = k
            })
            return state.mergeDeep({
                loading: false,
                classifications: classes
            })
        default:
            return state
    }
}