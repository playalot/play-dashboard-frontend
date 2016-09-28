import { connect } from 'react-redux'
import UserList from './UserList'

import {
	fetchUser, recommendUser, approveUser
} from '../../actions/userAction'

const mapActionCreators = {
	fetchUser,
	recommendUser,
	approveUser
}

const mapStateToProps = (state) => {
	const { users } = state.user.toJS()
	return {
		users
	}
}

export default connect(mapStateToProps, mapActionCreators)(UserList)