import { connect } from 'react-redux'
import PageList from './PageList'
import { fetchArticle, fetchArticleMore, togglePub, toggleRecommend, deleteArticle } from '../../actions/articleAction'
const mapActionCreators = {
	fetchArticle,
	fetchArticleMore,
	togglePub,
	toggleRecommend,
	deleteArticle,
}

const mapStateToProps = (state) => {
	const { articles } = state.articleReducer.toJS()
	const loaded = state.articleReducer.get('loaded')
    return {
    	articles,
    	loaded
    }
}

export default connect(mapStateToProps, mapActionCreators)(PageList)