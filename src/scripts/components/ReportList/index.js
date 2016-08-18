import { connect } from 'react-redux'
import ReportList from './ReportList'

import {fetchReport} from '../../actions/reportAction'
const mapActionCreators = {
	fetchReport
}

const mapStateToProps = (state) => {
	const { reports,loaded }  = state.reportReducer.toJS()
    return {
    	reports,
    	loaded,
    }
}

export default connect(mapStateToProps, mapActionCreators)(ReportList)