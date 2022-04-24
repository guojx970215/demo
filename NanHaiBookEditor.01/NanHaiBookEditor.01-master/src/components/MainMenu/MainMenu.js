import React, { useState, useRef, useEffect } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { Modal, message, Input, notification } from 'antd';
import nanoid from 'nanoid';
import styles from './MainMenu.module.css';
import PageMenu from '../PageMenu/PageMenu';
import ElementsMenu from '../ElementsMenu/ElementsMenu';
import HomeMenu from '../HomeMenu/HomeMenu';
import { actRevoke, actRollBack } from '../../store/bookPages/actions';
import { showLogin, showProject, actSetLogout } from '../../store/auth/auth';
import api from '../../api/bookApi';
import InteractiveQuestionMenu from '../InteractiveQuestionMenu/InteractiveQuestionMenu';
import PageTemplateMenu from '../PageTemplateMenu/PageTemplateMenu';
import UploadMenu from '../TextUpload/UploadMenu';
import OtherMenu from '../OtherMenu/OtherMenu';
import revoke from './revoke.png';
import rollBack from './rollBack.png';
const { confirm } = Modal;

const openNotification = () => {
  const args = {
    message: '您的账号已在其它处登录',
    description: '当前项目已保存 , 如果非本人登录 , 请修改密码!',
    duration: 0,
  };
  notification.open(args);
};

