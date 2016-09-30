import { connect } from 'react-redux'
import SkuList from './SkuList'
import { fetchSku, toggleRec, toggleBlk, setStock } from '../../actions/skuAction'

const mapActionCreators = {
	fetchSku,
	toggleRec,
	toggleBlk,
	setStock,
}

const mapStateToProps = (state) => {
	const { skus } = state.sku.toJS()
	return {
		skus,
	}
}

export default connect(mapStateToProps, mapActionCreators)(SkuList)
