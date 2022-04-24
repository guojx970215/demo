import {fetchBookList} from '@api';
import {BookListItem} from '@types';
import {makeAutoObservable} from 'mobx';
import {RootStore} from './RootStore';

export class BookListStore {
  rootStore: RootStore;

  pageNumber: number = 1;
  pageSize: number = 8;
  searchKey?: string = '';
  total: number = 0;

  data: BookListItem[] = [];
  status: string = 'loading';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);
  }

  get isLoading() {
    return this.status === 'loading';
  }

  async init() {
    await this.fetchBookListByPage(1);
  }

  clear() {
    this.data = [];
    this.pageNumber = 1;
    this.pageSize = 10;
    this.searchKey = '';
  }

  async fetchBookListByPage(page: number) {
    this.setStatus('loading');
    const {pageSize, searchKey} = this;
    const userId = this.rootStore.UserStore.user?.userId;
    if (userId) {
      const data = await fetchBookList({userId, page, pageSize, searchKey});
      this.setData(data.result.items);
      this.setPageNumber(page);
      this.setTotal(data.result.total);
      this.setStatus('success');
    }
  }

  setData(data: BookListItem[]) {
    this.data = data;
  }

  setStatus(status: string) {
    this.status = status;
  }

  setPageNumber(pageNumber: number) {
    this.pageNumber = pageNumber;
  }

  setPageSize(pageSize: number) {
    this.pageNumber = pageSize;
  }

  setSearchKey(key: string) {
    this.searchKey = key;
  }

  setTotal(total: number) {
    this.total = total;
  }
}
