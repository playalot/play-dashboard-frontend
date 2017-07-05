import { connect } from 'react-redux'
import { getUnCls, getPost, getPostBy } from '../../actions/postAction'
import PostList from './PostList'

const mapActionCreators ={
	getUnCls,
	getPost,
	getPostBy,
}

const mapStateToProps = (state) => {
	const { page,totalPages,filter,query } = state.postReducer.toJS()
	return {
		page,
		totalPages,
		filter,
		query,
	}
}

export default connect(mapStateToProps, mapActionCreators)(PostList)