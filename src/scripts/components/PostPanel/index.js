import { connect } from 'react-redux'
import PostPanel from './PostPanel'

import { 
	toggleRecommend, 
	addTag, 
	removeTag, 
	toggleBlock, 
	toggleR18,
	addToy, 
	deletePost,
	removeToy,
	removeAllClassification,
} from '../../actions/postAction'

const mapActionCreators ={
	toggleRecommend,
	toggleBlock,
	toggleR18,
	addTag,
	removeTag,
	addToy,
	deletePost,
	removeToy,
	removeAllClassification,
}

const mapStateToProps = (state) => {
	const { classifications } = state.tagClassReducer.toJS()
	return {
		classifications
	}
}

export default connect(mapStateToProps, mapActionCreators)(PostPanel)