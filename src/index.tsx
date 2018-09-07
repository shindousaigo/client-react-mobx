import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from 'src/App';
import Store from 'src/store';
import './index.scss'
import { AppContainer } from 'react-hot-loader'

const container = document.getElementById('App')
const render = (store = new Store) => {
  ReactDOM.render(
    <AppContainer><App store={store} /></AppContainer>,
    container,
  )
}

render()

if (__DEVELOPMENT__ && module.hot) {
  module.hot.accept();
  module.hot.accept('src/App', function () {
    var App = require('src/App').default
    render()
  })
  module.hot.accept('src/store', function () {
    render(new (require('src/store').default))
  })
}