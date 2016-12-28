import { connect } from 'react-redux'
import ExplorePage from './ExplorePage'

import { 
    fetchExplore,
    addBanner, deleteBanner,
    addTopic, addToy,
} from '../../actions/exploreAction'
const mapActionCreators = {
    fetchExplore,
    addBanner,
    addTopic, 
    addToy,
    deleteBanner,
}

const mapStateToProps = (state) => {
    const { banners, topics, toys, loaded }  = state.explore.toJS()
    return {
        banners,
        topics,
        toys,
        loaded,
    }
}

export default connect(mapStateToProps, mapActionCreators)(ExplorePage)