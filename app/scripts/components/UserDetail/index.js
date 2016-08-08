import { connect } from 'react-redux'
import UserDetail from './UserDetail'

import { fetchUserInfo, fetchUserPost } from '../../actions/userDetailAction'

const mapActionCreators = {
	fetchUserInfo,
	fetchUserPost
}

const mapStateToProps = (state) => {
	const { user, posts } = state.userDetailReducer.toJS()
	return {
		user,
		posts
	}
}

export default connect(mapStateToProps, mapActionCreators)(UserDetail)