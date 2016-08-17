import Immutable from 'immutable'
import { 
	EP_RECEIVE_THEME, EP_RECEIVE_THEME_MORE, EP_RECEIVE_BANNER, EP_SET_THEME_NO_MORE,
	EP_ADD_BANNER,
	EP_DELETE_BANNER, 
	EP_ADD_THEME,
	EP_DELETE_THEME
} from '../actions/exploreAction'

export default (state = Immutable.fromJS({ 
    themeList:[], bannerList:[],
    status:{
        noMore:false,
        page:0,
        themeLoaded:false,
        bannerLoaded:false,
    }
}),action) => {
    switch (action.type) {
        case EP_RECEIVE_BANNER:
            return state.updateIn(['bannerList'],(bannerList) => {
            	return bannerList.clear().concat(Immutable.fromJS(action.res))
            }).setIn(['status','bannerLoaded'],true)
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
		case EP_RECEIVE_THEME:
            return state.updateIn(['themeList'],(themeList) => {
            	return themeList.clear().concat(Immutable.fromJS(action.res))
            }).setIn(['status','themeLoaded'],true).updateIn(['status','page'],(page) =>{
                return ++page
            })
        case EP_RECEIVE_THEME_MORE:
        	return state.updateIn(['themeList'],(themeList) => {
            	return themeList.concat(Immutable.fromJS(action.res))
            }).updateIn(['status','page'],(page) =>{
                return ++page
            })
        case EP_SET_THEME_NO_MORE:
            return state.setIn(['status','noMore'],action.flag)
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