import React,{ Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory, browserHistory} from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import _createStore from './store'
import routes from './routes'

import '../sass/style.scss'
// const AdminLTEOptions = {
//     enableBoxRefresh: true,
//     enableBSToppltip: true
// }
const initialState = {}
const store = _createStore(hashHistory, initialState)
const history = syncHistoryWithStore(hashHistory, store, {
    selectLocationState: (state) => state.router
})
render((
    <Provider store={store}>
        <Router
            history={history}
            children={routes}
        />
    </Provider>
), document.getElementById('app'))
