import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './MusicPanel.css';
import { actDelMusic, actSetMusic } from '../../store/bookPages/actions';
import { showMusicPanel } from '../../store/music/music';
import {
  Table,
  Button,
  Icon,
  Modal,
  Tabs,
  Row,
  Col,
  Pagination,
  Radio,
  Input,
  Select,
  Checkbox,
  message,
  Upload
} from 'antd';
const { TabPane } = Tabs;

const MusicPanel = props => {
  const [onPlaySrc, setOnPlaySrc] = useState(undefined);
  const [loop, setLoop] = useState(false);
  const [page, setPage] = useState(1);

  const [onSelectSrc, setOnSelectSrc] = useState(undefined);
  const [onSelectName, setOnSelectName] = useState(undefined);
  const [searchKey, setSearchKey] = useState(undefined);
  const [uploadName,setUploadName] = useState(undefined);
  const [uploadMusic,setUploadMusic] = useState(undefined);
  const [showUpload, setShowUpload] = useState(false);
  const [mediaCategory, setMediaCategory] = useState('-999');
  const [scope, setScope] = useState(2);
  const [scopeInput, setScopeInput] = useState('all');
  const [isLoop, setIsLoop] = useState(false);

  const { text, onClickCallback, trans } = props;
  const { showMusicPanel } = props.music;
  const { present, showingPageId } = props.bookPages;

  useEffect(() => {
    if (mediaCategory === '-999') {
      props.actSetMusic({ page: page, pageSize: 10, searchKey });
    } else {
      props.actSetMusic({ page: page, pageSize: 10, searchKey, mediaCategory });
    }
  }, [page, mediaCategory]);

  useEffect(() => {
    let audio = document.getElementById('page-bg-audio');
    if (!onPlaySrc) {
      audio.pause();
    }
    audio.load();
    audio.play();
    audio.onended = () => {
      setOnPlaySrc(undefined);
    };

  }, [onPlaySrc]);

  useEffect(() => {
    let audio = document.getElementById('page-bg-audio');

    if (showMusicPanel || !present.config.audio) {
      audio.pause();
      setOnPlaySrc(undefined);
    } else {
      let page = 1;

      present.pages.forEach((item, i) => {
        if (item.id === showingPageId) {
          page = i + 1;
        }
      });

      setOnPlaySrc(undefined);

      present.config.backgroundMusic.forEach(item => {
        if (item.page === 'all') {
          setOnPlaySrc(item.music);
          setLoop(item.loop);
          return;
        } else {
          if (isNaN(item.page)) {
            let splitStr = item.page.split('-');
            let start = Number(splitStr[0]);
            let end = Number(splitStr[1]);

            if (page >= start && page <= end) {
              setOnPlaySrc(item.music);
              setLoop(item.loop);
              return;
            }
          } else {
            if (page === Number.parseInt(item.page)) {
              console.log(item.music, onPlaySrc);
              setOnPlaySrc(item.music);
              setLoop(item.loop);
              return;
            }
          }
        }
      });
    }
  }, [present.config.audio, showMusicPanel, showingPageId]);

  useEffect(() => {
    if (!onPlaySrc) return;
    let audio = document.getElementById('page-bg-audio');
    audio.pause();
    audio.loop = loop;
    audio.play();
  }, [loop]);

  const delMusic = index => {
    const { trans, delMusic } = props;
    delMusic(index);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Scope',
      dataIndex: 'scope',
      key: 'scope'
    },
    {
      title: 'Loop',
      dataIndex: 'loop',
      key: 'loop',
      render: Loop =>
        Loop ? (
          <Icon type="check" style={{ color: 'rgba(75, 158, 99, 1)' }} />
        ) : (
          <Icon type="close" style={{ color: 'rgba(206, 93, 78, 1)' }} />
        )
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record, index) => (
        <span>
          {onPlaySrc !== record.music ? (
            <a onClick={() => setOnPlaySrc(record.music)}>
              <Icon type="play-circle" />
            </a>
          ) : (
            <a onClick={() => setOnPlaySrc(undefined)}>
              <Icon type="pause-circle" />
            </a>
          )}

          <a onClick={() => delMusic(index)} style={{ marginLeft: 16 }}>
            <Icon type="close" />
          </a>
        </span>
      )
    }
  ];

  const bgListData = arr =>
    arr.map((value, index) => {
      return {
        key: index,
        name: value.name,
        scope: value.page,
        loop: value.loop,
        music: value.music
      };
    });

  const isRepeat = (backgroundMusic, addItem) => {
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

  const setPageMusic = () => {
    if (!onSelectSrc || !onSelectName) {
      message.error(trans.Music.selectMusic);
      return;
    }
    if (scopeInput === 'all' && present.config.backgroundMusic.length) {
      message.error(trans.Music.repeatError, 3);
      return;
    }
    if (scopeInput === '') {
      message.error(trans.Music.inputScope, 3);
      return;
    }

    let item = {
      page: scopeInput,
      music: onSelectSrc,
      name: onSelectName,
      loop: isLoop
    };

    if (scope === 1) {
      if (isNaN(scopeInput)) {
        let reg = /^[1-9][0-9]*-[1-9][0-9]*$/;
        if (reg.test(scopeInput)) {
          let strArr = scopeInput.split('-');
          if (Number.parseInt(strArr[1]) <= Number.parseInt(strArr[0])) {
            message.error(trans.Music.error1);
            return;
          } else {
            let flag = isRepeat(present.config.backgroundMusic, item);
            if (flag) {
              message.error(trans.Music.repeatError);
              return;
            } else {
              props.saveMusicConfig(item);
            }
          }
        } else {
          message.error(trans.Music.error2);
          return;
        }
      } else {
        let flag = isRepeat(present.config.backgroundMusic, item);
        if (flag) {
          message.error(trans.Music.repeatError);
          return;
        } else {
          props.saveMusicConfig(item);
        }
      }
    } else {
      props.saveMusicConfig(item);
    }

    setIsLoop(false);
    setOnSelectName(undefined);
    setOnSelectSrc(undefined);
    setScopeInput('all');
    setScope(2);
  };

  const uploadProps = {
    onRemove: file => {
      setUploadMusic(null)
    },
    beforeUpload: file => {
      if(file){
        setUploadName(file.name)
        setUploadMusic(file)
      }
      return false;
    },
    fileList:uploadMusic?[uploadMusic]:[],
  };

  return (
    <div style={{position: 'absolute'}}>
      <audio controlsList="nodownload" src={onPlaySrc} id="page-bg-audio"></audio>

      <Modal
        visible={showMusicPanel}
        width="75%"
        footer={null}
        bodyStyle={{ height: '80vh',overflow:'auto' }}
        onCancel={() => props.showMusicPanel()}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Manage" key="1">
            <Table
              columns={columns}
              dataSource={present.config && present.config.backgroundMusic ? bgListData(present.config.backgroundMusic) : []}
              pagination={false}
            ></Table>
          </TabPane>

          <TabPane tab="Set" key="2">
            <Row gutter={32}>
              <Col span={16}>
                <Input.Search
                  value={searchKey}
                  onChange={value => setSearchKey(value.target.value)}
                  placeholder="input search text"
                  enterButton="Search"
                  onSearch={() => {
                    if (mediaCategory === '-999') {
                      props.actSetMusic({
                        page: page,
                        pageSize: 10,
                        searchKey
                      });
                    } else {
                      props.actSetMusic({
                        page: page,
                        pageSize: 10,
                        searchKey,
                        mediaCategory
                      });
                    }
                  }}
                  style={{
                    marginBottom: 16,
                    width: 'calc(50% - 8px)',
                    marginRight: 8
                  }}
                />

                <Select
                  value={mediaCategory}
                  onChange={value => setMediaCategory(value)}
                  style={{ width: 'calc(50% - 8px)', marginLeft: 8 }}
                >
                  <Select.Option value="-999">All Music</Select.Option>
                  <Select.Option value="1">Sort Music</Select.Option>
                  <Select.Option value="2">Background Music</Select.Option>
                </Select>
                <Button onClick={
                  ()=>{
                    setShowUpload(true)
                }}>Upload</Button>

                <Radio.Group
                  value={onSelectSrc}
                  style={{ width: '100%' }}
                  onChange={e => {
                    setOnSelectSrc(e.target.value);
                    let musicList = props.music.audio.filter(
                      value => value.url === e.target.value
                    );
                    setOnSelectName(musicList[0].name);
                  }}
                >
                  {props.music.audio.map(value => (
                    <div key={value.id} className="card-music-list">
                      <Radio value={value.url}>{value.name}</Radio>
                      {value.url === onPlaySrc ? (
                        <Icon
                          type="pause-circle"
                          className="card-audio-paly"
                          onClick={() => setOnPlaySrc(undefined)}
                        />
                      ) : (
                        <Icon
                          type="play-circle"
                          className="card-audio-paly"
                          onClick={() => setOnPlaySrc(value.url)}
                        />
                      )}
                    </div>
                  ))}
                </Radio.Group>
                <Pagination
                  simple
                  current={page}
                  total={props.music.count}
                  pageSize={10}
                  onChange={value => setPage(value)}
                  style={{ marginTop: 24 }}
                />
              </Col>
              <Col span={8}>
                <h1>Music Setting</h1>
                <h3>current</h3>
                <div style={{ marginBottom: 16 }}>{onSelectName}</div>
                <h3>Scope</h3>
                <Radio.Group
                  onChange={value => {
                    setScope(value.target.value);
                    if (value.target.value === 2) {
                      setScopeInput('all');
                    } else {
                      setScopeInput('');
                    }
                  }}
                  value={scope}
                >
                  <Radio value={1}>Custom</Radio>
                  <Radio value={2}>All</Radio>
                </Radio.Group>
                {scope === 1 ? (
                  <Input
                    value={scopeInput}
                    onChange={value => setScopeInput(value.target.value)}
                    style={{ marginTop: 16 }}
                  />
                ) : (
                  ''
                )}
                <Checkbox
                  onChange={value => setIsLoop(value.target.checked)}
                  checked={isLoop}
                  style={{ display: 'block', margin: '16px 0' }}
                >
                  Loop
                </Checkbox>

                <Button
                  type="primary"
                  onClick={() => setPageMusic()}
                  style={{ width: '100%' }}
                >
                  Set
                </Button>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        {showUpload &&
        <Modal
        visible={true}
        width="500px"
        title="Upload"
        onOk={
          ()=>{
            if( !uploadName || !uploadMusic){
              message.warn('please choose file or input name')
              return 
            }
            let data = new FormData();
            data.append('file', uploadMusic);
            fetch('/api/file/upload', {
              method: 'POST',
              body: data,
              headers: {
                credentials: 'same-origin'
              }
            })
              .then(res => res.json())
              .then(upres => {
                if (upres.state) {
                  const item = {
                    name:uploadName,
                    url:upres.result.url
                  }
                  var items = props.music.audio || []
                  items.unshift(item)
                  props.actAddMusic(items)
                  setUploadMusic(null)
                  setUploadName(null)
                  setShowUpload(false)
                }
              });
          }
        }
        onCancel={
          ()=>{
            setUploadMusic(null)
            setUploadName(null)
            setShowUpload(false)
          }        
        }
        >
          <Row>
            <Col span={4}>name:</Col>
            <Col span={20}><Input value={uploadName} onChange={e=>setUploadName(e.target.value)}/></Col>
          </Row>
          <Upload {...uploadProps}>
            <Button  style={{
            marginTop:'10px'
          }}>
              <Icon type="upload" /> Select File
            </Button>
          </Upload>
 
        </Modal>
        }
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ trans, music, bookPages }) => ({
  trans,
  music,
  bookPages
});

const mapDispatchToProps = dispatch => ({
  delMusic: payload => {
    dispatch(actDelMusic(payload));
  },
  showMusicPanel: () => {
    dispatch(showMusicPanel());
  },
  actSetMusic: pageNo => {
    dispatch({
      type: 'setMusic',
      payload: pageNo
    });
  },
  actAddMusic: list => {
    debugger
    dispatch({
      type: 'addMusic',
      payload: list
    });
  },
  saveMusicConfig: payload => {
    dispatch(actSetMusic(payload));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MusicPanel);
