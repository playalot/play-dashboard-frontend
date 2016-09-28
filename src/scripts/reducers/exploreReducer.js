import Immutable from 'immutable'
import { 
	EXPLORE_RECEIVE_THEME, EXPLORE_RECEIVE_THEME_MORE, EXPLORE_RECEIVE_BANNER, EXPLORE_SET_THEME_NO_MORE,
	EXPLORE_ADD_BANNER,
	EXPLORE_DELETE_BANNER, 
	EXPLORE_ADD_THEME,
	EXPLORE_DELETE_THEME
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
        case EXPLORE_RECEIVE_BANNER:
            return state.updateIn(['bannerList'],(bannerList) => {
            	return bannerList.clear().concat(Immutable.fromJS(action.res))
            }).setIn(['status','bannerLoaded'],true)
        case EXPLORE_ADD_BANNER:
        	return state.updateIn(['bannerList'],(bannerList) => {
        		return bannerList.unshift(Immutable.fromJS(action.res))
        	})
        case EXPLORE_DELETE_BANNER:
        	return state.updateIn(['bannerList'],(bannerList) => {
        		return bannerList.delete(bannerList.findKey((banner) => {
        			return banner.get('id') === action.id
        		}))
        	})
		case EXPLORE_RECEIVE_THEME:
            return state.updateIn(['themeList'],(themeList) => {
            	return themeList.clear().concat(Immutable.fromJS(action.res))
            }).setIn(['status','themeLoaded'],true).updateIn(['status','page'],(page) =>{
                return ++page
            })
        case EXPLORE_RECEIVE_THEME_MORE:
        	return state.updateIn(['themeList'],(themeList) => {
            	return themeList.concat(Immutable.fromJS(action.res))
            }).updateIn(['status','page'],(page) =>{
                return ++page
            })
        case EXPLORE_SET_THEME_NO_MORE:
            return state.setIn(['status','noMore'],action.flag)
        case EXPLORE_ADD_THEME:
        	return state.updateIn(['themeList'],(themeList) => {
        		return themeList.unshift(Immutable.fromJS(action.res))
        	})
        case EXPLORE_DELETE_THEME:
        	return state.updateIn(['themeList'],(themeList) => {
        		return themeList.delete(themeList.findKey((theme) => {
        			return theme.get('id') === action.id
        		}))
        	})
        default:
            return state
    }
}