import { connect } from 'react-redux'
import PageList from './PageList'
import { 
	getPage, getPageBy, togglePub, toggleRec, deleteArticle, setCoverType,addToy, toggleShare,
	fetchToy, clearSuggestion
} from '../../actions/pageAction'
const mapActionCreators = {
	getPage,
	getPageBy,
	togglePub,
	toggleRec,
	deleteArticle,
	setCoverType,
	addToy,
	toggleShare,

	//玩具搜索
	fetchToy,
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