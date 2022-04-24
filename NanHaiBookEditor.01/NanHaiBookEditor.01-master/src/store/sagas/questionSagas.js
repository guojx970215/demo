import { call, put, takeEvery, all } from 'redux-saga/effects';
import bookApi from '../../api/bookApi';

function* saveQuestionAsync({ payload }) {
  try {
    const res = yield call(bookApi.saveQuestion, payload);
    if (res.state) {
      console.log('Save Question Success');
    } else {
      console.log('Save Question Error');
    }
  } catch (e) {
    console.log('Save Question Error');
  }
}


export function* watchQuestionAsync() {
  yield takeEvery('saveQuestionAsync', saveQuestionAsync);
}
