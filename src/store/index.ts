
import { observable } from 'mobx';
import Device from 'src/store/Device';
import HttpState from './HttpState';
import AppState from 'src/store/AppState';
import LocalstorageState from 'src/store/LocalstorageState';

export default class Store {
  static _ins: Store
  constructor() {
    Store._ins = this
  }
  static get instance() {
    return this._ins
  }

  @observable appState: AppState = new AppState;
  @observable deviceState: Device.State = new Device.State;
  @observable httpState: HttpState = new HttpState;
  @observable localstorageState: LocalstorageState = new LocalstorageState;
}

