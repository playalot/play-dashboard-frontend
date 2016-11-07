import { connect } from 'react-redux'
import PageList from './PageList'
import { 
	fetchArticle, fetchArticleMore, togglePub, toggleRec, deleteArticle, setCoverType,addToy, toggleShare,
	fetchToy, clearSuggestion
} from '../../actions/pageAction'
const mapActionCreators = {
	fetchArticle,
	fetchArticleMore,
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
	const { pages, loaded, searchResults } = state.page.toJS()
    return {
    	pages,
    	loaded,
    	searchResults
    }
}

export default connect(mapStateToProps, mapActionCreators)(PageList)