import { combineReducers, applyMiddleware, compose, createStore } from 'redux'
import { routerReducer as router, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'

import postReducer from './reducers/postReducer'
import tagClassReducer from './reducers/tagClassReducer'
import userDetailReducer from './reducers/userDetailReducer'
import stats from './reducers/statsReducer'
import recommendHome from './reducers/recommendHomeReducer'
import tagReducer from './reducers/tagReducer'
import explore from './reducers/exploreReducer'
import user from './reducers/userReducer'
import page from './reducers/pageReducer'
import toyReducer from './reducers/toyReducer'
import stickerReducer from './reducers/stickerReducer'
import reportReducer from './reducers/reportReducer'
import feedbackReducer from './reducers/feedbackReducer'
import sku from './reducers/skuReducer'
export const makeRootReducer = (asyncReducers) => {
	return combineReducers({
		// Add sync reducers here
		postReducer,
		tagClassReducer,
		userDetailReducer,
		stats,
		recommendHome,
		tagReducer,
		explore,
		user,
		page,
		toyReducer,
		stickerReducer,
		reportReducer,
		feedbackReducer,
		sku,
		router,
		...asyncReducers
	})
}

export const injectReducer = (store, { key, reducer }) => {
	store.asyncReducers[key] = reducer
	store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default ( history, initialState ) => {

	const middleware = [thunk, routerMiddleware(history)];

	if (process.env.NODE_ENV === `development`) {
		const createLogger = require(`redux-logger`);
		const logger = createLogger();
		middleware.push(logger);
	}


	const store = createStore(
	    makeRootReducer(),
	    initialState,
	    compose(
	      	applyMiddleware(...middleware)
	    )
	)

	store.asyncReducers = {}

	return store
}
