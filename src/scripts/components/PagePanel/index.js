import { connect } from 'react-redux'
import PagePanel from './PagePanel'
import { 
	togglePub, toggleRec, toggleShare, deleteArticle, setCoverType,addToy, removeToy, 
} from '../../actions/pageAction'

import { fetchToyByQuery, clearSuggestion } from '../../actions/toyAction'
const mapActionCreators = {
	togglePub,
	toggleRec,
	toggleShare,
	deleteArticle,
	setCoverType,
	addToy,
	removeToy,

	fetchToyByQuery,
	clearSuggestion,
}

const mapStateToProps = (state) => {
	const { pages } = state.page.toJS()
	const { toyResults } = state.toyReducer.toJS()
    return {
    	pages,
    	toyResults
    }
}

export default connect(mapStateToProps, mapActionCreators)(PagePanel)