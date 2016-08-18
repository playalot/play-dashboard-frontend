import { connect } from 'react-redux'
import PostPanel from './PostPanel'

import { 
	toggleRecommend, 
	addTag, 
	removeTag, 
	toggleBlock, 
	toggleR18,
	addSku, 
	deletePost,
	removeToy,
} from '../../actions/postAction'

const mapActionCreators ={
	toggleRecommend,
	toggleBlock,
	toggleR18,
	addTag,
	removeTag,
	addSku,
	deletePost,
	removeToy,
}

const mapStateToProps = (state) => {
	const { classifications } = state.tagClassReducer.toJS()
	return {
		classifications
	}
}

export default connect(mapStateToProps, mapActionCreators)(PostPanel)