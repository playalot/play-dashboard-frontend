import { connect } from 'react-redux'
import EditRecommend from './EditRecommend'
import { fetchSkuByQuery, clearSuggestion } from '../../actions/skuAction'

const mapActionCreators = {
	fetchSkuByQuery,
	clearSuggestion,
}

const mapStateToProps = (state) => {
	const { skuResults } = state.sku.toJS()
    return {
    	skuResults,
    }
}

export default connect(mapStateToProps, mapActionCreators)(EditRecommend)