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
    jsonp(route: string, data: object): Promise<any>
  }
  export enum ResponseState {
    SUCCESS = 301
  }
  export enum Routes {
    USER_LOGIN = '/user/login'
  }
}

export default class HttpState {

  server = 'http://172.16.3.144:7011/api/v1.0'
  delay = (microTime = 750) => {
    return new Promise(resolve => {
      setTimeout(function () {
        resolve()
      }, microTime)
    })
  }
  responseSuccess = (res) => {
    let { success, error } = Notification
    let config = (color) => ({
      title: <span style={{
        color,
        fontWeight: 600
      }}>{res.message}</span>,
      placement: 'topLeft'
    })
    if (res.code !== Http.ResponseState.SUCCESS) {
      error(config('#f44336'))
    } else {
      success(config('#4caf50'))
    }
  }
  responseError = (err) => {
    console.log(err)
  }
  axiosInstance: AxiosInstance & Http.Jsonp
  axiosInstantiation() {
    this.axiosInstance = Object.assign(
      axios.create({
        baseURL: this.server
      }),
      {
        jsonp: (route, data) => {
          return new Promise((resolve, reject) => {
            jsonp(this.server + route, {
              param: stringify(data) + '&callback'
            }, (err, data) => {
              if (err) {
                this.responseError(err)
                reject(err)
              } else {
                this.responseSuccess(data)
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
  @action userLogin({ userName, password }) {
    this.isLogining = true
    var res = this.axiosInstance.jsonp(Http.Routes.USER_LOGIN, {
      userName, password: md5(password), language: 'CHS'
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
}