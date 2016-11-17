import { connect } from 'react-redux'
import SkuList from './SkuList'
import { getSkuBy, getSku, toggleRec, toggleBlk,deleteSku } from '../../actions/skuAction'

import { fetchToyByQuery, clearSuggestion } from '../../actions/toyAction'
const mapActionCreators = {
	toggleRec,
	toggleBlk,
	getSku,
	getSkuBy,
	deleteSku,

	fetchToyByQuery,
	clearSuggestion,
}

const mapStateToProps = (state) => {
	const { skus,totalPages,page,filter } = state.sku.toJS()
	const { toyResults } = state.toyReducer.toJS()
	return {
		skus,
		totalPages,
		page,
		filter,

		toyResults
	}
}

export default connect(mapStateToProps, mapActionCreators)(SkuList)
