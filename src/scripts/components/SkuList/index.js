import { connect } from 'react-redux'
import SkuList from './SkuList'
import { getSkuBy, getSku,deleteSku,addToyClass,removeToyClass } from '../../actions/skuAction'

import { fetchToyClass } from '../../actions/tagClassAction'
const mapActionCreators = {
	getSku,
	getSkuBy,
	deleteSku,

	fetchToyClass,
	addToyClass,
	removeToyClass,
}

const mapStateToProps = (state) => {
	const { skus,totalPages,page,merchant,type,query,orderBy,asc } = state.sku.toJS()
	const { toyClass, toyLoaded } = state.tagClassReducer.toJS()
	return {
		skus,
		totalPages,
		page,
		merchant,
		type,
		query,
		orderBy,
		asc,

		toyClass,
		toyLoaded,
	}
}

export default connect(mapStateToProps, mapActionCreators)(SkuList)
