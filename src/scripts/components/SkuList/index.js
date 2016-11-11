import { connect } from 'react-redux'
import SkuList from './SkuList'
import { getSkuBy, getSku, toggleRec, toggleBlk,deleteSku } from '../../actions/skuAction'

const mapActionCreators = {
	toggleRec,
	toggleBlk,
	getSku,
	getSkuBy,
	deleteSku,
}

const mapStateToProps = (state) => {
	const { skus,totalPages,page,filter } = state.sku.toJS()
	return {
		skus,
		totalPages,
		page,
		filter
	}
}

export default connect(mapStateToProps, mapActionCreators)(SkuList)
