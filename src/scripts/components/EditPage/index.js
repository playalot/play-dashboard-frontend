import { connect } from 'react-redux'
import EditPage from './EditPage'

import { setPageRaw } from '../../actions/pageAction'
const mapActionCreators = {
	setPageRaw
}
const mapStateToProps = (state) => {
    const { user }  = state.admin.toJS()
    return {
        user
    }
}

export default connect(mapStateToProps, mapActionCreators)(EditPage)