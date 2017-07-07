import { connect } from 'react-redux'
import PlayMainHeader from './PlayMainHeader'

import { fetchInfo } from '../../../actions/adminAction'
const mapActionCreators = {
    fetchInfo
}

const mapStateToProps = (state) => {
    const { user, loaded }  = state.admin.toJS()
    return {
        user, loaded
    }
}

export default connect(mapStateToProps, mapActionCreators)(PlayMainHeader)
