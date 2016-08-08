import { connect } from 'react-redux'
import Home from './Home'

import { fetchStats } from '../../actions/statsAction'
const mapActionCreators = {
    fetchStats
}

const mapStateToProps = (state) => {
    const { stats }  = state.statsReducer.toJS()
    return {
        stats
    }
}

export default connect(mapStateToProps, mapActionCreators)(Home)