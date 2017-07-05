import { connect } from 'react-redux'
import PostPanels from './PostPanels'

import { setClassification, removeClassification } from '../../actions/postAction'
import { fetchTagClass } from '../../actions/tagClassAction'

const mapActionCreators ={
	fetchTagClass,
	setClassification,
	removeClassification,
}

const mapStateToProps = (state) => {
	const { posts } = state.postReducer.toJS()
	const { classifications, loaded } = state.tagClassReducer.toJS()
	return {
		posts,
		classifications,
		classLoaded:loaded
	}
}

export default connect(mapStateToProps, mapActionCreators)(PostPanels)