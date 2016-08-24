import { connect } from 'react-redux'
import UserDetail from './UserDetail'

import { 
	fetchUserInfo, 
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
	fetchTagClass,
	clearPost,
}

const mapStateToProps = (state) => {
	const { user } = state.userDetailReducer.toJS()
	const { posts } = state.postReducer.toJS()
	const { classifications, loaded } = state.tagClassReducer.toJS()
	return {
		user,
		posts,
		classifications,
		classLoaded:loaded,
	}
}

export default connect(mapStateToProps, mapActionCreators)(UserDetail)