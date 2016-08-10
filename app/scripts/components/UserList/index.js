import { connect } from 'react-redux'
import UserList from './UserList'

import {
	fetchUser, recommendUser
} from '../../actions/userAction'

const mapActionCreators = {
	fetchUser,
	recommendUser
}

const mapStateToProps = (state) => {
	const { users } = state.userReducer.toJS()
	return {
		users
	}
}

export default connect(mapStateToProps, mapActionCreators)(UserList)