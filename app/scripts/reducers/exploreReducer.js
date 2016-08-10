import Immutable from 'immutable'
import { 
	RECEIVE_THEME, RECEIVE_THEME_MORE, RECEIVE_BANNER, 
	EP_ADD_BANNER,
	EP_DELETE_BANNER, 
	EP_ADD_THEME,
	EP_DELETE_THEME
} from '../actions/exploreAction'

export default (state = Immutable.fromJS({ themeList: [],bannerList:[] }),action)=>{
    switch (action.type) {
        case RECEIVE_BANNER:
            return state.updateIn(['bannerList'],(bannerList) => {
            	return bannerList.clear().concat(Immutable.fromJS(action.res))
            })
        case EP_ADD_BANNER:
        	return state.updateIn(['bannerList'],(bannerList) => {
        		return bannerList.unshift(Immutable.fromJS(action.res))
        	})
        case EP_DELETE_BANNER:
        	return state.updateIn(['bannerList'],(bannerList) => {
        		return bannerList.delete(bannerList.findKey((banner) => {
        			return banner.get('id') === action.id
        		}))
        	})
		case RECEIVE_THEME:
            return state.updateIn(['themeList'],(themeList) => {
            	return themeList.clear().concat(Immutable.fromJS(action.res))
            })
        case RECEIVE_THEME_MORE:
        	return state.updateIn(['themeList'],(themeList) => {
            	return themeList.concat(Immutable.fromJS(action.res))
            })
        case EP_ADD_THEME:
        	return state.updateIn(['themeList'],(themeList) => {
        		return themeList.unshift(Immutable.fromJS(action.res))
        	})
        case EP_DELETE_THEME:
        	return state.updateIn(['themeList'],(themeList) => {
        		return themeList.delete(themeList.findKey((theme) => {
        			return theme.get('id') === action.id
        		}))
        	})
        default:
            return state
    }
}