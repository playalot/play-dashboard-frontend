import { connect } from 'react-redux'
import EditPage from './EditPage'

const mapActionCreators = {
}
const mapStateToProps = (state) => {
    const { user }  = state.admin.toJS()
    return {
        user
    }
}

export default connect(mapStateToProps, mapActionCreators)(EditPage)