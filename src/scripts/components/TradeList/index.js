import { connect } from 'react-redux'
import TradeList from './TradeList'

import {getTrade} from '../../actions/tradeAction'
import { fetchToyClass } from '../../actions/tagClassAction'
const mapActionCreators = {
	getTrade,
	fetchToyClass
}

const mapStateToProps = (state) => {
	const { trades,page,totalPages } = state.trade.toJS()
	const { toyClass, toyLoaded } = state.tagClassReducer.toJS()
	return {
		trades,
		page,
		totalPages,

		toyClass,
		toyLoaded,
	}
}

export default connect(mapStateToProps, mapActionCreators)(TradeList)