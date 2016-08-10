import { connect } from 'react-redux'
import ExplorePage from './ExplorePage'

import { 
	fetchBanner, addBanner, deleteBanner,
	fetchTheme, addTheme, deleteTheme 
} from '../../actions/exploreAction'
const mapActionCreators = {
    fetchBanner,
    addBanner,
    deleteBanner,
    fetchTheme,
    addTheme, 
    deleteTheme, 
}

const mapStateToProps = (state) => {
    const { bannerList, themeList }  = state.exploreReducer.toJS()
    return {
        bannerList,
        themeList
    }
}

export default connect(mapStateToProps, mapActionCreators)(ExplorePage)