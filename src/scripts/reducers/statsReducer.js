import Immutable from 'immutable'
import { HOME_RECEIVE_STATS,HOME_RECEIVE_ACTIVITIES_O,HOME_RECEIVE_ACTIVITIES_C } from '../actions/statsAction'

export default (state = Immutable.fromJS({ 
    stats: {}, loaded:false,
    activitiesC:[],activitiesO:[],
    pageC:0,pageO:0,
    totalPagesC:10,totalPagesO:10, 
}),action)=>{
    switch (action.type) {
        case HOME_RECEIVE_STATS:
            return state.mergeDeep({
                stats: action.res,
                loaded:true
            })
        case HOME_RECEIVE_ACTIVITIES_C:
        	return state
                .updateIn(['activitiesC'], (activities) => activities.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPagesC',action.totalPages)
                .set('pageC',action.page)
        case HOME_RECEIVE_ACTIVITIES_O:
        	return state
                .updateIn(['activitiesO'], (activities) => activities.clear().concat(Immutable.fromJS(action.res)))
                .set('totalPagesO',action.totalPages)
                .set('pageO',action.page)
        
        default:
            return state
    }
}