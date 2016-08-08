import { connect } from 'react-redux'
import { fetchPost, setClassification, removeClassification } from '../../actions/postAction'
import { fetchTagClass } from '../../actions/tagClassAction'
import PostList from './PostList'

const mapActionCreators ={
	fetchPost,
	fetchTagClass,
	setClassification,
	removeClassification,
}

const mapStateToProps = (state) => {
	const { posts } = state.postReducer.toJS()
	const { classifications, loaded } = state.tagClassReducer.toJS()
	return {
		posts,
		classifications,
		classLoaded:loaded
	}
}

export default connect(mapStateToProps, mapActionCreators)(PostList)