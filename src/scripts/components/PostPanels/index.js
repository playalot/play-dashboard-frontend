import { connect } from 'react-redux'
import PostPanels from './PostPanels'

import { setClassification, removeClassification } from '../../actions/postAction'
import { fetchTagClass } from '../../actions/tagClassAction'

const mapActionCreators ={
	fetchTagClass,
	setClassification,
	removeClassification,
}

const mapStateToProps = (state) => {
	const { posts,filterType } = state.postReducer.toJS()
	const { classifications, loaded } = state.tagClassReducer.toJS()
	return {
		posts:filterPost(posts,filterType),
		classifications,
		classLoaded:loaded
	}
}

export default connect(mapStateToProps, mapActionCreators)(PostPanels)

function filterPost(posts,filterType) {
	if(filterType === 'unCls') {
		return posts.filter((post,i) => {
			return post.cls.length === 0
		})
	}else if(filterType === 'video') {
		return posts.filter((post,i) => {
			return post.video !== null
		}) 
	}else {
		return posts
	}
}