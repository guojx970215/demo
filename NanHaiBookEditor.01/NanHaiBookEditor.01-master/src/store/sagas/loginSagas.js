import { call, put, takeEvery, all } from 'redux-saga/effects';
import { authActionNames } from '../auth/auth';
import bookApi from '../../api/bookApi';

function* setLogin({ payload }) {
  try {
    const res = yield call(bookApi.login, payload);
    if (res.loginResult && res.loginResult.success) {
      localStorage.setItem("username", payload.username);
      yield put({
        type: authActionNames.ACT_NAME_SET_LOGIN,
        payload: res
      });
    }else {
      yield put({
        type: authActionNames.ACT_NAME_AUTH_ERROR_MSG,
        payload: res.message
      });
    }
  } catch (e) {
    yield put({
      type: authActionNames.ACT_NAME_AUTH_ERROR,
      payload: null
    });
  }
}


export function* watchLoginAsync() {
  yield takeEvery('setLogin', setLogin);
}
