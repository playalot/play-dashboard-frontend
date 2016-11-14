import { connect } from 'react-redux'
import OrderDetail from './OrderDetail'

import { fetchOrder, addTracking ,fetchOrderDetail} from '../../actions/orderAction'
const mapActionCreators = {
	fetchOrder,addTracking, fetchOrderDetail
}

const mapStateToProps = (state) => {
	const { loaded,orders,order } = state.order.toJS()
    return {
    	orders,
    	loaded,
    	order,
    }
}

export default connect(mapStateToProps, mapActionCreators)(OrderDetail)