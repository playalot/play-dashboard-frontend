import { connect } from 'react-redux'
import ArticleList from './ArticleList'
import { fetchArticle, fetchArticleMore } from '../../actions/articleAction'
const mapActionCreators = {
	fetchArticle,
	fetchArticleMore
}

const mapStateToProps = (state) => {
	const { articles } = state.articleReducer.toJS()
	const loaded = state.articleReducer.get('loaded')
    return {
    	articles,
    	loaded
    }
}

export default connect(mapStateToProps, mapActionCreators)(ArticleList)