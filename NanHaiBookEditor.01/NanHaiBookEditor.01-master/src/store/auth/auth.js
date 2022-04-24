const ns = 'auth';
const defaultState = {
  loggedin: false,
  token: null,
  errorMsg: '',
  bookList: [],
  bookTotal: 0,
  isLoading: true // 是否加载页面数据
};
export const authActionNames = {
  ACT_NAME_SET_LOGIN: `${ns}-SET_LOGIN`,
  ACT_NAME_SET_LOGOUT: `${ns}-SET_LOGOUT`,
  ACT_NAME_AUTH_ERROR: `${ns}-AUTH_ERROR`,
  ACT_NAME_AUTH_ERROR_MSG: `${ns}-AUTH_ERROR_MSG`,
  ACT_NAME_AUTH_SUCCESS: `${ns}-AUTH_SUCCESS`,
  ACT_NAME_HIDE_PROJECT: `${ns}-HIDE_PROJECT`,
  ACT_NAME_SHOW_PROJECT: `${ns}-SHOW_PROJECT`,
  ACT_NAME_GET_BOOKLIST_SUCCESS: `${ns}-GET_BOOKLIST_SUCCESS`,
  ACT_NAME_SHOW_LOGIN: `${ns}-SHOW_LOGIN`
};

const authStatus = (state = defaultState, { type, payload }) => {
  switch (type) {
    case authActionNames.ACT_NAME_SHOW_LOGIN:
      localStorage.setItem('showLogin', payload);
      return { ...state };
    case authActionNames.ACT_NAME_SET_LOGIN:
      localStorage.setItem('showproject', true);
      localStorage.removeItem('showLogin');
      localStorage.setItem('token', JSON.stringify(payload));
      return { ...state, loggedin: true, showProject: true, token: payload, bookList: [] };
    case authActionNames.ACT_NAME_SET_LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('book');
      localStorage.removeItem('isVertical');
      localStorage.removeItem('projectname');
      localStorage.removeItem("username");
      localStorage.setItem('showLogin', true);
      return { ...state, loggedin: false, token: payload };
    case authActionNames.ACT_NAME_AUTH_ERROR_MSG:
      return { ...state, errorMsg: payload };
    case authActionNames.ACT_NAME_AUTH_SUCCESS:
      return { ...state, isLoading: payload };
    case authActionNames.ACT_NAME_AUTH_ERROR:
      localStorage.removeItem('token');
      return { ...state, loggedin: false, token: null };
    case authActionNames.ACT_NAME_HIDE_PROJECT:
      localStorage.removeItem('showproject');
      return { ...state };
    case authActionNames.ACT_NAME_SHOW_PROJECT:
      localStorage.setItem('showproject', true);
      return { ...state };
    case authActionNames.ACT_NAME_GET_BOOKLIST_SUCCESS:
      return { ...state, bookList: payload.items, bookTotal: payload.total };
    default:
      return state;
  }
};

export const showLogin = (value) => ({
  type: authActionNames.ACT_NAME_SHOW_LOGIN,
  payload: value
});

export const actSetLogout = token => ({
  type: authActionNames.ACT_NAME_SET_LOGOUT,
  payload: token
});

export const actNewProject = payload => ({
  type: authActionNames.ACT_NAME_HIDE_PROJECT,
  payload: payload
});
export const showProject = () => ({
  type: authActionNames.ACT_NAME_SHOW_PROJECT
});

export const actSetLoading = payload => ({
  type: authActionNames.ACT_NAME_AUTH_SUCCESS,
  payload: payload
});

export const actGetBookList = payload => ({
  type: authActionNames.ACT_NAME_GET_BOOKLIST_SUCCESS,
  payload: payload
});

export default authStatus;
