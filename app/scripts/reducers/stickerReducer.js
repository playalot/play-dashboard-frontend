import Immutable from 'immutable'
import { STL_RECEIVE_SET, STL_ADD_STICKER_SET, STL_UP_STICKER_SET, STL_UP_STICKER ,STL_DELETE_STICKER } from '../actions/stickerAction'

export default (state = Immutable.fromJS({ sets: [], loaded:false }),action)=>{
    switch (action.type) {
        case STL_RECEIVE_SET:
        	return state.set('sets',Immutable.fromJS(action.res)).set('loaded',true)
        case STL_ADD_STICKER_SET:
        	return state.updateIn(['sets'],(sets) => {
        		return sets.unshift(Immutable.fromJS(action.res))
        	})
       	case STL_UP_STICKER_SET:
       		return state.updateIn(['sets'], (sets) => {
       			return sets.update(
       				sets.findIndex((item) => { 
                        return item.get('id') === action.id 
                    }), (item) => {
                        return item.set('score', item.get('score') + 1 )
                    }
       			)
       		}).updateIn(['sets'],(sets) => {
       			return sets.sortBy(val => -val.get('score'))
       		})
       	case STL_UP_STICKER:
       		return state.updateIn(['sets'], (sets) => {
       			return sets.update(
       				sets.findIndex((item) => {
       					return item.get('id') === action.id
       				}),(item) => {
       					return item.updateIn(['stickers'],(stickers) => {
       						return stickers.update(
	       						stickers.findIndex((sticker) => {
	       							return sticker.get('id') === action.sid
	       						}),(sticker) => {
	       							return sticker.set('score', sticker.get('score') + 1)
	       						}
	       					).sortBy(val => -val.get('score'))
       					})
       					
       				}
       			)
       		})
       	case STL_DELETE_STICKER:
       		return state.updateIn(['sets'],(sets) => {
       			return sets.update(
       				sets.findIndex((item) => {
       					return item.get('id') === action.id
       				}), (item) => {
       					return item.updateIn(['stickers'], (stickers) => {
       						return stickers.delete(stickers.findKey((sticker) => {
       							return sticker.get('id') === action.sid
       						}))
       					})
       				}

       			)
       		})
        default:
            return state
    }
}