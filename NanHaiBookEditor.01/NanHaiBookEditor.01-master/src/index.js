import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './components/App/App'
import store from './store'

import { actLoadTrans, loadLanguage } from './i18n'

const lang = loadLanguage('en')
store.dispatch(actLoadTrans(lang))

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