const MainMenu = (props) => {
  const {
    trans,
    bookPages,
    actRevoke,
    actRollBack,
    authStatus,
    showLogin,
    showProject,
    actSetLogout,
    actSavePage,
  } = props;

  const initMenuList = [
    {
      id: 'home',
      selected: true,
    },
    {
      id: 'page',
    },
    /*{
      id: 'pageTemplate'
    },*/
    {
      id: 'elements',
      //selected: true
      //selected: true
    },
    /*{
      id: 'eletmentsTemplate'
    },*/
    {
      id: 'interactiveQuestion',
    },
    {
      id: 'tools',
    },
    /*{
      id: 'upload'
    }*/
  ];
  const [menuList, setMenuList] = useState(initMenuList);

  const mainMenuItemOnClick = (event, menuId, idx) => {
    let tmpMenuList = menuList.slice();
    tmpMenuList.forEach((item) => (item.selected = false));
    tmpMenuList[idx].selected = true;
    setMenuList(tmpMenuList);
  };
  const showSubMenu = (menuList) => {
    let selectedMenu = menuList.find((item) => item.selected);
    switch (selectedMenu.id) {
      case 'page':
        return <PageMenu />;
      case 'elements':
        return <ElementsMenu />;
      case 'home':
        return <HomeMenu />;
      case 'interactiveQuestion':
        return <InteractiveQuestionMenu />;
      case 'pageTemplate':
        return <PageTemplateMenu />;
      case 'upload':
        return <UploadMenu />;
      case 'tools':
        return <OtherMenu />;
      default:
        return <div className="placeHolder" />;
    }
  };
  const listItem = menuList.map((item, idx) => (
    <li
      key={item.id}
      onClick={(e) => mainMenuItemOnClick(e, item.id, idx)}
      className={item.selected ? styles.selected : ''}
    >
      {trans.MainMenu[item.id]}
    </li>
  ));

  const switchPro = () => {
    const bookName =
      localStorage.getItem('book') &&
      JSON.parse(localStorage.getItem('book')).bookName;
    const bookCode =
      localStorage.getItem('book') &&
      JSON.parse(localStorage.getItem('book')).bookCode;
    if (bookName) {
      actSavePage(bookPages, bookName, bookCode);
    }
    showProject();
  };

  const showProjectClick = () => {
    confirm({
      title: '是否保存当前工程?',
      onOk() {
        switchPro();
      },
      onCancel() {
        showProject();
      },
    });
  };

  const checkStatusRef = useRef();
  const controller = useRef();
  const autoSaveRef = useRef();

  // interval 里无法获取最新的数据, 使用ref来保存最新数据
  const bookPagesRef = useRef();
  useEffect(() => {
    bookPagesRef.current = bookPages;
  }, [bookPages]);

  useEffect(() => {
    // 5分钟自动保存
    autoSaveRef.current = setInterval(() => {
      if (localStorage.getItem('token')) {
        saveBook();
      }
    }, 5 * 60 * 1000);

    // eslint-disable-next-line no-undef
    if (process.env.NODE_ENV !== 'development') {
      // 判断是否已经掉线
      checkStatusRef.current = setInterval(() => {
        // 如果上一次请求还未完成则终止上次请求
        if (controller.current) {
          controller.current.abort();
        }

        if (localStorage.getItem('onFetch') === 'true') return;

        if (authStatus.loggedin || localStorage.getItem('token')) {
          controller.current = new AbortController();
          const { signal } = controller.current;

          const id = api.getUserId();

          fetch(
            '/api/account/check',
            {
              signal,
              method: 'post',
              mode: 'cors',
              body: JSON.stringify({
                userId: id,
                token: api.getToken(),
              }),
              headers: {
                'Content-Type': 'application/json',
                Authorization: id,
              },
            },
            { credentials: 'include' }
          )
            .then((res) => res.json())
            .then((response) => {
              if (response.code === 1) {
                openNotification();
                logOut();
              }
            });
        }
      }, 1000);
    }
    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }

      if (checkStatusRef.current) {
        clearInterval(checkStatusRef.current);
      }
    };
  }, []);

  const saveBook = () => {
    const bookName =
      localStorage.getItem('book') &&
      JSON.parse(localStorage.getItem('book')).bookName;
    const bookCode =
      localStorage.getItem('book') &&
      JSON.parse(localStorage.getItem('book')).bookCode;
    if (bookName) {
      actSavePage(bookPagesRef.current, bookName, bookCode);
    }
  };

  const logOut = () => {
    saveBook();
    actSetLogout();
  };

  const logOutClick = () => {
    confirm({
      title: '是否保存当前工程?',
      onOk() {
        logOut();
      },
      onCancel() {
        actSetLogout();
      },
    });
  };

  let user;
  try {
    user =
      localStorage.getItem('token') &&
      JSON.parse(localStorage.getItem('token')).loginResult.userInfoDto;
  } catch (e) {}

  return (
    <div className={styles.menuPane}>
      <ul className={styles.tabContainer}>
        {listItem}
        <div className={styles.userInfo}>
          {user && (
            <span className={styles.userInfoName}>
              {trans.MainMenu.welcome}，{user.name}
            </span>
          )}
          {authStatus.loggedin || localStorage.getItem('token') ? (
            <p className={styles.userInfoBottom}>
              <span className={styles.loginOut} onClick={(e) => logOutClick()}>
                {trans.MainMenu.loginOut}
              </span>
              <span onClick={(e) => showProjectClick()}>
                {trans.MainMenu.switchProject}
              </span>
            </p>
          ) : (
            <p className={styles.userInfoBottom}>
              <span onClick={(e) => showLogin(true)}>
                {trans.MainMenu.login}
              </span>
            </p>
          )}
        </div>
      </ul>
      <div className={styles.opt}>
        <img
          src={revoke}
          onClick={(e) => {
            if (bookPages.past && bookPages.past.length > 0) {
              actRevoke(e);
            }
          }}
          style={{
            opacity: bookPages.past && bookPages.past.length > 0 ? 1 : 0.3,
          }}
        />
        <img
          src={rollBack}
          onClick={(e) => {
            if (bookPages.future && bookPages.future.length > 0) {
              actRollBack(e);
            }
          }}
          style={{
            opacity: bookPages.future && bookPages.future.length > 0 ? 1 : 0.3,
          }}
        />
      </div>
      <div className={styles.menuContent}>{showSubMenu(menuList)}</div>
    </div>
  );
};

const mapStateToProps = ({ trans, authStatus, bookPages }) => ({
  trans,
  authStatus,
  bookPages,
});

const mapDispatchToProps = (dispatch) => ({
  actRevoke: () => {
    dispatch(actRevoke());
  },
  actRollBack: () => {
    dispatch(actRollBack());
  },
  showLogin: (value) => {
    dispatch(showLogin(value));
  },
  showProject: () => {
    dispatch(showProject());
  },
  actSetLogout: () => {
    dispatch(actSetLogout(null));
  },
  actSavePage: (bookPages, bookname, bookCode) => {
    const { present } = bookPages;
    const { userId } = JSON.parse(
      localStorage.getItem('token')
    ).loginResult.userInfoDto;
    const id =
      localStorage.getItem('book') &&
      JSON.parse(localStorage.getItem('book')).id;
    let bookid = nanoid(24);
    let data = {
      id: id ? id : bookid,
      bookName: bookname || '',
      bookCode: bookCode || '',
      userId: userId,
      pages: present.pages,
      config: present.config,
      paginate: present.paginate,
    };
    if (!id) {
      let data = {
        id: bookid,
        bookName: bookname,
        bookCode: bookCode,
      };
      localStorage.setItem('book', JSON.stringify(data));
    }
    dispatch({
      type: 'saveBooksAsync',
      payload: data,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
