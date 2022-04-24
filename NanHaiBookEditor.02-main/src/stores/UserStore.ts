import {login} from '@api';
import {UserInfoDto} from '@types';
import {makeAutoObservable} from 'mobx';
import {RootStore} from './RootStore';

export class UserStore {
  rootStore: RootStore;

  user?: UserInfoDto;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    const userInfo = window.localStorage.getItem('user');
    if (userInfo) this.user = JSON.parse(userInfo);

    makeAutoObservable(this);
  }

  async login(username: string, password: string, onSuccess: () => void) {
    const response = await login({username, password});
    if (response.loginResult.success) {
      this.setUser(response.loginResult.userInfoDto);
      window.localStorage.setItem('user', JSON.stringify(this.user));
      onSuccess();
    }
  }

  setUser(user: UserInfoDto) {
    this.user = user;
  }
}
