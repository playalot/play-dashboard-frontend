import { connect } from 'react-redux'
import OrderUserList from './OrderUserList'

import { getOrderByUser, clearOrder } from '../../actions/orderAction'
const mapActionCreators = {
    getOrderByUser,
    clearOrder
}

const mapStateToProps = (state) => {
    return {
    }
}

export default connect(mapStateToProps, mapActionCreators)(OrderUserList)