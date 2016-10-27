import { connect } from 'react-redux'
import PageList from './PageList'
import { fetchArticle, fetchArticleMore, togglePub, toggleRec, deleteArticle, setCoverType,addToy } from '../../actions/pageAction'
const mapActionCreators = {
	fetchArticle,
	fetchArticleMore,
	togglePub,
	toggleRec,
	deleteArticle,
	setCoverType,
	addToy,
}

const mapStateToProps = (state) => {
	const { pages, loaded } = state.page.toJS()
    return {
    	pages,
    	loaded
    }
}

export default connect(mapStateToProps, mapActionCreators)(PageList)