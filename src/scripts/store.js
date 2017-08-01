import { combineReducers, applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import admin from './reducers/adminReducer'
import postReducer from './reducers/postReducer'
import tagClassReducer from './reducers/tagClassReducer'
import userDetail from './reducers/userDetailReducer'
import stats from './reducers/statsReducer'
import recommendHome from './reducers/recommendHomeReducer'
import tagReducer from './reducers/tagReducer'
import explore from './reducers/exploreReducer'
import user from './reducers/userReducer'
import page from './reducers/pageReducer'
import toyReducer from './reducers/toyReducer'
import stickerReducer from './reducers/stickerReducer'
import feedback from './reducers/feedbackReducer'
import sku from './reducers/skuReducer'
import order from './reducers/orderReducer'
import trade from './reducers/tradeReducer'
export const makeRootReducer = () => {
	return combineReducers({
		admin,
		postReducer,
		tagClassReducer,
		userDetail,
		stats,
		recommendHome,
		tagReducer,
		explore,
		user,
		page,
		toyReducer,
		stickerReducer,
		feedback,
		sku,
		order,
		trade,
	})
}


const middleware = [thunk]

if (process.env.NODE_ENV === `development`) {
	
	const logger = createLogger();
	middleware.push(logger);
}


const store = createStore(
	makeRootReducer(),
	{},
	compose(
		applyMiddleware(...middleware)
	)
)

export default store
