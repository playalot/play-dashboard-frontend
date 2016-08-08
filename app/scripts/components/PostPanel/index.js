import { connect } from 'react-redux'
import PostPanel from './PostPanel'

import { 
	toggleRecommendPost, 
	addTagPost, 
	removeTagPost, 
	toggleBlockPost, 
	toggleR18Post,
	addSkuPost, 
	deletePost,
} from '../../actions/postAction'

const mapActionCreators ={
	toggleRecommendPost,
	toggleBlockPost,
	toggleR18Post,
	addTagPost,
	removeTagPost,
	addSkuPost,
	deletePost,
}

const mapStateToProps = (state) => {
	const { classifications } = state.tagClassReducer.toJS()
	return {
		classifications
	}
}

export default connect(mapStateToProps, mapActionCreators)(PostPanel)