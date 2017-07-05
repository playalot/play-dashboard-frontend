import { connect } from 'react-redux'
import UserDetail from './UserDetail'

import { etchUserInfo, setActive,fetchUserInfo } from '../../actions/userDetailAction'
import { fetchTagClass } from '../../actions/tagClassAction'
import { approveUser } from '../../actions/userAction'
import { getUserPage,clearPage } from '../../actions/pageAction'
import { getUserPost,setClassification,removeClassification,clearPost } from '../../actions/postAction'
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
	clearPage
}

const mapStateToProps = (state) => {
	const { user } = state.userDetail.toJS()
	const { classifications, loaded } = state.tagClassReducer.toJS()
	return {
		user,
		classifications,
		classLoaded:loaded,
	}
}

export default connect(mapStateToProps, mapActionCreators)(UserDetail)