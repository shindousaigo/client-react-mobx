import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Store from 'src/store';
import './index.scss'
// import { AppContainer } from 'react-hot-loader'

let App = require('src/App').default

const container = document.getElementById('App')
const render = (store = new Store) => {
  ReactDOM.render(
    <App store={store} />,
    container,
  )
}

render()

if (__DEVELOPMENT__ && module.hot) {

  window.addEventListener("resize", function () {
    let IM = new Store.instance.deviceState.isMobile.Class
    IM.Class = Store.instance.deviceState.isMobile.Class
    Store.instance.deviceState.isMobile = IM
  })

  module.hot.accept();

  function reload() {
    delete require.cache['src/App']
    App = require('src/App').default
    delete require.cache['src/store']
    let store: Store = new (require('src/store').default)
    store.appState.isReload = true
    render(store)
  }

  module.hot.accept('src/App', function () {
    reload()
  })
  module.hot.accept('src/store', function () {
    reload()
  })
}