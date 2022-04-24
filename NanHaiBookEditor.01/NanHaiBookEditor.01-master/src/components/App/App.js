import React, { useState } from 'react';
import { connect } from 'react-redux';
import MainMenu from '../MainMenu/MainMenu';
import WorkSpace from '../WorkSpace/WorkSpace';
import Thumbnail from '../Thumbnail/Thumbnail';
import Login from '../Login/Login';
import Project from '../Project/Project';
import ImageList from '../ImageList/ImageList';
import MusicPanel from '../Music/MusicPanel';
import PageLoading from '../PageLoading/PageLoading';
import { actUndo } from '../../store/bookPages/actions';
import './App.css';
import { Icon } from 'antd';

const App = (props) => {
  const { imageList } = props;

  const token = JSON.parse(localStorage.getItem('token'));

  const [showThumb, setShowThumb] = useState(true);

  return (
    <div className="App">
      <div className="App-Grid-Container">
        <div className="App-Menu">
          <MainMenu />
        </div>
        <div
          className={
            showThumb ? 'show-thumb App-Thumb' : 'hide-thumb App-Thumb'
          }
        >
          <Thumbnail />
        </div>
        <div
          className={
            showThumb ? 'hide-thumb-button' : 'hide-thumb-button on-hide'
          }
          onClick={() => setShowThumb(!showThumb)}
        >
          {showThumb ? <Icon type="left" /> : <Icon type="right" />}
        </div>
        <div
          className="App-Main"
          id="ID-App-Main"
          style={showThumb ? {} : { width: '100vw', left: 0 }}
        >
          <WorkSpace showThumb={showThumb} />
        </div>
        <div
          className="App-Login"
          style={{
            display:
              localStorage.getItem('showLogin') === 'true' ? 'flex' : 'none',
          }}
        >
          <Login />
        </div>

        {token && token.loginResult && (
          <Project visible={!!localStorage.getItem('showproject')} />
        )}

        <ImageList visible={imageList.isShow} />
        <MusicPanel />
        <PageLoading />
      </div>
    </div>
  );
};

const mapStateToProps = ({
  trans,
  authStatus,
  imageList,
  music,
  bookPages,
  slider,
}) => ({
  trans,
  authStatus,
  imageList,
  music,
  bookPages,
  slider,
});

const mapDispatchToProps = (dispatch) => ({
  actUndo: () => dispatch(actUndo())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
