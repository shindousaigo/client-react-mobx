import * as React from 'react';
import { Drawer, Button, Nav, Toggle, Icon, Tree, FlexboxGrid, Loader, SelectPicker, Col } from 'rsuite'
import Store from 'src/store';
import { intercept } from 'mobx'
import { observer } from 'mobx-react'
import { ReactComponent as SettingIconTitle } from './assets/setting/setting__icon--title.svg'
import Fade from '@material-ui/core/Fade';
import Device from 'src/store/Device';

@observer
export default class Setting extends React.Component {

  constructor(props) {
    super(props)
    this.intercepts()
  }

  componentDidMount() {
    this.navSelected(this.NAV.SECOND)
  }

  componentWillUnmount() {
    this.disposers.forEach((disposer, index, array) => {
      disposer()
      delete array[index]
    })
    this.disposers = null
  }

  disposers = []

  intercepts = () => {
    this.disposers.push(intercept(Store.instance.appState, 'availableSystemSelect', (change) => {
      this.setState({
        availableSystemSelect: JSON.parse(JSON.stringify(change.newValue))
      })
      return change
    }))
    this.disposers.push(intercept(Store.instance.appState, 'availableSystemTree', (change) => {
      this.setState({
        availableSystemTree: JSON.parse(JSON.stringify(change.newValue))
      })
      return change
    }))
  }

  NAV = {
    ALL: 'setting',
    FIRST: 'normal',
    SECOND: 'systems',
  }

  TreePathTmp

  state = {
    curNav: '',
    treeSelectedValue: true,
    fades: {
      [this.NAV.ALL]: false,
      [this.NAV.FIRST]: false,
      [this.NAV.SECOND]: false,
    },
    txt: {
      autoLogin: '是否开启自动登录',
      defaultSystem: '是否开启默认系统进入'
    },
    availableSystemSelect: Store.instance.appState.availableSystemSelect && JSON.parse(JSON.stringify(Store.instance.appState.availableSystemSelect)),
    availableSystemTree: Store.instance.appState.availableSystemTree && JSON.parse(JSON.stringify(Store.instance.appState.availableSystemTree)),
  }

  navSelected = (activeKey) => {
    this.state.fades[this.state.curNav] = false
    this.state.curNav = activeKey
    this.setState(this.state);
    requestAnimationFrame(() => {
      this.state.fades[activeKey] = true
      this.setState(this.state);
    })
  }

  autoLoginChanged = (defaultChecked: boolean) => {
    Store.instance.localstorageState.updateSettingConfig({
      autoLogin: defaultChecked
    } as any)
  }

  autoSystemChanged = (defaultChecked: boolean) => {
    Store.instance.localstorageState.updateSettingConfig({
      autoSystem: defaultChecked
    } as any)
  }

  treeToOpen = (activeNode) => {
    let tree = this.state.availableSystemTree, item, refKey = activeNode.refKey.slice(2).split('-').map(val => val * 1), length = refKey.length

    setTimeout(() => {
      this.TreePathTmp = refKey
    })

    if (this.TreePathTmp) {
      this.TreePathTmp.forEach((val, index) => {
        switch (index) {
          case 0:
            item = tree[val]
            break;
          case 1:
            item = item.children[val]
            break;
          case 2:
            item = item.children[val]
            break;
        }
        item['value'] = false
      })
    }

    refKey.forEach((val, index) => {
      switch (index) {
        case 0:
          item = tree[val]
          if (length === index + 1) item['expand'] = !item['expand']
          if (item['expand']) {
            if (!item['hasData']) {
              item['hasData'] = true
              let { systemId, gameId, systemName } = activeNode.source[0]
              Store.instance.httpState.checkMenu({
                systemId, gameId, systemName, index: activeNode.refKey.slice(2) * 1, treeList: this.state.availableSystemTree
              })
            }
          } else {
            item['children'].forEach(item => {
              item['expand'] = false
            })
          }
          break;
        case 1:
          item = item.children[val]
          if (length === index + 1) item['expand'] = !item['expand']
          break;
        case 2:
          item = item.children[val]
          break;
      }
      item['value'] = true
    })
    Store.instance.appState.updateAvailableSystemTree(tree)
  }


