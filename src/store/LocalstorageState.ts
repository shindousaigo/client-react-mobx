import { observable, action } from 'mobx';


export namespace Localstorage {
  export enum Keys {
    USER_INFO = 'user_info',
    SETTING_CONFIG = 'setting_config'
  }

  export class SettingConfig {
    autoLogin: boolean = true
    autoSystem: boolean = true
    defaultSystem: string = ''
  }
}


export default class LocalstorageState {

  @observable settingConfig: Localstorage.SettingConfig = JSON.parse(localStorage.getItem(Localstorage.Keys.SETTING_CONFIG)) || new Localstorage.SettingConfig
  @action updateSettingConfig(settingConfig: { [K: string]: Localstorage.SettingConfig[] } | Localstorage.SettingConfig) {
    if (settingConfig) {
      Object.assign(this.settingConfig, settingConfig)
      localStorage.setItem(Localstorage.Keys.SETTING_CONFIG, JSON.stringify(this.settingConfig))
    }
  }

  @observable userInfo = JSON.parse(localStorage.getItem(Localstorage.Keys.USER_INFO))
  @action updateUserInfo(userInfo) {
    if (userInfo) {
      this.userInfo = userInfo
      localStorage.setItem(Localstorage.Keys.USER_INFO, JSON.stringify(userInfo))
    } else {
      this.userInfo = undefined
      delete localStorage[Localstorage.Keys.USER_INFO]
    }
  }



}