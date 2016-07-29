import React from 'react'

import App from './components/App/App.jsx'
const Foo = () => (<div>Foo!</div>)
const Bar = () => (<div>Bar!</div>)

export default {
    path: '/',
    component: App,
    indexRoute: { component:Foo },
    childRoutes: [
        { path:'foo', component:Foo },
        { path:'bar', component:Bar },
    ]
}
