import { connect } from 'react-redux'
import PageList from './PageList'
import { getPage, getPageBy } from '../../actions/pageAction'

const mapActionCreators = {
	getPage,
	getPageBy,
}

const mapStateToProps = (state) => {
	const { totalPages,page,query,filter } = state.page.toJS()
    return {
    	page,
    	query,
    	filter,
    	totalPages,
    }
}

export default connect(mapStateToProps, mapActionCreators)(PageList)