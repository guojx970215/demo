import React from 'react';
import { connect } from 'react-redux';
import './PageLoading.css';
import api from '../../api/bookApi';
import { actSetLogout } from '../../store/auth/auth';
import {notification} from "antd";

class PageLoading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  openNotification = () => {
    const args = {
      message: '您的账号已在其它处登录',
      description: '如果非本人登录 , 请修改密码!',
      duration: 0,
    };
    notification.open(args);
  };

  render() {
    const { getPageData, actSetLogout } = this.props;
    const { isLoading, loggedin } = this.props.authStatus;
    if (isLoading && (loggedin || localStorage.getItem('token'))) {
      const id = api.getUserId();

      fetch(
        '/api/account/check',
        {
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
            this.openNotification();
            actSetLogout();
          } else if (response.code === 0) {
            getPageData();
          }
        })
        .catch(() => {});
    }
    return (
      <div
        className="PageLoading"
        style={{ display: isLoading && loggedin ? 'flex' : 'none' }}
      >
        加载中...
      </div>
    );
  }
}

const mapStateToProps = ({ trans, authStatus }) => ({
  trans,
  authStatus
});

const mapDispatchToProps = dispatch => ({
  actSetLogout: () => {
    dispatch(actSetLogout(null));
  },
  getPageData: () => {
    try {
      const { id } = JSON.parse(localStorage.getItem('book'));
      dispatch({
        type: 'getBooksAsync',
        payload: id
      });
    } catch (e) {
    }
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageLoading);
