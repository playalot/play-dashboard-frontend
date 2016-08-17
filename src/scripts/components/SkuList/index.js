import { connect } from 'react-redux'
import SkuList from './SkuList'
import { fetchSku, recommend, toggleR18, toggleRecommend, deleteSku, addSku } from '../../actions/skuAction'

const mapActionCreators = {
	fetchSku,
	recommend,
	toggleR18,
	toggleRecommend,
	deleteSku,
	addSku,
}

const mapStateToProps = (state) => {
	const { skus } = state.skuReducer.toJS()
	const loaded = state.skuReducer.get('loaded')
	return {
		skus,
		loaded
	}
}

export default connect(mapStateToProps, mapActionCreators)(SkuList)