  body = () => {
    let classNameContainer = `body-${this.state.curNav}`
    switch (this.state.curNav) {
      case this.NAV.FIRST:
        let classNameItem = `${classNameContainer}__item`
        let classNameItemToggle = `${classNameContainer}-item__toggle`

        return <Col className={classNameContainer}>
          <FlexboxGrid align="middle" className={classNameItem}>
            <Toggle
              className={classNameItemToggle}
              defaultChecked={Store.instance.localstorageState.settingConfig.autoLogin}
              checkedChildren={<Icon icon="check" />}
              unCheckedChildren={<Icon icon="close" />}
              onChange={this.autoLoginChanged}
            />
            <span>{this.state.txt.autoLogin}</span>
          </FlexboxGrid>
          <FlexboxGrid align="middle" className={classNameItem}>
            <Toggle
              className={classNameItemToggle}
              defaultChecked={Store.instance.localstorageState.settingConfig.autoSystem}
              checkedChildren={<Icon icon="check" />}
              unCheckedChildren={<Icon icon="close" />}
              onChange={this.autoSystemChanged}
            />
            <span>{this.state.txt.defaultSystem}</span>
            {this.state.availableSystemSelect && <SelectPicker
              className={`${classNameContainer}-item__system-select-picker`}
              defaultValue={Store.instance.localstorageState.settingConfig.defaultSystem}
              data={this.state.availableSystemSelect}
              cleanable={false}
              searchable={false}
              onSelect={defaultSystem => {
                Store.instance.localstorageState.updateSettingConfig({
                  defaultSystem
                })
              }}
            />}
          </FlexboxGrid>
        </Col>
        break;
      case this.NAV.SECOND:
        return <div className={classNameContainer}>
          {this.state.availableSystemTree && <Tree
            className={`${classNameContainer}__tree`}
            value={this.state.treeSelectedValue}
            data={this.state.availableSystemTree}
            renderTreeNode={(nodeData) => {
              if (nodeData.label === 'Loader') {
                return <Loader speed="normal" />
              } else {
                return nodeData.isLast && nodeData.value ? <FlexboxGrid align="middle">
                  {nodeData.label}
                  <Fade in={true} timeout={500}>
                    <Button size="sm"
                      className={`${classNameContainer}-tree-item__button`}
                      onClick={() => {
                        this.setState({
                          systemsFade: false
                        })
                      }}
                    >
                      More
                    </Button>
                  </Fade>
                </FlexboxGrid> : nodeData.label
              }
            }}
            onExpand={(activeNode: { [K: string]: any }, layer: number) => {
              this.treeToOpen(activeNode)
            }}
            onSelect={(activeNode: { [K: string]: any }, layer: number, event: Event) => {
              this.treeToOpen(activeNode)
            }}
          />}
        </div>
        break;
      default:
        return null
        break;
    }
  }

  render() {
    return <Drawer
      className="setting"
      size="sm"
      full={Store.instance.deviceState.viewMode === Device.ViewMode.XS}
      backdrop={true}
      show={Store.instance.appState.drawerShow}
      onHide={function () {
        Store.instance.appState.updateDrawerShow(false)
      }}
      onExited={() => {
        this.state.fades[this.NAV.ALL] = false
        this.setState(this.state)
      }}
      onEntered={() => {
        this.state.fades[this.NAV.ALL] = true
        this.setState(this.state)
      }}
    >
      <Drawer.Header>
        <Drawer.Title className="setting__title">
          <FlexboxGrid justify="center" align="middle">
            <SettingIconTitle className="setting__icon--title"></SettingIconTitle>
            设置中心
          </FlexboxGrid>
        </Drawer.Title>
      </Drawer.Header>
      {/* <Drawer.Body className="setting__body"> */}
      <Nav appearance="tabs" activeKey={this.state.curNav} onSelect={this.navSelected}>
        <Nav.Item eventKey={this.NAV.FIRST} icon={<Icon icon="home" />}>
          Normal
          </Nav.Item>
        <Nav.Item eventKey={this.NAV.SECOND} icon={<Icon icon="home" />}>
          Systems
          </Nav.Item>
      </Nav>
      <div className="setting__body-container--animation">
        <Fade
          in={this.state.fades[this.NAV.ALL] && this.state.fades[this.state.curNav]}
          timeout={300}
        >
          {this.body()}
        </Fade>
      </div>
      {/* </Drawer.Body> */}
      {/* <Drawer.Footer></Drawer.Footer> */}
    </Drawer>
  }
}