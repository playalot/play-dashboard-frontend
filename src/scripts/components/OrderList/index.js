import { connect } from 'react-redux'
import OrderList from './OrderList'

import { fetchOrder, addTracking } from '../../actions/orderAction'
const mapActionCreators = {
	fetchOrder,
	addTracking,
}

const mapStateToProps = (state) => {
	const { orders,loaded } = state.order.toJS()
    return {
    	orders,
    	loaded,
    }
}

export default connect(mapStateToProps, mapActionCreators)(OrderList)