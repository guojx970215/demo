import { call, put, takeEvery, all } from 'redux-saga/effects';
import { musicActionNames } from '../music/music';
import bookApi from '../../api/bookApi';

function* setMusic({ payload }) {
  try {
    const res = yield call(bookApi.getMediaAudios, payload);
    if (res) {
      yield put({
        type: musicActionNames.ACT_NAME_SET_MUSIC_LIST,
        payload: res
      });
    }
  } catch (e) {
    /*yield put({
      type: musicActionNames.ACT_NAME_AUTH_ERROR,
      payload: null
    });*/
  }
}
function* addMusic({ payload }) {
  try {
      yield put({
        type: musicActionNames.ACT_NAME_ADD_MUSIC,
        payload: payload
      });
  } catch (e) {
    /*yield put({
      type: musicActionNames.ACT_NAME_AUTH_ERROR,
      payload: null
    });*/
  }
}

export function* watchMusicAsync() {
  yield takeEvery('setMusic', setMusic);
  yield takeEvery('addMusic', addMusic);
}
