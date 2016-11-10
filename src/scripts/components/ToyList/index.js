import { connect } from 'react-redux'
import ToyList from './ToyList'
import { getToy,getToyBy, recommend, toggleR18, toggleRecommend, deleteToy, addToy } from '../../actions/toyAction'

const mapActionCreators = {
	getToy,
	getToyBy,
	recommend,
	toggleR18,
	toggleRecommend,
	deleteToy,
	addToy,
}

const mapStateToProps = (state) => {
	const { toys,totalPages,page,filter,query,sort,month,year } = state.toyReducer.toJS()
	return {
		toys,
		totalPages,
		page,
		filter,
		query,
		sort,
		year,
		month,
	}
}

export default connect(mapStateToProps, mapActionCreators)(ToyList)
