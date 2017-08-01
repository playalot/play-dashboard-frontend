import { connect } from 'react-redux'
import ExplorePage from './ExplorePage'

import { 
    fetchExplore,deleteBanner
} from '../../actions/exploreAction'
const mapActionCreators = {
    fetchExplore,
    deleteBanner,
}

const mapStateToProps = (state) => {
    const { banners, themes,drafts, toys }  = state.explore.toJS()
    return {
        banners,
        themes,
        drafts,
        toys,
    }
}

export default connect(mapStateToProps, mapActionCreators)(ExplorePage)