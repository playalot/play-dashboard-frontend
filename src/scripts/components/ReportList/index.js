import { connect } from 'react-redux'
import ReportList from './ReportList'

import { fetchReport, deleteReport, toggleBlk } from '../../actions/reportAction'
const mapActionCreators = {
	fetchReport,
	deleteReport,
	toggleBlk
}

const mapStateToProps = (state) => {
	const { reports,loaded }  = state.reportReducer.toJS()
    return {
    	reports,
    	loaded,
    }
}

export default connect(mapStateToProps, mapActionCreators)(ReportList)