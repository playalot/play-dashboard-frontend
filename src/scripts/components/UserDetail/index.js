import { connect } from 'react-redux'
import UserDetail from './UserDetail'

import { 
	fetchUserInfo, fetchUserPage,
	togglePub,
	toggleRec,
	deleteArticle,
	setCoverType,
} from '../../actions/userDetailAction'
import {
	fetchUserPost, setClassification, removeClassification, clearPost
} from '../../actions/postAction'
import { fetchTagClass } from '../../actions/tagClassAction'

const mapActionCreators = {
	fetchUserInfo,
	fetchUserPost,
	fetchUserPage,
	setClassification,
	removeClassification,
	fetchTagClass,
	clearPost,

	togglePub,
	toggleRec,
	deleteArticle,
	setCoverType,
}

const mapStateToProps = (state) => {
	const { user,pages } = state.userDetailReducer.toJS()
	const { posts } = state.postReducer.toJS()
	const { classifications, loaded } = state.tagClassReducer.toJS()
	return {
		user,
		posts,
		pages,
		classifications,
		classLoaded:loaded,
	}
}

export default connect(mapStateToProps, mapActionCreators)(UserDetail)