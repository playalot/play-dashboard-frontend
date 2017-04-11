import { connect } from 'react-redux'
import OrderList from './OrderList'

import { addTracking, setStatus, getOrder, startPay } from '../../actions/orderAction'
import { setTouid } from '../../actions/adminAction'
const mapActionCreators = {
	addTracking,
	setStatus,
	getOrder,

    setTouid,

    startPay,
}

const mapStateToProps = (state) => {
	const { orders,totalPages,page,status,merchant,init,year,month,summary } = state.order.toJS()
    return {
    	orders,
    	totalPages,
    	page,
    	status,
    	merchant,
        init,
        year,
        month,
        summary,
    }
}

export default connect(mapStateToProps, mapActionCreators)(OrderList)