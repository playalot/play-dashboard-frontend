import { connect } from 'react-redux'
import PageList from './PageList'
import { fetchArticle, fetchArticleMore, togglePub, toggleRec, deleteArticle } from '../../actions/pageAction'
const mapActionCreators = {
	fetchArticle,
	fetchArticleMore,
	togglePub,
	toggleRec,
	deleteArticle,
}

const mapStateToProps = (state) => {
	const { articles, loaded } = state.page.toJS()
    return {
    	articles,
    	loaded
    }
}

export default connect(mapStateToProps, mapActionCreators)(PageList)