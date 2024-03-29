import { connect } from 'react-redux'
import { getUnCls, getPost, getPostBy,getVideoPost } from '../../actions/postAction'
import PostList from './PostList'

const mapActionCreators ={
	getUnCls,
	getVideoPost,
	getPost,
	getPostBy,
}

const mapStateToProps = (state) => {
	const { page,totalPages,filter,query,isVideo } = state.postReducer.toJS()
	return {
		page,
		totalPages,
		filter,
		query,
		isVideo,
	}
}

export default connect(mapStateToProps, mapActionCreators)(PostList)