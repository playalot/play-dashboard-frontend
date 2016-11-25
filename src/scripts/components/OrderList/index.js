import { connect } from 'react-redux'
import OrderList from './OrderList'

import { addTracking, setStatus, getOrder, getOrderBy } from '../../actions/orderAction'
const mapActionCreators = {
	addTracking,
	setStatus,
	getOrder,
	getOrderBy,
}

const mapStateToProps = (state) => {
	const { orders,totalPages,page,status,merchant } = state.order.toJS()
    return {
    	orders,
    	totalPages,
    	page,
    	status,
    	merchant
    }
}

export default connect(mapStateToProps, mapActionCreators)(OrderList)