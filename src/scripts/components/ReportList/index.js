import { connect } from 'react-redux'
import ReportList from './ReportList'

import { getReport, deleteReport, toggleBlk } from '../../actions/reportAction'
const mapActionCreators = {
	getReport,
	deleteReport,
	toggleBlk
}

const mapStateToProps = (state) => {
	const { reports,totalPages,page }  = state.report.toJS()
    return {
    	reports,
    	totalPages,
    	page
    }
}

export default connect(mapStateToProps, mapActionCreators)(ReportList)