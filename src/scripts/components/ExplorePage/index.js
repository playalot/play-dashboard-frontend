import { connect } from 'react-redux'
import ExplorePage from './ExplorePage'

import { 
	fetchBanner, addBanner, deleteBanner,
	fetchTheme, addTheme, deleteTheme, fetchThemeMore,
} from '../../actions/exploreAction'
const mapActionCreators = {
    fetchBanner,
    addBanner,
    deleteBanner,
    fetchTheme,
    fetchThemeMore,
    addTheme, 
    deleteTheme, 
}

const mapStateToProps = (state) => {
    const { bannerList, themeList }  = state.exploreReducer.toJS()
    const themeLoaded = state.exploreReducer.getIn(['status','themeLoaded'])
    const noMore = state.exploreReducer.getIn(['status','noMore'])
    const bannerLoaded = state.exploreReducer.getIn(['status','bannerLoaded'])
    return {
        bannerList,
        bannerLoaded,
        themeList,
        themeLoaded,
        noMore,
    }
}

export default connect(mapStateToProps, mapActionCreators)(ExplorePage)