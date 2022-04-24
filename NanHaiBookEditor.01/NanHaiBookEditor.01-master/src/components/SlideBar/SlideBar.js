import React from 'react';
import { connect } from 'react-redux';
import { Switch, message, Spin, Button, Icon, Tabs, Modal, Input } from 'antd';
import './SlideBar.css';
import { zoomIn, zoomOut } from '../../store/zoomLevel/zoomLevel';
import {
  actIsVertical,
  actSetPinyin,
  actSetTradiSimp,
  actAudioChange,
} from '../../store/bookPages/actions';
import nanoid from 'nanoid';
import { rulerChange } from '../../store/ruler/ruler';
import { gridChange } from '../../store/grid/grid';
import { actToggleSlideBar } from '../../store/slideBar/slider';
import sub from './sub.png';
import add from './add.png';
import Home_Review from './Home_Review.png';
import Home_Save from './Home_Save.png';
import api from '../../api/bookApi';
import PageElementsList from '../PageElementsList/index3';

class SlideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedLands: true,
      checkedPotrial: false,
      loading: false,
      show: false,
      bookname: '',
      bookcode: '',
      showRelog: false,
      password: undefined,
    };
    SlideBar._this = this;
  }

  setOpen = () => {
    let { authStatus } = this.props;
    if (authStatus.loggedin || localStorage.getItem('token')) {
      const bookName =
        localStorage.getItem('book') &&
        JSON.parse(localStorage.getItem('book')).bookName;
      const bookCode =
        localStorage.getItem('book') &&
        JSON.parse(localStorage.getItem('book')).bookCode;

      this.setState({
        show: true,
        bookname: bookName ? bookName : '',
        bookcode: bookCode ? bookCode : '',
      });
    } else {
      message.info('请先登录');
    }
  };

  setClose = () => {
    this.setState({
      show: false,
    });
  };

  actSave = (bookPages, bookname, bookcode) => {
    // 判断是否已被登入
    // api
    //   .ifExpired({ userId: api.getUserId(), token: api.getToken() })
    //   .then((res) => {
    //     if (res.code === 0) {
    this.props.actSavePage(bookPages, bookname, bookcode);
    setTimeout(() => {
      let book = JSON.parse(localStorage.getItem('book'));
      book.bookName = bookname;
      book.bookCode = bookcode;
      localStorage.setItem('book', JSON.stringify(book));
      this.setClose();
    }, 500);
    //   } else {
    //     this.setState({ showRelog: true });
    //   }
    // });
  };

  relogin = () => {
    api
      .login({
        username: localStorage.getItem('username'),
        password: this.state.password,
      })
      .then((res) => {
        if (res.loginResult && res.loginResult.success) {
          localStorage.setItem('token', JSON.stringify(res));

          this.props.actSavePage(this.props.bookPages, this.state.bookname, this.state.bookcode);
          setTimeout(() => {
            let book = JSON.parse(localStorage.getItem('book'));
            book.bookName = this.state.bookname;
            book.bookCode = this.state.bookcode;
            localStorage.setItem('book', JSON.stringify(book));
            this.setClose();
          }, 500);

          this.setState({ showRelog: false });
        }
      });
  };

  preview = () => {
    if (!localStorage.getItem('book')) {
      message.warning('请先保存工程');
      return;
    }
    let bookId = JSON.parse(localStorage.getItem('book')).id;
    this.setState({
      loading: true,
    });
    api.preview(bookId).then((res) => {
      if (res.state) {
        // res.result
        this.setState({
          loading: false,
        });
        window.open(res.result);
      } else {
        this.setState({
          loading: false,
        });
        message.error(res.message);
      }
    });
  };

  setBookName = (value) => {
    this.setState({ bookname: value });
  };

  setBookCode = (value) => {
    this.setState({ bookcode: value });
  };

  render() {
    const {
      trans,
      zoomIn,
      zoomOut,
      changeGird,
      rulerChange,
      bookPages,
      actSavePage,
      pinyinChange,
      audioChange,
      simpChange,
      actToggleSlideBar,
    } = this.props;
    const { present } = bookPages;
    const { config } = present || {};
    const isVertical = config.isVertical ? config.isVertical : false;

    const { zoomValue } = this.props.zoomLevel;
    const { simp, show } = this.props.slider;

    let rootClassName = '';
    if (show) {
      rootClassName = 'SlideBarBox show';
    } else {
      rootClassName = 'SlideBarBox hide';
    }

    return (
      <div className={rootClassName}>
        <div className="hide-slide-bar" onClick={() => actToggleSlideBar()}>
          {show ? <Icon type="right" /> : <Icon type="left" />}
        </div>
        <Modal
          visible={this.state.loading}
          closable={false}
          footer={null}
          maskClosable={null}
          className="spiningModal"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
          maskStyle={{
            background: 'rgba(0, 0, 0, 0.8)',
          }}
          bodyStyle={{ textAlign: 'center' }}
        >
          <Spin tip="Loading..."></Spin>
        </Modal>

        <Modal
          visible={this.state.showRelog}
          width={300}
          onOk={() => this.relogin()}
          onCancel={() => this.setState({ showRelog: false })}
          title={trans.HomeMenu.relog}
        >
          <div style={{ marginBottom: 8 }}>* 登陆已失效，请重新登陆</div>
          <Input
            value={this.state.password}
            onChange={({ target: { value } }) =>
              this.setState({ password: value })
            }
            placeholder="请重新输入密码："
            type="password"
          />
        </Modal>

        <Modal
          visible={this.state.show}
          width={300}
          onOk={() => {
            this.actSave(bookPages, this.state.bookname, this.state.bookcode);
          }}
          onCancel={() => {
            this.setClose();
          }}
          title={trans.HomeMenu.save}
        >
          <span>工程名称：</span>
          <Input
            value={this.state.bookname}
            onChange={({ target: { value } }) => this.setBookName(value)}
            placeholder="请输入工程名称"
          />
          <div style={{ marginTop: 12 }}>book code：</div>
          <Input
            value={this.state.bookcode}
            onChange={({ target: { value } }) => this.setBookCode(value)}
            placeholder="请输入 book code"
          />
        </Modal>

        <Tabs type="card" animated={false}>
          <Tabs.TabPane
            tab={trans.SlideBar.setting}
            key="1"
            style={{ marginRight: 0 }}
          >
            <div className="SlideBarItem">
              <label>{trans.SlideBar.pinyin}</label>
              <Switch
                // defaultChecked
                checked={bookPages.present.config.pinyin}
                checkedChildren={trans.SlideBar.open}
                unCheckedChildren={trans.SlideBar.close}
                onChange={pinyinChange}
              />
            </div>
            <div className="SlideBarItem">
              <label>{trans.SlideBar.audio}</label>
              <Switch
                // defaultChecked
                checked={bookPages.present.config.audio}
                checkedChildren={trans.SlideBar.open}
                unCheckedChildren={trans.SlideBar.close}
                onChange={audioChange}
              />
            </div>
            <div className="SlideBarItem">
              <label>{trans.SlideBar.simp}</label>
              <Switch
                checked={bookPages.present.config.simple}
                // checked={simp}
                // defaultChecked
                checkedChildren={trans.SlideBar.open}
                unCheckedChildren={trans.SlideBar.close}
                onChange={simpChange}
              />
            </div>
            <div className="SlideBarItem">
              <label>{trans.SlideBar.tradi}</label>
              <Switch
                // checked={!simp}
                checked={!bookPages.present.config.simple}
                checkedChildren={trans.SlideBar.open}
                unCheckedChildren={trans.SlideBar.close}
                onChange={(val) => simpChange(!val)}
              />
            </div>
            <div className="SlideBarItem">
              <label>{trans.SlideBar.grid}</label>
              <Switch
                defaultChecked
                checkedChildren={trans.SlideBar.open}
                unCheckedChildren={trans.SlideBar.close}
                onChange={changeGird}
              />
            </div>
            <div className="SlideBarItem">
              <label>{trans.SlideBar.ruler}</label>
              <Switch
                defaultChecked
                checkedChildren={trans.SlideBar.open}
                unCheckedChildren={trans.SlideBar.close}
                onChange={rulerChange}
              />
            </div>
            <div className="SlideBarItem">
              <label>{trans.HomeMenu.preview}</label>
              <img
                src={Home_Review}
                style={{ width: '36px', height: 'auto' }}
                onClick={(e) => this.preview(e)}
              />
            </div>
            <div className="SlideBarItem">
              <label>{trans.HomeMenu.save}</label>
              <img
                src={Home_Save}
                style={{ width: '36px', height: 'auto' }}
                onClick={(e) => this.setOpen(e)}
              />
            </div>
            <div className="SlideBarItem">
              <img src={sub} onClick={(e) => zoomOut(e)} />
              <span className="size">{zoomValue}%</span>
              <img src={add} onClick={(e) => zoomIn(e)} />
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={trans.SlideBar.elements}
            key="2"
            style={{ padding: 0, marginRight: 0 }}
          >
            <PageElementsList setFocus={this.props.setFocus}></PageElementsList>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = ({
  trans,
  zoomLevel,
  bookPages,
  slider,
  authStatus,
}) => ({
  trans,
  zoomLevel,
  bookPages,
  slider,
  authStatus,
});

const mapDispatchToProps = (dispatch) => ({
  actToggleSlideBar: () => {
    dispatch(actToggleSlideBar());
  },
  actSavePage: (bookPages, bookname, bookcode) => {
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
      bookName: bookname ? bookname : '',
      bookCode: bookcode ? bookcode : '',
      userId: userId,
      pages: present.pages,
      config: {
        ...present.config,
        isVertical: localStorage.getItem('isVertical') === 'true',
      },
      paginate: present.paginate,
      // bookCode: present.bookCode
    };
    if (!id) {
      let data = {
        id: bookid,
        bookName: bookname,
        bookCode: bookcode,
      };
      localStorage.setItem('book', JSON.stringify(data));
    }
    dispatch({
      type: 'saveBooksAsync',
      payload: data,
    });
  },
  rulerChange: () => {
    dispatch(rulerChange());
  },
  zoomIn: () => {
    dispatch(zoomIn({}));
  },
  zoomOut: () => {
    dispatch(zoomOut({}));
  },
  changeGird: (val) => {
    dispatch(gridChange());
  },
  pinyinChange: (val) => {
    // dispatch(pinyinChange());
    dispatch(actSetPinyin(val));
  },
  simpChange: (val) => {
    // dispatch(simpChange());
    dispatch(actSetTradiSimp(val));
  },
  audioChange: (val) => {
    dispatch(actAudioChange(val));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SlideBar);
