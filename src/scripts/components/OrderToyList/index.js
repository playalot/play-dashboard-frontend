import { connect } from 'react-redux'
import OrderToyList from './OrderToyList'

import { addTracking, setStatus, getOrder, startPay,getOrderByToy } from '../../actions/orderAction'
const mapActionCreators = {
    getOrderByToy,
}

const mapStateToProps = (state) => {
	const { toy } = state.order.toJS()
    return {
    	toy,
    }
}

export default connect(mapStateToProps, mapActionCreators)(OrderToyList)