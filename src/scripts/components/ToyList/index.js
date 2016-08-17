import { connect } from 'react-redux'
import ToyList from './ToyList'
import { fetchToys, recommend, toggleR18, toggleRecommend, deleteToy, addToy } from '../../actions/toyAction'

const mapActionCreators = {
	fetchToys,
	recommend,
	toggleR18,
	toggleRecommend,
	deleteToy,
	addToy,
}

const mapStateToProps = (state) => {
	const { toys } = state.toyReducer.toJS()
	const loaded = state.toyReducer.get('loaded')
	return {
		toys,
		loaded
	}
}

export default connect(mapStateToProps, mapActionCreators)(ToyList)
