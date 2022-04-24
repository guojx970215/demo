import {BookListStore} from './BookListStore';
import {BookStore} from './BookStore';
import {LangStore} from './LangStore';
import {UserStore} from './UserStore';

export class RootStore {
  UserStore = new UserStore(this);
  BookListStore = new BookListStore(this);
  BookStore = new BookStore(this);
  LangStore = new LangStore(this);
}
