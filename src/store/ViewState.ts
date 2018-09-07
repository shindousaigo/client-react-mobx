import { observable, action } from 'mobx';

export namespace View {
  export interface ViewStateProps {
    width: number
  }
  export enum ViewModeWidth {
    /** extreme small */
    XS = 480
  }
  export enum ViewMode {
    /** extreme small */
    XS = 'xs',
    ELSE = 'else'
  }
}

export default class ViewState {

  constructor() {
    this.onResize()
    addEventListener("resize", this.onResize)
  }

  @observable viewMode

  @action updateViewMode = (viewMode) => {
    console.info(viewMode)
    this.viewMode = viewMode
    this.lastViewMode = viewMode
  }

  /**
   * 上一个视图模式
   */
  lastViewMode

  onResize = () => {
    if (innerWidth < View.ViewModeWidth.XS) {
      if (this.lastViewMode !== View.ViewMode.XS) {
        this.updateViewMode(View.ViewMode.XS)
      }
    } else {
      if (this.lastViewMode !== View.ViewMode.ELSE) {
        this.updateViewMode(View.ViewMode.ELSE)
      }
    }
  }


}