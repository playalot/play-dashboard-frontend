import { connect } from 'react-redux'
import { fetchPost, setPostClassification, removePostClassification } from '../../actions/postAction'
import { fetchTagClass } from '../../actions/tagClassAction'
import PostList from './PostList'

const mapActionCreators ={
	fetchPost,
	fetchTagClass,
	setPostClassification,
	removePostClassification,
}

const mapStateToProps = (state) => {
	const { posts } = state.postReducer.toJS()
	const { classifications } = state.tagClassReducer.toJS()
	return {
		posts,
		classifications,
	}
}

export default connect(mapStateToProps, mapActionCreators)(PostList)