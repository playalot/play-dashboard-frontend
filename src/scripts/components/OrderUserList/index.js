import { connect } from 'react-redux'
import OrderUserList from './OrderUserList'

import { getOrderByUser } from '../../actions/orderAction'
const mapActionCreators = {
    getOrderByUser,
}

const mapStateToProps = (state) => {
    return {
    }
}

export default connect(mapStateToProps, mapActionCreators)(OrderUserList)