import { connect } from 'react-redux'
import ToyList from './ToyList'
import { getToy,getToyBy, recommend, toggleR18, toggleRecommend, deleteToy, addToy,addToyClass,removeToyClass,addToyTag,removeToyTag } from '../../actions/toyAction'
import { fetchToyClass } from '../../actions/tagClassAction'
const mapActionCreators = {
	getToy,
	getToyBy,
	recommend,
	toggleR18,
	toggleRecommend,
	deleteToy,
	addToy,
	addToyTag,
	removeToyTag,

	fetchToyClass,
	addToyClass,
	removeToyClass,
}

const mapStateToProps = (state) => {
	const { toys,totalPages,page,filter,query,sort,month,year } = state.toyReducer.toJS()
	const { toyClass, toyLoaded } = state.tagClassReducer.toJS()
	return {
		toys,
		totalPages,
		page,
		filter,
		query,
		sort,
		year,
		month,

		toyClass,
		toyLoaded,
	}
}

export default connect(mapStateToProps, mapActionCreators)(ToyList)
