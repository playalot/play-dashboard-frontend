import { connect } from 'react-redux'
import UserDetail from './UserDetail'

import { 
	fetchUserInfo, 

	fetchUserPage,
	togglePub,
	toggleRec,
	deletePage,
	setCoverType,

	setActive,
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

	//用户操作
	setActive,
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