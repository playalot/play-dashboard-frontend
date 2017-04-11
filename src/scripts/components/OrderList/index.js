import { connect } from 'react-redux'
import OrderList from './OrderList'

import { addTracking, setStatus, getOrder, startPay,getOrderByToy } from '../../actions/orderAction'
import { setTouid } from '../../actions/adminAction'
const mapActionCreators = {
	addTracking,
	setStatus,
	getOrder,

    setTouid,

    startPay,
    getOrderByToy,
}

const mapStateToProps = (state) => {
	const { totalPages,page,status,merchant,init,year,month,summary } = state.order.toJS()
    return {
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