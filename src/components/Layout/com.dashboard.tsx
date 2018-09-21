import * as React from 'react';
import { Drawer, Button, Nav, Toggle, Icon, Tree, FlexboxGrid, Panel, Loader, SelectPicker } from 'rsuite'
import Zoom from '@material-ui/core/Zoom';
import { observer } from 'mobx-react'
import Store from 'src/store';
import { ReactComponent as DashboardIconTest } from './assets/dashboard/dashboard__icon--test.svg'
import { TweenMax } from 'gsap';

@observer
export default class Dashboard extends React.Component {

  constructor(props) {
    super(props)
    Store.instance.appState.availableSystem.forEach((item, systemName) => {
      this.state.systems[systemName] = true
      this.state.systemStyles[systemName] = {}
    })
  }

  state = {
    systems: {},
    systemStyles: {}
  }

  lastSystem

  render() {
    return <div className="dashboard">
      {/* <div className="dashboard__backdrop"></div> */}
      <Panel header={<h3 style={{
        fontWeight: 600
      }}>请选择你的系统：</h3>} bordered className="dashboard__system-select">
        <FlexboxGrid className="dashboard__systems-list">
          {(() => {
            let arr = []
            Store.instance.appState.availableSystem.forEach((item, systemName) => {
              arr.push(<Zoom
                style={this.state.systemStyles[systemName]}
                timeout={100}
                key={systemName}
                in={this.state.systems[systemName]}
                onExited={() => {
                  this.state.systemStyles[systemName] = {
                    position: 'absolute'
                  }
                  this.setState(this.state)
                }}

              >
                <FlexboxGrid className="dashboard__systems-item"
                  onClick={() => {
                    this.state.systems[systemName] = false

                    if (this.lastSystem) {
                      this.state.systemStyles[this.lastSystem] = {}
                      this.state.systems[this.lastSystem] = true
                    }
                    this.lastSystem = systemName
                    this.setState(this.state)
                  }}
                >
                  <DashboardIconTest className="dashboard__system-item--icon" />
                  {systemName}
                </FlexboxGrid></Zoom>)
            })
            return arr
          })()}
        </FlexboxGrid>
      </Panel>

      <FlexboxGrid>
        {/* {Store.instance.appState.availableSystemTree && <Tree
          style={{
            maxHeight: 'none',
          }}
          // value={this.state.treeSelectedValue}
          data={JSON.parse(JSON.stringify(Store.instance.appState.availableSystemTree))}
          renderTreeNode={(nodeData) => {
            if (nodeData.label === 'Loader') {
              return <Loader speed="normal" />
            } else {
              return nodeData.isLast && nodeData.value ? <FlexboxGrid align="middle">
                {nodeData.label}
                <Fade in={true} timeout={500}>
                  <Button size="sm" color="green" style={{ marginLeft: '.6rem' }} onClick={() => {
                    this.setState({
                      systemsFade: false
                    })
                  }}>Cyan</Button>
                </Fade>
              </FlexboxGrid> : <div>{nodeData.label}</div>
            }
          }}
          // onExpand={(activeNode: { [K: string]: any }, layer: number) => {
          //   this.treeToOpen(activeNode)
          // }}
          // onSelect={(activeNode: { [K: string]: any }, layer: number, event: Event) => {
          //   this.treeToOpen(activeNode)
          // }}
        />} */}
      </FlexboxGrid>
    </div >
  }
}