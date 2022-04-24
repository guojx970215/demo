import {Book, BookListItem} from '@types';
import {get} from '@utils';

export type FetchBookListRequest = {
  userId: string;
  page: number;
  pageSize: number;
  searchKey?: string;
};

export type FetchBookListResponse = {
  errorList?: any[];
  msg: string;
  state?: boolean;
  result: {
    items: BookListItem[];
    maxPage: number;
    other?: any;
    total: number;
    state: boolean;
  };
};

export const fetchBookList = async (request: FetchBookListRequest) => {
  return await get<FetchBookListRequest, FetchBookListResponse>('/book', request);
};

export type FetchBookRequest = {
  bookId: string;
};

export type FetchBookResponse = {
  msg: string;
  state?: boolean;
  errorList?: any[];
  result: Book;
};

export const fetchBook = async (request: FetchBookRequest) => {
  return await get<{}, FetchBookResponse>('/book/' + request.bookId, {});
};
