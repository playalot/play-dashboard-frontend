import { connect } from 'react-redux'
import Home from './Home'

import { fetchStats } from '../../actions/statsAction'
const mapActionCreators = {
    fetchStats
}

const mapStateToProps = (state) => {
    const { stats, loaded }  = state.stats.toJS()
    return {
        stats, loaded
    }
}

export default connect(mapStateToProps, mapActionCreators)(Home)