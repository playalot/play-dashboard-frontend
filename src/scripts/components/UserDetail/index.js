import { connect } from 'react-redux'
import UserDetail from './UserDetail'

import { etchUserInfo, setActive,fetchUserInfo } from '../../actions/userDetailAction'
import { fetchTagClass } from '../../actions/tagClassAction'
import { approveUser } from '../../actions/userAction'
import { getUserPage,clearPage } from '../../actions/pageAction'
import { getUserPost,setClassification,removeClassification,clearPost } from '../../actions/postAction'

import { setTouid } from '../../actions/adminAction'
const mapActionCreators = {
	getUserPost,
	setClassification,
	removeClassification,

	getUserPage,

	fetchUserInfo,

	setActive,

	fetchTagClass,

	approveUser,
	clearPost,
	clearPage,

	setTouid
}

const mapStateToProps = (state) => {
	const { totalPages } = state.postReducer.toJS()
	const { user } = state.userDetail.toJS()
	const { classifications, loaded } = state.tagClassReducer.toJS()
	return {
		totalPages,
		user,
		classifications,
		classLoaded:loaded,
	}
}

export default connect(mapStateToProps, mapActionCreators)(UserDetail)