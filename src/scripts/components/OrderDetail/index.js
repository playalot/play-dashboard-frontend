import { connect } from 'react-redux'
import OrderDetail from './OrderDetail'

import { addTracking } from '../../actions/orderAction'
const mapActionCreators = {
	addTracking
}

const mapStateToProps = (state) => {
	const { } = state.order.toJS()
    return {
    }
}

export default connect(mapStateToProps, mapActionCreators)(OrderDetail)