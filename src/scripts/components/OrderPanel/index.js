import { connect } from 'react-redux'
import OrderPanel from './OrderPanel'

import { addTracking, setStatus, startPay } from '../../actions/orderAction'
import { setTouid } from '../../actions/adminAction'
const mapActionCreators = {
	addTracking,
	setStatus,
    startPay,

    setTouid,
}

const mapStateToProps = (state) => {
	const { orders } = state.order.toJS()
    return {
    	orders,
    }
}

export default connect(mapStateToProps, mapActionCreators)(OrderPanel)