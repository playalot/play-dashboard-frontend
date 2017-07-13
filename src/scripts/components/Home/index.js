import { connect } from 'react-redux'
import Home from './Home'

import { fetchStats,getActivitiesC,getActivitiesO } from '../../actions/statsAction'
const mapActionCreators = {
    fetchStats,
    getActivitiesC,
    getActivitiesO
}

const mapStateToProps = (state) => {
    const { 
        stats, loaded,
        activitiesC,pageC,totalPagesC,
        activitiesO,pageO,totalPagesO

    }  = state.stats.toJS()
    return {
        stats, loaded,
        activitiesC,pageC,totalPagesC,
        activitiesO,pageO,totalPagesO
    }
}

export default connect(mapStateToProps, mapActionCreators)(Home)