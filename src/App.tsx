import * as React from 'react';
import Store from 'src/store';
import Login from 'src/components/Login/com.login'
import 'rsuite/styles/index.less'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Routes } from 'src/store/RouteState';
import Layout from 'src/components/Layout/com.layout';
import { observer } from 'mobx-react'

@observer
export default class App extends React.Component<{ store: Store }> {

  render() {
    return <BrowserRouter>
      <Switch>
        {Store.instance.appState.isLogin && <Route exact path={Routes.Path.LAYOUT} render={({ history }) => <Layout history={history} />} />}
        {(!Store.instance.localstorageState.settingConfig.autoLogin || !Store.instance.localstorageState.userInfo || !Store.instance.appState.isLogin) && <Switch>
          <Route exact path={Routes.Path.LOGIN} render={({ history }) => <Login history={history} />} />
          <Redirect to={Routes.Path.LOGIN} />
        </Switch>}
      </Switch>
    </BrowserRouter>
  }

}



