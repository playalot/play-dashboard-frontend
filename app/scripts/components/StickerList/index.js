import { connect } from 'react-redux'
import StickerList from './StickerList'
import { fetchSets, addStickerSet, riseStickerSet, riseSticker, deleteSticker } from '../../actions/stickerAction'

const mapActionCreators = {
	fetchSets,
	addStickerSet,
	riseStickerSet,
	riseSticker,
	deleteSticker,
}

const mapStateToProps = (state) => {
	const { sets,loaded } = state.stickerReducer.toJS()
	return {
		sets,
		loaded,
	}
}

export default connect(mapStateToProps, mapActionCreators)(StickerList)