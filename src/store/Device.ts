import { observable, action } from 'mobx';

namespace Device {
  enum ViewWidth {
    /** extreme small */
    XS = 480
  }
  export enum ViewMode {
    /** extreme small */
    XS = 'xs',
    ELSE = 'else'
  }
  export class State {

    @observable viewMode
    @observable isMobile = require('ismobilejs')

    /**
     * 上一个视图模式
     */
    private lastViewMode


    constructor() {
      this.onResize()
      addEventListener("resize", this.onResize)
    }

    @action private updateViewMode = (viewMode) => {
      this.viewMode = viewMode
      this.lastViewMode = viewMode
    }

    private onResize = () => {
      if (innerWidth < ViewWidth.XS) {
        if (this.lastViewMode !== ViewMode.XS) {
          this.updateViewMode(ViewMode.XS)
        }
      } else {
        if (this.lastViewMode !== ViewMode.ELSE) {
          this.updateViewMode(ViewMode.ELSE)
        }
      }
    }


  }

}


export default Device