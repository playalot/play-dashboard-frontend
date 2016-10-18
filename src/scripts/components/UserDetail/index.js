import { connect } from 'react-redux'
import UserDetail from './UserDetail'

import { 
	fetchUserInfo, 

	fetchUserPage,
	togglePub,
	toggleRec,
	deletePage,
	setCoverType,
} from '../../actions/userDetailAction'
import {
	fetchUserPost, setClassification, removeClassification, clearPost
} from '../../actions/postAction'
import { fetchTagClass } from '../../actions/tagClassAction'

const mapActionCreators = {
	fetchUserInfo,

	fetchUserPost,
	setClassification,
	removeClassification,
	clearPost,

	fetchUserPage,
	togglePub,
	toggleRec,
	deletePage,
	setCoverType,

	fetchTagClass,
}

const mapStateToProps = (state) => {
	const { user, pages } = state.userDetail.toJS()
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