import { connect } from 'react-redux'
import TagList from './TagList'
import { fetchTagClass } from '../../actions/tagClassAction'
import { fetchTag, setClassification, removeClassification, recommendTag, deleteTag } from '../../actions/tagAction'

const mapActionCreators = {
	fetchTagClass,
	fetchTag,
	setClassification,
	removeClassification,
	recommendTag,
	deleteTag,
}

const mapStateToProps = (state) => {
	const { classifications, loaded } = state.tagClassReducer.toJS()
	const { tags } = state.tagReducer.toJS()
	return {
		tags,
		classifications,
		classLoaded:loaded
	}
}

export default connect(mapStateToProps, mapActionCreators)(TagList)