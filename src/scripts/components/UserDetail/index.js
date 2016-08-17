import { connect } from 'react-redux'
import UserDetail from './UserDetail'

import { 
	fetchUserInfo, 
	fetchUserPost, 
	setClassification, 
	removeClassification,
	clearUserDetailPost 
} from '../../actions/userDetailAction'
import { fetchTagClass } from '../../actions/tagClassAction'

const mapActionCreators = {
	fetchUserInfo,
	fetchUserPost,
	setClassification,
	removeClassification,
	fetchTagClass,
	clearUserDetailPost,
}

const mapStateToProps = (state) => {
	const { user, posts } = state.userDetailReducer.toJS()
	const { classifications, loaded } = state.tagClassReducer.toJS()
	return {
		user,
		posts,
		classifications,
		classLoaded:loaded,
	}
}

export default connect(mapStateToProps, mapActionCreators)(UserDetail)