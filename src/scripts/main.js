import React,{ Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import store from './store'

import '../sass/style.scss'

import App from './components/App'

const render = (Component) => {
    ReactDOM.render(
        <Provider store={store}>
            <HashRouter>
                <AppContainer>
                    <Component/>
                </AppContainer>
            </HashRouter>
        </Provider>,
        document.getElementById('app')
    )
}

render(App)

if (module.hot) {
    module.hot.accept('./components/App', () => {
        render(App)
    })
}