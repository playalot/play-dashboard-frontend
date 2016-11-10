import { connect } from 'react-redux'
import UserList from './UserList'

import {
	fetchUser, recommendUser, approveUser,getUser,getUserBy
} from '../../actions/userAction'

const mapActionCreators = {
	fetchUser,
	recommendUser,
	approveUser,
	getUser,
	getUserBy,
}

const mapStateToProps = (state) => {
	const { users,page,filter,totalPages } = state.user.toJS()
	return {
		users,
		page,
		filter,
		totalPages,
	}
}

export default connect(mapStateToProps, mapActionCreators)(UserList)