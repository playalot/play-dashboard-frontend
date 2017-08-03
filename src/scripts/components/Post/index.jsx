import { connect } from 'react-redux'
import Post from './Post'

import { setClassification, removeClassification } from '../../actions/postAction'
import { fetchTagClass } from '../../actions/tagClassAction'

const mapActionCreators ={
	fetchTagClass,
	setClassification,
	removeClassification,
}

const mapStateToProps = (state) => {
    const { classifications,loaded } = state.tagClassReducer.toJS()
	return {
        classifications,
        loaded
	}
}

export default connect(mapStateToProps, mapActionCreators)(Post)