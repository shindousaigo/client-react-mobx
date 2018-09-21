
import * as React from 'react';
import { Header as ComHeader } from 'src/components/Layout/com.header';
import Dashboard from 'src/components/Layout/com.dashboard';
import Setting from 'src/components/Layout/com.setting';
import { SideNav } from 'src/components/Layout/com.sidenav';
import './style.scss'
import { intercept } from 'mobx'
import { observer } from 'mobx-react'
import Device from 'src/store/Device';
import Store from 'src/store';
import { History } from 'history'
import { Container, Header, Content, Footer, Sidebar } from "rsuite"

@observer
export default class Layout extends React.Component<{ history: History }> {

  state = {
    showSidebar: Store.instance.localstorageState.settingConfig.autoSystem
  }

  render() {

    return <Container className="container">
      <Header>
        <ComHeader history={this.props.history} />
      </Header>
      <Container className="container__body">
        {this.state.showSidebar && <Sidebar
          className="container__sidebar"
          width={Store.instance.deviceState.viewMode === Device.ViewMode.ELSE ? 260 : 56}
        >
          <SideNav />
        </Sidebar>}
        <Content className="container__content">
          <Dashboard />
        </Content>
      </Container>
      <Setting />
    </Container>
  }

}