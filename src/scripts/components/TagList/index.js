import { connect } from 'react-redux'
import TagList from './TagList'
import { fetchTagClass } from '../../actions/tagClassAction'
import { getTag, getTagBy, setClassification, removeClassification, recommendTag, deleteTag, fetchSuggestion, clearSuggestion } from '../../actions/tagAction'

const mapActionCreators = {
	fetchTagClass,
	fetchSuggestion,
	clearSuggestion,
	setClassification,
	removeClassification,
	recommendTag,
	deleteTag,
	getTag,
	getTagBy,
}

const mapStateToProps = (state) => {
	const { classifications, loaded } = state.tagClassReducer.toJS()
	const { tags,suggestions, tagLoaded, totalPages,page, type, query } = state.tagReducer.toJS()
	return {
		tags,
		suggestions,
		totalPages,
		page,
		type,
		query,
		tagLoaded,

		classifications,
		classLoaded:loaded,
	}
}

export default connect(mapStateToProps, mapActionCreators)(TagList)