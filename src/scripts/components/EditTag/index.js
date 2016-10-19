import { connect } from 'react-redux'
import EditTag from './EditTag'
import { fetchTagClass } from '../../actions/tagClassAction'

const mapActionCreators = {
	fetchTagClass,
}

const mapStateToProps = (state) => {
	const { classifications, loaded } = state.tagClassReducer.toJS()
	return {
		classifications,
		classLoaded:loaded,
	}
}

export default connect(mapStateToProps, mapActionCreators)(EditTag)