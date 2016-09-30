import { connect } from 'react-redux'
import EditSku from './EditSku'

const mapActionCreators = {
}

const mapStateToProps = (state) => {
    const { stock }  = state.sku.toJS()
    return {
        stock,
    }
}

export default connect(mapStateToProps, mapActionCreators)(EditSku)