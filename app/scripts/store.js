import { combineReducers, applyMiddleware, compose, createStore } from 'redux'
import { routerReducer as router, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'

import postReducer from './reducers/postReducer'
import tagClassReducer from './reducers/tagClassReducer'
import userDetailReducer from './reducers/userDetailReducer'
export const makeRootReducer = (asyncReducers) => {
	return combineReducers({
		// Add sync reducers here
		postReducer,
		tagClassReducer,
		userDetailReducer,
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
