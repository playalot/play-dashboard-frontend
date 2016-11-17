import { connect } from 'react-redux'
import PageList from './PageList'
import { 
	getPage, getPageBy, togglePub, toggleRec, deleteArticle, setCoverType,addToy, toggleShare
} from '../../actions/pageAction'

import { fetchToyByQuery, clearSuggestion } from '../../actions/toyAction'
const mapActionCreators = {
	getPage,
	getPageBy,
	togglePub,
	toggleRec,
	deleteArticle,
	setCoverType,
	addToy,
	toggleShare,

	fetchToyByQuery,
	clearSuggestion,
}

const mapStateToProps = (state) => {
	const { pages, searchResults, totalPages,page,query,filter } = state.page.toJS()
    return {
    	pages,
    	page,
    	query,
    	filter,
    	totalPages,
    	searchResults
    }
}

export default connect(mapStateToProps, mapActionCreators)(PageList)