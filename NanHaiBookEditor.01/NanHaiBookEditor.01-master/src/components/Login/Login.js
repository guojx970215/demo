
import React from "react";
import { connect } from "react-redux";
import "./Login.css";
import api from '../../api/bookApi';
import { styles } from "ansi-colors";
import { actSetLoading, showLogin } from "../../store/auth/auth";
import { Button, Switch, Form, Upload, Icon, Radio, Input, message, Modal, Select, InputNumber, Slider, Checkbox, Divider, Row, Col } from 'antd'

let verifyInterval = null
class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      currentView: 'login',
      email: '',
      newpassword: '',
      newpasswordAgain: '',
      verifyCode: '',
      getVerifyCodeTime: 0
    }
  }

  handleEnterKey = () => {
    const { actSetLogin } = this.props
    actSetLogin(this.state.username, this.state.password)
  }
  changeName(e) {
    this.setState({
      username: e.target.value
    })
  }

  changePwd(e) {
    this.setState({
      password: e.target.value
    })
  }
  updatePassword = () => {
    const { email, newpasswordAgain, newpassword, verifyCode } = this.state
    const { trans } = this.props
    if (!email) {
      message.error(trans.Login.email);
      return
    }
    if (!newpassword) {
      message.error(trans.Login.newPassword);
      return
    }
    if (!newpasswordAgain) {
      message.error(trans.Login.inputNewPasswordAgain);
      return
    }
    if (!verifyCode) {
      message.error(trans.Login.verifyCode);
      return
    }
    if (newpassword !== newpasswordAgain) {
      message.error(trans.Login.diffPassword);
      return
    }
    api.updatePassword(email, newpassword, verifyCode).then(({ state, msg }) => {
      if (state) {
        message.success(trans.Login.updateSuccess);
        this.setState({
          currentView: 'login'
        })
      } else {
        message.error(msg);
      }
    })
  }
  sendVercode = () => {
    const { email } = this.state
    const { trans } = this.props
    if (!email) {
      message.error(trans.Login.email);
      return
    }
    api.sendvercode(email).then(({ state, msg }) => {
      if (state) {
        message.success(trans.Login.sendVercodeSuccess);
        this.setState({
          getVerifyCodeTime: 60
        })
        verifyInterval = setInterval(() => {
          if (this.state.getVerifyCodeTime === 0) {
            clearInterval(verifyInterval)
          }
          this.setState({
            getVerifyCodeTime: this.state.getVerifyCodeTime - 1
          })
        }, 1000);
      } else {
        message.error(msg);
      }
    })
  }

  render() {
    const { trans, actSetLogin, authStatus, actSetLoading, showLogin } = this.props
    const { errorMsg } = authStatus
    const { currentView, getVerifyCodeTime } = this.state
    return (
      <div className="LoginBox">
        <span className="closeLogin"
          onClick={() => { showLogin(false) }}>
          <svg viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
        </span>
        {
          currentView === 'login' &&
          <div>
            <div className="LoginTitle">{trans.Login.title}</div>
            <Input onPressEnter={this.handleEnterKey} className="LoginInput" value={this.state.username} placeholder="Username" onChange={(event) => { this.changeName(event) }} />
            <Input onPressEnter={this.handleEnterKey} className="LoginInput" type="password" value={this.state.password} placeholder="Password" onChange={(event) => { this.changePwd(event) }} />
            <div className="LoginOpt">
              <span><input type="checkbox" />{trans.Login.remember}</span>
              <span onClick={() => {
                this.setState({ currentView: 'forgetPW' })
              }}>{trans.Login.forget}</span>
            </div>
            <div className="LoginMsg">{errorMsg}</div>
            <Button type="primary" className="LoginButton" onClick={() => { actSetLogin(this.state.username, this.state.password) }}>{trans.Login.title}</Button>
          </div>
        }
        {
          currentView === 'forgetPW' &&
          <div>
            <div className="LoginTitle">{trans.Login.forgetPW}</div>
            <Input value={this.state.email} placeholder={trans.Login.email}
              onChange={(e) => {
                this.setState({
                  email: e.target.value
                })
              }} style={{
                marginBottom: '10px'
              }} />
            <Input type="password" value={this.state.newpassword} placeholder={trans.Login.newPassword}
              onChange={(e) => {
                this.setState({
                  newpassword: e.target.value
                })
              }} style={{
                marginBottom: '10px'
              }} />
            <Input type="password" value={this.state.newpasswordAgain} placeholder={trans.Login.inputNewPasswordAgain}
              onChange={(e) => {
                this.setState({
                  newpasswordAgain: e.target.value
                })
              }} style={{
                marginBottom: '10px'
              }} />
            <div style={{
              display: 'flex',
              justifyContent: "space-between"
            }}>
              <Input placeholder={trans.Login.verifyCodePlaceHolder} value={this.state.verifyCode} onChange={(e) => {
                this.setState({
                  verifyCode: e.target.value
                })
              }} style={{
                marginBottom: '10px',
                width: '100px'
              }} />
              <Button disabled={getVerifyCodeTime > 0} onClick={this.sendVercode}>{getVerifyCodeTime > 0 ? (getVerifyCodeTime + 's' + trans.Login.resendVercode) : trans.Login.sendVercode}</Button>
            </div>

            <div style={{
              textAlign: 'center'
            }}>
              <Button type="primary" onClick={this.updatePassword}>{trans.Login.confirm}</Button>
              <Button onClick={() => {
                this.setState({ currentView: 'login' })
              }} style={{ marginLeft: '10px' }}>{trans.Login.gotoLogin}</Button>
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = ({ trans, authStatus }) => ({
  trans,
  authStatus
})


const mapDispatchToProps = dispatch => ({
  actSetLogin: (username, password) => {
    dispatch({
      type: 'setLogin',
      payload: {
        username: username,
        password: password
      }
    });
    dispatch(actSetLoading(false));
  },
  showLogin: (value) => {
    dispatch(showLogin(value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
