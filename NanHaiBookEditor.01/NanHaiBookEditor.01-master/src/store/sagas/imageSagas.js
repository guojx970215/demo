import { call, put, takeEvery, all } from 'redux-saga/effects';
import { imageActionNames } from '../imageList/imageList';
import bookApi from '../../api/bookApi';

function* setImage({ payload }) {
  try {
    const res = yield call(bookApi.getMediaImagesList, payload);
    if (res.state) { 
      yield put({
        type: imageActionNames.ACT_NAME_GET_IMAGE_LIST,
        payload: res.result
      });
    } 
  } catch (e) {
    console.log(e)  
  }
}

export function* watchImageAsync() {
  yield takeEvery('setImage', setImage);
}
