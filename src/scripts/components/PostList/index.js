import { connect } from 'react-redux'
import { setClassification, removeClassification, getUnCls, getPost, getPostBy } from '../../actions/postAction'
import { fetchTagClass } from '../../actions/tagClassAction'
import PostList from './PostList'

const mapActionCreators ={
	fetchTagClass,
	setClassification,
	removeClassification,
	getUnCls,
	getPost,
	getPostBy,
}

const mapStateToProps = (state) => {
	const { posts,page,totalPages,filter,query } = state.postReducer.toJS()
	const { classifications, loaded } = state.tagClassReducer.toJS()
	return {
		posts,
		page,
		totalPages,
		filter,
		query,
		classifications,
		classLoaded:loaded
	}
}

export default connect(mapStateToProps, mapActionCreators)(PostList)