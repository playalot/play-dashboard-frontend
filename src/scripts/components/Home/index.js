import { connect } from 'react-redux'
import Home from './Home'

import { fetchStats,getActivities } from '../../actions/statsAction'
const mapActionCreators = {
    fetchStats,
    getActivities,
}

const mapStateToProps = (state) => {
    const { stats, loaded,activities,page }  = state.stats.toJS()
    return {
        stats, loaded,activities,page
    }
}

export default connect(mapStateToProps, mapActionCreators)(Home)