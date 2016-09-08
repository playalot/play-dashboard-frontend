import { connect } from 'react-redux'
import TagList from './TagList'
import { fetchTagClass } from '../../actions/tagClassAction'
import { fetchTag, setClassification, removeClassification, recommendTag, deleteTag, fetchSuggestion, clearSuggestion } from '../../actions/tagAction'

const mapActionCreators = {
	fetchTagClass,
	fetchTag,
	fetchSuggestion,
	clearSuggestion,
	setClassification,
	removeClassification,
	recommendTag,
	deleteTag,
}

const mapStateToProps = (state) => {
	const { classifications, loaded } = state.tagClassReducer.toJS()
	const { tags,suggestions, tagLoaded } = state.tagReducer.toJS()
	return {
		tags,
		suggestions,
		classifications,
		classLoaded:loaded,
		tagLoaded
	}
}

export default connect(mapStateToProps, mapActionCreators)(TagList)