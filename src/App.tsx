import * as React from 'react';
import Store from 'src/store';
import LoginPage from 'src/components/Login/page.main'
import 'rsuite/styles/index.less'

export default class App extends React.Component<{ store: Store }> {

  render() {
    return <div>
      <LoginPage {...this.props} />
    </div>
  }

}


