import { connect } from 'react-redux'
import RecommendHome from './RecommendHome'

import { fetchHomeads, deleteHomeAd } from '../../actions/recommendHomeAction'
const mapActionCreators = {
    fetchHomeads,
    deleteHomeAd
}

const mapStateToProps = (state) => {
    const { homeads, loaded }  = state.recommendHomeReducer.toJS()
    return {
        homeads, loaded
    }
}

export default connect(mapStateToProps, mapActionCreators)(RecommendHome)