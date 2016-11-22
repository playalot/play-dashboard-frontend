import { connect } from 'react-redux'
import PageList from './PageList'
import { 
	getPage, getPageBy, togglePub, toggleRec, deleteArticle, setCoverType,addToy, removeToy, toggleShare
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
	removeToy,
	toggleShare,

	fetchToyByQuery,
	clearSuggestion,
}

const mapStateToProps = (state) => {
	const { pages, totalPages,page,query,filter } = state.page.toJS()
	const { toyResults } = state.toyReducer.toJS()
    return {
    	pages,
    	page,
    	query,
    	filter,
    	totalPages,

    	toyResults
    }
}

export default connect(mapStateToProps, mapActionCreators)(PageList)