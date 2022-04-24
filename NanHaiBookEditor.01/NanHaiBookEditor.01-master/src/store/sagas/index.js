import { watchBooksAsync } from './bookSagas';
import { watchLoginAsync } from './loginSagas';
import { watchImageAsync } from './imageSagas';
import { watchMusicAsync } from './musicSagas';

import { all } from 'redux-saga/effects';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([watchBooksAsync(), watchLoginAsync(), watchImageAsync(),watchMusicAsync()]);
}