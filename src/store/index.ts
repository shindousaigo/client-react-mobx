
import { observable } from 'mobx';
import ViewState from './ViewState';
import HttpState from './HttpState';

export default class Store {
  @observable viewState: ViewState = new ViewState;
  @observable httpState: HttpState = new HttpState;
}

