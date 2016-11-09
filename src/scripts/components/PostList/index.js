import { connect } from 'react-redux'
import { fetchPost, setClassification, removeClassification, getUnCls, clearPost, getPost } from '../../actions/postAction'
import { fetchTagClass } from '../../actions/tagClassAction'
import PostList from './PostList'

const mapActionCreators ={
	fetchPost,
	fetchTagClass,
	setClassification,
	removeClassification,
	getUnCls,
	clearPost,
	getPost,
}

const mapStateToProps = (state) => {
	const { posts,page,totalPages } = state.postReducer.toJS()
	const { classifications, loaded } = state.tagClassReducer.toJS()
	return {
		posts,
		page,
		totalPages,
		classifications,
		classLoaded:loaded
	}
}

export default connect(mapStateToProps, mapActionCreators)(PostList)