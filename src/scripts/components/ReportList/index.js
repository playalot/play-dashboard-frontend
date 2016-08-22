import { connect } from 'react-redux'
import ReportList from './ReportList'

import { fetchReport, deleteReport } from '../../actions/reportAction'
const mapActionCreators = {
	fetchReport,
	deleteReport
}

const mapStateToProps = (state) => {
	const { reports,loaded }  = state.reportReducer.toJS()
    return {
    	reports,
    	loaded,
    }
}

export default connect(mapStateToProps, mapActionCreators)(ReportList)