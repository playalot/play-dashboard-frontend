import { connect } from 'react-redux'
import OrderDetail from './OrderDetail'

import { fetchOrder} from '../../actions/orderAction'
const mapActionCreators = {
	fetchOrder
}

const mapStateToProps = (state) => {
	const { loaded,orders } = state.order.toJS()
    return {
    	orders,
    	loaded
    }
}

export default connect(mapStateToProps, mapActionCreators)(OrderDetail)