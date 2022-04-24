
import React from "react";
import { connect } from "react-redux";
import "./Music.css";
import { showMusicDialog } from "../../store/music/music";
import { actSetMusic, actDelMusic } from '../../store/bookPages/actions';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

import Toast from '../Toast/index';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

let pageArray = [];
class Music extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIndex: -1,
      selectMusic: {},
      playingIndex: -1,
      playingMusic: {},
      currentCount: 0,
      pageIndex: 0,
      checkedRadio: 'custom',
      inputValue: '',
      bgMusic: {},
      checkedBox: false
    };

    Music._this = this;
  }

  prePageClick = (e, count) => {
    if (count <= 12) {
      return;
    }
  };
  nextPageClick = (e, count) => {
    this.setState({
      pageIndex: this.state.pageIndex + 1
    });
    // if(this.state.pageIndex + 1 < pageArray.length){
    //
    //   this.props.actSetMusic(this.state.pageIndex + 1);
    // }
  };

  selectMusic = (item, index) => {
    this.setState({
      selectMusic: item,
      selectIndex: index,
      inputValue: ''
    });
  };
  playMusic = (item, index) => {
    let m = document.getElementById('music');
    let bg = document.getElementById('bg');
    if (index !== this.state.playingIndex) {
      this.setState(
        {
          playingMusic: item,
          playingIndex: index
        },
        () => {
          bg.pause();
          m.load();
          m.play();
        }
      );
    } else {
      this.setState(
        {
          playingMusic: {},
          playingIndex: -1
        },
        () => {
          bg.pause();
          m.pause();
        }
      );
    }
  };
  checkRadio = value => {
    this.setState({
      checkedRadio: value
    });
  };

  checkBox = value => {
    this.setState({
      checkedBox: !this.state.checkedBox
    });
  };

  onInputChange = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  isRepeat = (backgroundMusic, addItem) => {
    let flag = false;
    if (backgroundMusic.length === 1 && backgroundMusic[0].page === 'all') {
      return true;
    } else if (isNaN(addItem.page)) {
      let arr = addItem.page.split('-');
      let start = Number.parseInt(arr[0]);
      let end = Number.parseInt(arr[1]);
      backgroundMusic.forEach((bg, idx) => {
        if (isNaN(bg.page)) {
          let result = bg.page.split('-');
          let cmpStart = Number.parseInt(result[0]);
          let cmpEnd = Number.parseInt(result[1]);
          if (
            (start >= cmpStart && start <= cmpEnd) ||
            (end >= cmpStart && end <= cmpEnd)
          ) {
            flag = true;
            return;
          }
        } else {
          if (
            start <= Number.parseInt(bg.page) &&
            end >= Number.parseInt(bg.page)
          ) {
            flag = true;
            return;
          }
        }
      });
    } else {
      let page = Number.parseInt(addItem.page);
      backgroundMusic.forEach((bg, idx) => {
        if (isNaN(bg.page)) {
          let result = bg.page.split('-');
          let cmpStart = Number.parseInt(result[0]);
          let cmpEnd = Number.parseInt(result[1]);
          if (page >= cmpStart && page <= cmpEnd) {
            flag = true;
            return;
          }
        } else {
          if (page === Number.parseInt(bg.page)) {
            flag = true;
            return;
          }
        }
      });
    }

    return flag;
  };

  clickOk = () => {
    const { trans, saveMusicConfig, setDialog } = this.props;
    const { present } = this.props.bookPages;
    let backgroundMusic = present.config.backgroundMusic
      ? present.config.backgroundMusic
      : [];
    if (this.state.selectMusic.name === undefined) {
      Toast.error(trans.Music.selectMusic);
      return;
    }
    if (this.state.checkedRadio === 'custom') {
      if (this.state.inputValue === '') {
        Toast.error(trans.Music.inputScope);
      } else {
        if (isNaN(this.state.inputValue)) {
          // 1-9
          let reg = /^[1-9][0-9]*-[1-9][0-9]*$/;
          console.log(this.state.inputValue);
          if (reg.test(this.state.inputValue)) {
            let strArr = this.state.inputValue.split('-');
            if (Number.parseInt(strArr[1]) <= Number.parseInt(strArr[0])) {
              Toast.error(trans.Music.error1);
            } else {
              let addItem = {
                page: this.state.inputValue,
                music: this.state.selectMusic.url,
                name: this.state.selectMusic.name,
                loop: this.state.checkedBox
              };
              let flag = this.isRepeat(backgroundMusic, addItem);
              if (flag) {
                Toast.error(trans.Music.repeatError);
              } else {
                saveMusicConfig(addItem);
              }
            }
          } else {
            Toast.error(trans.Music.error2);
          }
        } else {
          // 单独数字
          let addItem = {
            page: this.state.inputValue,
            music: this.state.selectMusic.url,
            name: this.state.selectMusic.name,
            loop: this.state.checkedBox
          };
          let flag = this.isRepeat(backgroundMusic, addItem);
          if (flag) {
            Toast.error(trans.Music.repeatError);
          } else {
            saveMusicConfig(addItem);
          }
        }
        setDialog(false);
      }
    } else {
      let addItem = {
        page: 'all',
        music: this.state.selectMusic.url,
        name: this.state.selectMusic.name,
        loop: this.state.checkedBox
      };
      if (backgroundMusic.length) {
        Toast.error(trans.Music.repeatError);
      } else {
        saveMusicConfig(addItem);
        setDialog(false);
      }
    }
  };

  getBgPath = (backgroundMusic, present, showingPageId, audio) => {
    let index = 1;
    let m = document.getElementById('bg');
    // if(present && present.pages){
    //   let filter = present.pages.filter(item => item.id === showingPageId);
    //   index = filter[0].index + 1;
    // }
    if (!audio) {
      m.pause();
      return;
    } else {
      m.load();
      m.play();
    }
    if (present && present.pages) {
      present.pages.forEach((item, i) => {
        if (item.id === showingPageId) {
          index = i + 1;
        }
      });
    }
    if (this.props.bookPages.showingPageId !== showingPageId) {
      m.pause();
      this.setState({
        bgMusic: ''
      });
      backgroundMusic.forEach(item => {
        if (item.page === 'all') {
          let bg = item.music;
          this.setState(
            {
              bgMusic: bg
            },
            () => {
              let m = document.getElementById('bg');
              m.loop = item.loop;
              m.load();
              m.play();
            }
          );
          return;
        } else {
          if (isNaN(item.page)) {
            let splitStr = item.page.split('-');
            let start = splitStr[0];
            let end = splitStr[1];
            if (index >= start && index <= end) {
              let bg = item.music;
              this.setState(
                {
                  bgMusic: bg
                },
                () => {
                  let m = document.getElementById('bg');
                  m.loop = item.loop;
                  m.load();
                  m.play();
                }
              );
              return;
            }
          } else {
            if (index === Number.parseInt(item.page)) {
              let bg = item.music;
              this.setState(
                {
                  bgMusic: bg
                },
                () => {
                  let m = document.getElementById('bg');
                  m.loop = item.loop;
                  m.load();
                  m.play();
                }
              );
              return;
            }
          }
        }
      });
    } else {
      let flag = false;
      let bg = '';
      for (let i = 0; i < backgroundMusic.length; i++) {
        let item = backgroundMusic[i];
        if (item.page === 'all') {
          flag = true;
          bg = item;
          break;
        } else {
          if (isNaN(item.page)) {
            let splitStr = item.page.split('-');
            let start = splitStr[0];
            let end = splitStr[1];
            if (index >= start && index <= end) {
              flag = true;
              bg = item;
              break;
            }
          } else {
            if (index === Number.parseInt(item.page)) {
              flag = true;
              bg = item;
              break;
            }
          }
        }
      }
      console.log('this.state.bgMusic', this.state.bgMusic);
      if (flag && !this.state.bgMusic) {
        this.setState(
          {
            bgMusic: bg.music
          },
          () => {
            let m = document.getElementById('bg');
            m.loop = bg.loop;
            m.load();
            m.play();
          }
        );
      } else if (!flag) {
        this.setState(
          {
            bgMusic: ''
          },
          () => {
            let m = document.getElementById('bg');
            m.pause();
          }
        );
      }
    }
  };
  // componentDidUpdate(prevProps, prevState) {
  //   if (
  //     this.props.bookPages.present.config.audio !==
  //     prevProps.bookPages.present.config.audio
  //   ) {
  //     this.fetchData(this.props.userID);
  //   }
  // }
  componentWillReceiveProps(nextProps) {
    const { isShow } = nextProps.music;
    const { audio } = nextProps.slider;
    const { present, showingPageId } = nextProps.bookPages;
    let backgroundMusic = present.config.backgroundMusic;
    
    if (!audio || (!isShow && backgroundMusic)) {
      // if(!audio || !isShow && this.props.bookPages.showingPageId !== nextProps.bookPages.showingPageId && backgroundMusic){

      console.log(backgroundMusic);
      this.getBgPath(backgroundMusic, present, showingPageId, audio);
    }
    if (
      !audio ||
      (this.props.music.isShow && !nextProps.music.isShow && backgroundMusic)
    ) {
      this.getBgPath(backgroundMusic, present, showingPageId, audio);
    }
    if (audio && audio !== this.props.slider.audio) {
      this.getBgPath(backgroundMusic, present, showingPageId, audio);
    }
    if (
      this.props.music.audio.length == 0 &&
      nextProps.music.audio.length > 0
    ) {
      this.setState({
        selectIndex: 0,
        selectMusic: nextProps.music.audio[0]
      });
    }
  }

  delMusic = (index) => {
    const { trans, delMusic } = this.props;
    delMusic(index);
  }

  render() {
    const { trans, actSetMusic, setDialog } = this.props;
    const { audio, count } = this.props.music;
    const pageSize = 12;
    let pageNum =
      count % pageSize == 0
        ? parseInt(count / pageSize)
        : Math.ceil(count / pageSize);
    pageArray = new Array(pageNum).join(',').split(',');
    const { present } = this.props.bookPages;
    let backgroundMusic = present.config.backgroundMusic;
    return (
      <div className="ImageBox">
        <Tabs defaultActiveKey="1">
          <TabPane tab={trans.PageMenu.music} key="1">
            <div style={{display:'flex'}}>
              <div className="Music">
                {
                  audio && audio.length ? (
                      <table width="90%" className="table">
                        <thead>
                          <tr>
                            <th width="10%">#</th>
                            <th width="30%">{trans.Music.name}</th>
                            <th width="20%"></th>
                          </tr>
                        </thead>
                        <tbody>
                        {
                          audio.map((item, index) => (
                            <tr key={index} className={this.state.selectIndex === index ? 'selected' : ''} onClick={(e)=>this.selectMusic(item,index)}>
                              <td>{index + 1}</td>
                              <td>{item.name}</td>
                              <td>
                                <img src={this.state.playingIndex === index ? 'assets/pause.png' : 'assets/play.png'} onClick={(e)=>this.playMusic(item,index)}/>
                              </td>
                            </tr>
                            )
                          )
                        }
                        </tbody>
                      </table>
                    ) : `${trans.Music.noMusic}`
                }
              </div>
              <div className="ImagePaging">
                <span className={count <= 12 ? 'disabled' : ''} onClick={(e) => this.prePageClick(e, count)}>{trans.Music.prePage}</span>
                {
                  pageArray.length && pageArray.map((item, index) => {
                    return (
                      <span className={this.state.pageIndex == index ? 'active' : ''} key={index} onClick={() => {
                        actSetMusic(index + 1);
                      }}>{index + 1}</span>
                    )
                  })
                }
                <span className={count <= 12 ? 'disabled' : ''} onClick={(e) => this.nextPageClick(e, count)}>{trans.Music.nextPage}</span>
              </div>
              <div className="ImageSet">
                <div className="Title">{trans.Music.setTitle}</div>
                <div className="SetItem">
                  <div className="item">{trans.Music.currentMusic} : {this.state.selectMusic.name}</div>
                  <div className="item">{trans.Music.musicLoop} : &nbsp;&nbsp;
                    <input type="checkbox" id="loopCheck" onChange={this.checkBox} checked={this.state.checkedBox}/>
                  </div>
                  <div className="item">
                    {trans.Music.scope} :
                    <span style={{marginRight:'10px',marginLeft:'10px'}}><input checked={this.state.checkedRadio === 'custom'} onChange={this.checkRadio.bind(this, 'custom')} type="radio" name="scope" id="custom" /> &nbsp;&nbsp;{trans.Music.custom}</span>
                    <span><input checked={this.state.checkedRadio === 'all'} onChange={this.checkRadio.bind(this, 'all')} type="radio" name="scope" id="all" />&nbsp;&nbsp;{trans.Music.all}</span>
                  </div>
                  {
                    this.state.checkedRadio === 'custom' ? (
                      <div className="item" >
                        <span><input onChange={this.onInputChange} value={this.state.inputValue} placeholder={trans.Music.placeHolder} style={{width:'250px'}}/></span>
                      </div>
                    ) : ''
                  }
                </div>
                <div className="SetItem">
                  <button onClick={ this.clickOk}>{trans.Music.ok}</button>
                  <button onClick={(e) => setDialog(false, trans, e)} >{trans.Music.cancel}</button>
                </div>
              </div>
              <audio controlsList="nodownload" src={this.state.playingMusic.url} id="music" loop></audio>
              <audio controlsList="nodownload" src={this.state.bgMusic} id="bg"></audio>
            </div>
          </TabPane>
          <TabPane tab={trans.PageMenu.music_manage} key="2">
            <div className="MusicPanelBox" style={{position:"relative"}}>
              <div>
                {
                  backgroundMusic && backgroundMusic.length ? (
                    <table width="100%" className="table">
                      <thead>
                        <tr>
                          <th width="30%">{trans.Music.name}</th>
                          <th width="30%">{trans.Music.scope}</th>
                          <th width="20%">{trans.Music.musicLoop}</th>
                          <th width="20%"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          backgroundMusic.map((item, index) => (
                            <tr key={index}>
                              <td>{item.name}</td>
                              <td>{item.page}</td>
                              <td>{item.loop ? 'true' : 'false'}</td>
                              <td>
                                <a className="music_del" onClick={this.delMusic.bind(this, index)}>删除</a>
                              </td>
                            </tr>
                          )
                          )
                        }
                      </tbody>
                    </table>
                  ) : (<span className='no_music'>{trans.Music.noMusic}</span>)
                }
              </div>
            </div>
            <div style={{marginTop: '10px'}}>
              <button onClick={(e) => setDialog(false, trans, e)} >{trans.Music.cancel}</button>
            </div>
            
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = ({ trans, music, bookPages, slider }) => ({
  trans,
  music,
  bookPages,
  slider
});

const mapDispatchToProps = dispatch => ({
  setDialog: (flag, trans) => {
    let m = document.getElementById('music');
    Music._this.setState(
      {
        playingMusic: {},
        playingIndex: -1,
        selectIndex: 0,
        checkedRadio: 'custom',
        inputValue: '',
        checkedBox: false
      },
      () => {
        m.pause();
      }
    );
    dispatch(showMusicDialog(flag));
  },

  actSetMusic: pageNo => {
    Music._this.setState({
      pageIndex: pageNo - 1
    });
    dispatch({
      type: 'setMusic',
      payload: pageNo
    });
  },
  saveMusicConfig: payload => {
    dispatch(actSetMusic(payload));
  },
  delMusic: (payload) => {
    dispatch(actDelMusic(payload));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Music);
