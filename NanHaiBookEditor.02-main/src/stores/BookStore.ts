import {fetchBook} from '@api';
import {Book, ResourceStatus} from '@types';
import {makeAutoObservable} from 'mobx';
import {RootStore} from './RootStore';

export class BookStore {
  rootStore: RootStore;

  bookId: string = '';
  status: ResourceStatus = 'success';
  book?: Book = undefined;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);
  }

  get isSuccess() {
    return this.status === 'success';
  }

  get isLoading() {
    return this.status === 'loading';
  }

  get isError() {
    return this.status === 'error';
  }

  async init(bookId: string) {
    this.bookId = bookId;
    this.status === 'loading';
    const book = await fetchBook({bookId});
    this.setBook(book.result);
    this.setStatus(book.state === false ? 'error' : 'success');
  }

  clear() {
    this.bookId = '';
    this.book = undefined;
    this.status = 'success';
  }

  setBook(book?: Book) {
    this.book = book;
  }

  setStatus(status: ResourceStatus) {
    this.status = status;
  }
}
