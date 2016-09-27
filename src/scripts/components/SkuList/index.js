import { connect } from 'react-redux'
import SkuList from './SkuList'
import { fetchSku } from '../../actions/skuAction'

const mapActionCreators = {
	fetchSku
}

const mapStateToProps = (state) => {
	const { skus } = state.skuReducer.toJS()
	return {
		skus,
	}
}

export default connect(mapStateToProps, mapActionCreators)(SkuList)
