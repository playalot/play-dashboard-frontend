import { connect } from 'react-redux'
import UserDetail from './UserDetail'

import { 
	//info
	fetchUserInfo, 
	//page
	fetchUserPage,
	togglePub,
	toggleRec,
	deletePage,
	setCoverType,
	//user
	setActive,
	//post
	getUserPost,
	setClassification,
	removeClassification,
} from '../../actions/userDetailAction'
import { fetchTagClass } from '../../actions/tagClassAction'

const mapActionCreators = {
	getUserPost,
	setClassification,
	removeClassification,

	fetchUserInfo,
	fetchUserPage,
	togglePub,
	toggleRec,
	deletePage,
	setCoverType,

	setActive,

	fetchTagClass,
}

const mapStateToProps = (state) => {
	const { user, pages, posts,totalPages,page } = state.userDetail.toJS()
	const { classifications, loaded } = state.tagClassReducer.toJS()
	return {
		user,
		posts,
		totalPages,
		page,
		pages,
		classifications,
		classLoaded:loaded,
	}
}

export default connect(mapStateToProps, mapActionCreators)(UserDetail)