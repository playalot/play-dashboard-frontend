import { connect } from 'react-redux'
import UserList from './UserList'

import {
	fetchUser, recommendUser, approveUser,getUser,getUserBy
} from '../../actions/userAction'
import { setTouid } from '../../actions/adminAction'
const mapActionCreators = {
	fetchUser,
	recommendUser,
	approveUser,
	getUser,
	getUserBy,

	setTouid,
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