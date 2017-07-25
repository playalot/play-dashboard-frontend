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
	const { totalPages,page,status,merchant,year,month,summary,filter } = state.order.toJS()
    return {
    	totalPages,
    	page,
    	status,
    	merchant,
        year,
        month,
        summary,
        filter,
    }
}

export default connect(mapStateToProps, mapActionCreators)(OrderList)