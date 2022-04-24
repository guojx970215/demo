import { call, put, takeEvery, all } from 'redux-saga/effects';
import bookApi from '../../api/bookApi';
import { authActionNames } from '../auth/auth';
import { actionNames } from '../bookPages/actions';
import { message, Button, notification } from 'antd';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

import { parseQuestionGroup, parseQuestionDom } from '../../components/InteractiveQuestionMenu/QuestionForm/QuestionForm.tsx';

export function* saveBooksAsync({ payload }) {
  // 保存字典数组
  // 保存题型数组
  let dictionaries = [],
    questions = [],
    textHtmlStr = '';
  payload.pages.forEach((page) => {
    page.elements.forEach((element) => {
      if (element.type === 'TextBox') {
        textHtmlStr = textHtmlStr + element.content[0].value;
      }
      if (element.type === 'QuestionGroup') {
        const questionsData = parseQuestionGroup(element.content[0].value);
        questionsData.forEach((question, index) => {
          question.questionId = element.id + "-" + index;
        })
        questions.push(...questionsData);
      } else if (element.type === 'NewChoiceQuestion') {
        const questionData = parseQuestionDom(element.content[0].value);
        questionData.questionId = element.id;
        questions.push(questionData);
      }
    });
  });

  const divDom = document.createElement('div');
  divDom.innerHTML = textHtmlStr;

  const dictDoms = divDom.querySelectorAll('a.dict-content');

  for (let i = 0; i < dictDoms.length; i++) {
    if (dictionaries.length === 0 || dictDoms[i].getAttribute('id') !== dictionaries[dictionaries.length - 1].id) {
      let dictData = dictDoms[i].getAttribute('dict-data');
      dictData = Utf8.stringify(Base64.parse(dictData));
      dictData = JSON.parse(dictData);

      let dict = { dictImage: {}, dictAudio: {} };
      dict.id = dictDoms[i].getAttribute('id');
      dict.dictImage = dictData.dictImage;
      dict.dictAudio = dictData.dictAudio;

      dictionaries.push(dict);
    }
  }

  payload.config.dictionaries = dictionaries;

  try {
    const res = yield call(bookApi.savePage, payload);
    if (res) {
      if (res.state) {
        message.success('Save Success');

        questions.length > 0 && bookApi.saveQuestion(payload.id, questions);
      } else {
        const key = `open${Date.now()}`;
        const onClose = () => {
          window.location.reload();
        };
        notification.error({
          message: 'Save failed!!!',
          description: res.msg,
          key,
          onClose: onClose,
        });
      }
    } else {
      message.error('Save Error');
    }
  } catch (e) {
    message.error('Save Error');
  }
}

export function* getBooksAsync({ payload }) {
  try {
    const res = yield call(bookApi.getPage, payload);
    if (res.state) {
      yield put({
        type: authActionNames.ACT_NAME_AUTH_SUCCESS,
        payload: false,
      });
      yield put({
        type: actionNames.ACT_NAME_GET_PAGE_DATA,
        payload: res.result,
      });

      let data = {
        id: res.result.id,
        bookName: res.result.bookName,
        bookCode: res.result.bookCode,
      };
      localStorage.setItem('book', JSON.stringify(data));
      localStorage.setItem('isVertical', res.result.config.isVertical);
    } else {
      yield put({
        type: authActionNames.ACT_NAME_AUTH_SUCCESS,
        payload: false,
      });
    }
  } catch (e) {}
}

export function* getBooksListAsync({ payload }) {
  try {
    const res = yield call(bookApi.getPageList, payload);
    if (res.state) {
      yield put({
        type: authActionNames.ACT_NAME_GET_BOOKLIST_SUCCESS,
        payload: res.result,
      });
    } else {
      message.error('Get Books Error');
    }
  } catch (e) {
    message.error('Get Books Error');
  }
}

export function* delBooksAsync({ payload }) {
  try {
    const res = yield call(bookApi.delPage, payload);
    console.log(res);
    if (res.state) {
      message.success('Delete Success');
    } else {
      message.error('Delete Error');
    }
  } catch (e) {
    message.error('Delete Error');
  }
}

/**
 *
 * @param payload {dictId:'', content:'', dictImage:{}, dictAudio:{}}
 * @param callback
 * @returns {Generator<*, void, ?>}
 */
export function* saveElementDict({ payload, callback }) {
  const str = JSON.stringify(payload);

  let formData = new FormData();
  formData.append('id', payload.dictId);
  formData.append('content', str);

  const response = yield fetch(
    'http://bookeditor.bigbug.tech/index/dict/create',
    {
      method: 'post',
      body: formData,
    }
  );

  const data = yield response.json();
  if (callback) {
    callback(data);
  }
}

/**
 *
 * @param payload {dictId:''}
 * @param callback
 * @returns {Generator<*, void, ?>}
 */
export function* loadElementDict({ payload, callback }) {
  const response = yield fetch(
    `http://bookeditor.bigbug.tech/index/dict/find?id=${payload.dictId}`
  );
  const json = yield response.json();

  if (callback) {
    let data = null;

    if (json.data) {
      data = JSON.parse(json.data.content);
    }

    callback(data);
  }
}

export function* watchBooksAsync() {
  yield takeEvery('saveBooksAsync', saveBooksAsync);
  yield takeEvery('getBooksAsync', getBooksAsync);
  yield takeEvery('delBooksAsync', delBooksAsync);
  yield takeEvery('getBooksListAsync', getBooksListAsync);
  yield takeEvery('book/saveElementDict', saveElementDict);
  yield takeEvery('book/loadElementDict', loadElementDict);
}
