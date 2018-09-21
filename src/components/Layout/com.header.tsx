import * as React from 'react';
import { ReactComponent as HeaderToggleSidenav } from './assets/header/header__toggle--sidenav.svg'
import { ReactComponent as HeaderAvatarBefore } from './assets/header/heder__avatar--before.svg'
import { ReactComponent as HeaderAvatarAfter } from './assets/header/heder__avatar--after.svg'
import { ReactComponent as HeaderToggleSetting } from './assets/header/header__toggle--setting.svg'
import { History } from 'history'
import { Routes } from 'src/store/RouteState';
import Store from 'src/store';
import { Whisper, Tooltip, FlexboxGrid } from 'rsuite'
import { observer } from 'mobx-react'

@observer
export class Header extends React.Component<{ history: History }> {

  lastTouchTimestamp

  state = {
    avatar: false,
    setting: false,

    txt: {
      logout: '"双击" 头像即可退出当前用户状态'
    },

    showToggleSidebar: Store.instance.localstorageState.settingConfig.autoSystem
  }

  render() {
    return <div className="header">
      <FlexboxGrid justify="space-between" align="middle" style={{
        height: 'inherit',
        width: 'inherit'
      }}>
        <div className="header__toggle--sidebar-container">
          {this.state.showToggleSidebar && <HeaderToggleSidenav className="header__toggle--sidebar" fill="#3c8ce7" />}
        </div>
        <div className="header__logo"></div>

        <FlexboxGrid align="middle" justify="space-around" style={{
          height: 'inherit',
          width: '5.6rem'
        }}>
          {this.state.avatar ?
            <Whisper
              trigger={"hover"}
              placement="bottom"
              speaker={<Tooltip style={{ fontSize: '1rem', width: '10.4rem' }}>{this.state.txt.logout}</Tooltip>}
            >
              <HeaderAvatarAfter className="header__avatar"
                {...{
                  onMouseLeave: () => {
                    this.setState({
                      avatar: false
                    })
                  },
                  onClick: Store.instance.deviceState.isMobile.any ? () => {
                    let now = Date.now() as any
                    if (this.lastTouchTimestamp) {
                      let delta = now - this.lastTouchTimestamp
                      if (delta < 300) {
                        Store.instance.localstorageState.updateUserInfo(null)
                        this.props.history.push(Routes.Path.LOGIN)
                      }
                    }
                    this.lastTouchTimestamp = now
                  } : null
                }}
                onDoubleClickCapture={() => {
                  Store.instance.localstorageState.updateUserInfo(null)
                  this.props.history.push(Routes.Path.LOGIN)
                }}
              />
            </Whisper>
            :
            <HeaderAvatarBefore className="header__avatar"
              {...{
                onMouseEnter: Store.instance.deviceState.isMobile.any ? null : () => {
                  this.setState({
                    avatar: true
                  })
                },
                onTouchStart: Store.instance.deviceState.isMobile.any ? () => {
                  this.setState({
                    avatar: true
                  })
                } : null
              }}
            />
          }
          <HeaderToggleSetting fill={this.state.setting ? '#0ac5e7' : '#3c8ce7'} className="header__toggle--setting"
            onMouseEnter={() => {
              this.setState({
                setting: true
              })
            }}
            onMouseLeave={() => {
              this.setState({
                setting: false
              })
            }}
            onClick={function () {
              Store.instance.appState.updateDrawerShow(true)
            }}
          />
        </FlexboxGrid>
      </FlexboxGrid>
    </div>
  }

}