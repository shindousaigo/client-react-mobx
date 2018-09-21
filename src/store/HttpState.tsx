import * as React from 'react';
import { action, observable } from 'mobx';
import axios from 'axios'
import { AxiosInstance } from 'axios/index.d'
import { stringify } from 'query-string'
import jsonp = require('jsonp')
import { Notification } from "rsuite";
import Store from 'src/store';

export namespace Http {
  export interface Jsonp {
    jsonp(route: string, data?: any & { config: Config }): Promise<any>
  }
  export class Config {
    notification: boolean = true
    code: number = ResponseState.SUCCESS
    success: any
    error: any
  }
  export enum ResponseState {
    SUCCESS = 401
  }
  export enum Routes {
    USER_LOGIN = '/user/login',
    USER_GAMES = '/user/games',
    USER_CHANGE = '/user/change',
    USER_MENUS = '/user/menus'
  }
  export type ConfigFH = any // { [key: string]: Config[] } | Config
  export const CONFIG: ConfigFH = new Config
}

export default class HttpState {

  private server = 'http://172.16.3.144:7011/api/v1.0'
  private delay = (microTime = 750) => {
    return new Promise(resolve => {
      setTimeout(function () {
        resolve()
      }, microTime)
    })
  }
  private getNotificationConfig(color, message) {
    return {
      title: <span style={{
        color,
        fontWeight: 600
      }}>{message}</span>,
      placement: 'topLeft'
    }
  }
  private responseSuccess = (res, config: Http.ConfigFH = Http.CONFIG) => {
    if (res.code === config.code) {
      config.success && config.success.apply(this, [res])
      config.notification && Notification.success(this.getNotificationConfig('#4caf50', res.message))
    } else {
      config.error && config.error.apply(this, [res])
      config.notification && Notification.error(this.getNotificationConfig('#f44336', res.message))
      if (res.code === 101) { // 登录过期
        this.userLogin(null, {
          notification: false
        })
      }
    }
  }
  private responseError = (err) => {
    console.log(err)
  }

  private axiosInstance: AxiosInstance & Http.Jsonp
  private axiosInstantiation() {
    this.axiosInstance = Object.assign(
      axios.create({
        baseURL: this.server
      }),
      {
        jsonp: (route, data: { config: Http.Config } & any) => {
          let config: Http.Config = data.config ? Object.assign({}, Http.CONFIG, data.config) : Http.CONFIG
          return new Promise((resolve, reject) => {
            jsonp(this.server + route, {
              param: (function () {
                if (Object.keys(data).length === 1) {
                  data = { _: Date.now() }
                }
                return stringify(data)
              })() + '&callback'
            }, (err, data) => {
              if (err) {
                this.responseError(err)
                reject(null)
              } else {
                this.responseSuccess(data, config)
                resolve(data)
              }
            })
          })
        }
      }
    )
    this.axiosInstance.interceptors.response.use((res) => {
      this.responseSuccess(res)
      return res
    }, (err) => {
      this.responseError(err)
    })
  }
  constructor() {
    this.axiosInstantiation()
  }

  @observable isLogining: boolean = false
  @action userLogin(loginData?, config?: Http.ConfigFH) {
    this.isLogining = true
    let userName, password

    if (loginData) {
      userName = loginData.userName
      password = md5(loginData.password)
    } else {
      userName = Store.instance.localstorageState.userInfo.userName
      password = Store.instance.localstorageState.userInfo.password
    }

    let res = this.axiosInstance.jsonp(Http.Routes.USER_LOGIN, {
      userName, password: password, language: 'CHS', config: Object.assign({
        code: 301,
        success: () => {
          Store.instance.appState.updateIsLogin(true)
          loginData && Store.instance.localstorageState.updateUserInfo({
            userName,
            password
          })
          Store.instance.httpState.checkSystem()
        }
      }, config ? config : {}),
    })
    Promise.all([
      this.delay(),
      new Promise(async function (resolve) {
        await res
        resolve()
      })
    ]).then(() => {
      this.isLogining = false
    })
    return res
  }

  @action checkSystem() {
    let res = this.axiosInstance.jsonp(Http.Routes.USER_GAMES, {
      config: {
        notification: false,
        success: (res) => {
          let list: { systemId: number, systemName: string, gameId: number, mainGameId: number, GameName: string }[] = res.state
          let map = new Map
          list.forEach(item => {
            let name = item.systemName
            if (map.has(name)) {
              map.set(name, Array.prototype.concat(map.get(name), item))
            } else {
              map.set(name, [item])
            }
          })
          Store.instance.appState.availableSystem = map
        }
      }
    })
    return res
  }

  @action checkMenu({ systemId, gameId, index, treeList }: { treeList: any, systemId: number, gameId: number, systemName: string, index: number }) {
    this.axiosInstance.jsonp(Http.Routes.USER_CHANGE, {
      systemId, gameId,
      config: {
        code: 303,
        notification: false,
        success: () => {
          this.axiosInstance.jsonp(Http.Routes.USER_MENUS, {
            config: {
              notification: false,
              success: (res) => {
                if (res.state.length) {
                  res.state.forEach((val, key, arr) => {
                    arr[key]['label'] = val.menuName
                    arr[key]['value'] = false
                    arr[key]['expand'] = false
                    if (val.childrenMenu) {
                      (val.childrenMenu as any[]).forEach((val, key, arr) => {
                        arr[key]['label'] = val.menuName
                        arr[key]['value'] = false
                        arr[key]['expand'] = false
                        arr[key]['isLast'] = true
                      });
                      arr[key]['children'] = val.childrenMenu
                    }
                  })
                  treeList[index]['children'] = res.state
                } else {
                  treeList[index]['expand'] = true
                  treeList[index]['children'] = [
                    { label: '...', value: false }
                  ]
                }
                Store.instance.appState.updateAvailableSystemTree(treeList)
              }
            }
          })
        }
      }
    })
  }


}