import {en, zh} from '@i18n';
import {RootStore} from '@stores';
import {LangType} from '@types';
import {makeAutoObservable} from 'mobx';

export class LangStore {
  rootStore: RootStore;

  current: LangType = 'zh';

  get trans(): typeof zh | typeof en {
    return this.current === 'zh' ? en : zh;
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);
  }

  setCurrent(current: LangType) {
    this.current = current;
  }

  toggleCurrent() {
    if (this.current === 'zh') {
      this.current = 'en';
    } else {
      this.current = 'zh';
    }
  }
}
