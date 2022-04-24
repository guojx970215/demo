import React, {useState, useEffect} from 'react';
import {CloseOutlined, UserOutlined, LockOutlined} from '@ant-design/icons';
import {Shown} from '@components/Shown';
import {useStores} from '@contexts/storesContexts';
import {Button, Card, Checkbox, Input, message} from 'antd';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';

export const LoginContainer = observer(() => {
  const {UserStore, LangStore} = useStores();
  const trans = LangStore.trans;
  const history = useHistory();

  useEffect(() => {
    if (UserStore.user) history.push('/book');
  }, [UserStore, history]);

  const [isForget, setIsForget] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const forgetPassword = () => setIsForget(true);

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [renewPassword, setRenewPassword] = useState('');
  const [code, setCode] = useState('');

  const onRepeatBlur = () => {
    if (renewPassword !== newPassword) {
      message.error(trans.inputNewPasswordError);
    }
  };
  const backToLogin = () => setIsForget(false);

  return (
    <StyledLoginContainer>
      <Shown when={!isForget}>
        <StyledLoginCard title={trans.Login} extra={<CloseOutlined />} style={{width: 300}}>
          <Input
            placeholder={trans.Username}
            prefix={<UserOutlined />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input.Password
            placeholder={trans.Password}
            prefix={<LockOutlined />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <StyledBar>
            <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}>
              {trans.rememberMe}
            </Checkbox>
            <StyledForget onClick={forgetPassword}>{trans.Forget}?</StyledForget>
          </StyledBar>
          <Button
            type="primary"
            block
            onClick={() => UserStore.login(username, password, () => history.push('/book'))}
          >
            {trans.Login}
          </Button>
        </StyledLoginCard>
      </Shown>

      <Shown when={isForget}>
        <StyledLoginCard title={trans.Forget} extra={<CloseOutlined />} style={{width: 300}}>
          <Input
            placeholder={trans.email}
            prefix={<UserOutlined />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input.Password
            placeholder={trans.Password}
            prefix={<LockOutlined />}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input.Password
            placeholder={trans.inputNewPasswordAgain}
            prefix={<LockOutlined />}
            value={renewPassword}
            onChange={(e) => setRenewPassword(e.target.value)}
            onBlur={onRepeatBlur}
          />
          <StyledBar>
            <Input
              placeholder={trans.vercode}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button type="primary" onClick={forgetPassword}>
              {trans.send}
            </Button>
          </StyledBar>
          <StyledButtonBar>
            <Button type="primary" block>
              {trans.confirm}
            </Button>
            <Button type="primary" ghost block onClick={backToLogin}>
              {trans.goToLogin}
            </Button>
          </StyledButtonBar>
        </StyledLoginCard>
      </Shown>
    </StyledLoginContainer>
  );
});

const StyledLoginContainer = styled.div`
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--bg-color-cover);
`;

const StyledLoginCard = styled(Card)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 360px;
  height: auto;
  transform: translate(-50%, -50%);
  background-color: var(--bg-color-white);

  .ant-input-affix-wrapper {
    margin-bottom: var(--spacing-2x);
  }
`;

const StyledBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-4x);

  & > input {
    width: 169px;
  }
`;

const StyledButtonBar = styled(StyledBar)`
  & > button {
    flex-basis: calc(50% - var(--spacing-1x));
  }
`;

const StyledForget = styled.div`
  cursor: pointer;

  &:hover {
    color: var(--color-hover);
  }
`;
