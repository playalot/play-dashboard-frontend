import { connect } from 'react-redux'
import SkuList from './SkuList'
import { fetchSku, toggleRec, toggleBlk } from '../../actions/skuAction'

const mapActionCreators = {
	fetchSku,
	toggleRec,
	toggleBlk,
}

const mapStateToProps = (state) => {
	const { skus } = state.sku.toJS()
	return {
		skus,
	}
}

export default connect(mapStateToProps, mapActionCreators)(SkuList)
