import { connect } from 'react-redux'
import SkuList from './SkuList'
import { getSkuBy, getSku, toggleRec, toggleBlk,deleteSku,addToyClass,removeToyClass } from '../../actions/skuAction'

import { fetchToyClass } from '../../actions/tagClassAction'
import { fetchToyByQuery, clearSuggestion } from '../../actions/toyAction'
const mapActionCreators = {
	toggleRec,
	toggleBlk,
	getSku,
	getSkuBy,
	deleteSku,

	fetchToyByQuery,
	clearSuggestion,

	fetchToyClass,
	addToyClass,
	removeToyClass,
}

const mapStateToProps = (state) => {
	const { skus,totalPages,page,filter,filterType,query } = state.sku.toJS()
	const { toyResults } = state.toyReducer.toJS()
	const { toyClass, toyLoaded } = state.tagClassReducer.toJS()
	return {
		skus,
		totalPages,
		page,
		filter,
		filterType,
		query,

		toyResults,

		toyClass,
		toyLoaded,
	}
}

export default connect(mapStateToProps, mapActionCreators)(SkuList)
