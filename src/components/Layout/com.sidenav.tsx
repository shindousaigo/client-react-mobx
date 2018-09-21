
import * as React from 'react';
import { Sidenav, Nav, Icon, Dropdown, FlexboxGrid, Col } from 'rsuite'
import Store from 'src/store';
import Device from 'src/store/Device';
import { observer } from 'mobx-react'

@observer
export class SideNav extends React.Component {

  render() {
    return <FlexboxGrid className="sidenav" flow="123">
      <FlexboxGrid className="sidenav__system">当前的系统</FlexboxGrid>
      <div className="sidenav__wrapper">
        <Sidenav
          className="sidenav__scroller"
          appearance="subtle"
          expanded={Store.instance.deviceState.viewMode === Device.ViewMode.ELSE}
        >
          <Sidenav.Body>
            <Nav>
              <Nav.Item eventKey="1" icon={<Icon icon="dashboard" />}>Dashboard</Nav.Item>
              <Nav.Item eventKey="2" icon={<Icon icon="group" />}>User Group</Nav.Item>
              <Dropdown
                placement="rightTop"
                eventKey="3"
                title="Settings"
                icon={<Icon icon="gear-circle" />}
              >
                <Dropdown.Item eventKey="3-1">Applications</Dropdown.Item>
                <Dropdown.Item eventKey="3-2">Channels</Dropdown.Item>
                <Dropdown.Item eventKey="3-3">Versions</Dropdown.Item>
                <Dropdown.Menu eventKey="3-5" title="Custom Action">
                  <Dropdown.Item eventKey="3-5-1">Action Name</Dropdown.Item>
                  <Dropdown.Item eventKey="3-5-2">Action Params</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown
                placement="rightTop"
                eventKey="4"
                title="Settings"
                icon={<Icon icon="gear-circle" />}
              >
                <Dropdown.Item eventKey="4-1">Applications</Dropdown.Item>
                <Dropdown.Item eventKey="4-2">Channels</Dropdown.Item>
                <Dropdown.Item eventKey="4-3">Versions</Dropdown.Item>
                <Dropdown.Menu eventKey="4-5" title="Custom Action">
                  <Dropdown.Item eventKey="4-5-1">Action Name</Dropdown.Item>
                  <Dropdown.Item eventKey="4-5-2">Action Params</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown
                placement="rightTop"
                eventKey="5"
                title="Advanced"
                icon={<Icon icon="magic" />}
              >
                <Dropdown.Item eventKey="5-1">Geo</Dropdown.Item>
                <Dropdown.Item eventKey="5-2">Devices</Dropdown.Item>
                <Dropdown.Item eventKey="5-3">Loyalty</Dropdown.Item>
                <Dropdown.Item eventKey="5-4">Visit Depth</Dropdown.Item>
              </Dropdown>

              <Dropdown
                placement="rightTop"
                eventKey="6"
                title="Settings"
                icon={<Icon icon="gear-circle" />}
              >
                <Dropdown.Item eventKey="6-1">Applications</Dropdown.Item>
                <Dropdown.Item eventKey="6-2">Channels</Dropdown.Item>
                <Dropdown.Item eventKey="6-3">Versions</Dropdown.Item>
                <Dropdown.Menu eventKey="6-5" title="Custom Action">
                  <Dropdown.Item eventKey="6-5-1">Action Name</Dropdown.Item>
                  <Dropdown.Item eventKey="6-5-2">Action Params</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </div>
    </FlexboxGrid>
  }
}