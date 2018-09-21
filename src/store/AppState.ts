import { observable, action, intercept, IValueWillChange } from 'mobx';
import Store from 'src/store';



export default class AppState {

  constructor() {
    this.intercept_availableSystem()
  }

  intercept_availableSystem() {
    intercept(this, 'availableSystem', (change: IValueWillChange<Map<any, any>>) => {
      let availableSystemTree = []
      let availableSystemSelect = []
      change.newValue.forEach((val, key) => {
        availableSystemTree.push({
          source: val,
          label: key,
          value: false,
          expand: false,
          hasData: false,
          children: [{
            label: 'Loader'
          }]
        })
        availableSystemSelect.push({
          label: key,
          value: key
        })
        if (Store.instance.localstorageState.settingConfig.autoSystem && !Store.instance.localstorageState.settingConfig.defaultSystem) {
          Store.instance.localstorageState.updateSettingConfig({
            defaultSystem: key
          })
        }
      })
      this.updateAvailableSystemTree(availableSystemTree)
      this.updateAvailableSystemSelect(availableSystemSelect)
      return change
    })
  }

  @observable isReload = false

  @observable isLogin = false
  @action updateIsLogin(status) {
    this.isLogin = status
  }

  @observable drawerShow = false
  @action updateDrawerShow(status) {
    this.drawerShow = status
  }

  @observable availableSystem: Map<any, any>
  @observable availableSystemTree: any[]
  @action updateAvailableSystemTree(data) {
    this.availableSystemTree = data
  }
  @observable availableSystemSelect: any[]
  @action updateAvailableSystemSelect(data) {
    this.availableSystemSelect = data
  }
}
