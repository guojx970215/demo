import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Modal,
  Radio,
  Pagination,
  Button,
  Icon,
  message,
  Input,
  Select
} from 'antd';

const MusicCard = props => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [audioSrc, setAudioSrc] = useState(undefined);
  const [choseId, setChoseId] = useState(props.onEffect);
  const [searchKey, setSearchKey] = useState(undefined);
  const [tag, setTag] = useState(0);

  // 音乐列表换页
  useEffect(() => {
    props.actSetMusic({
      page: page,
      pageSize: pageSize,
      searchKey,
      mediaCategory: tag ? tag : undefined
    });
  }, [page]);

  useEffect(() => {
    page === 1
      ? props.actSetMusic({
          page: 1,
          pageSize: pageSize,
          searchKey,
          mediaCategory: tag ? tag : undefined
        })
      : setPage(1);
  }, [searchKey, tag]);

  useEffect(() => {
    if (!audioSrc) return;
    let bg = document.getElementById('bg');
    bg ? bg.pause() : '';
    let tryNew = document.getElementById('trigger-music-card');
    tryNew.load();
    tryNew.play();
  }, [audioSrc]);

  useEffect(() => {
    setChoseId(props.onEffect);
  }, [props.onEffect]);

  const pausePlaying = e => {
    let tryNew = document.getElementById('trigger-music-card');
    tryNew.pause();
    setAudioSrc(undefined);
  };

  const confirm = e => {
    pausePlaying();
    let audio = props.music.audio.filter(value => value.url === choseId);
    if (!audio[0]) {
      props.onCancel();
    } else {
      props.onOk(audio);
    }
  };

  const upload = e => {
    let data = new FormData();
    data.append('file', e.target.files[0]);
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
          pausePlaying();
          props.onOk([upres.result]);
        }
      });
  };

  return (
    <Modal
      title={props.trans.TriggerMusicCard.chooseMusic}
      visible={props.visible}
      footer={null}
      maskClosable={false}
      onCancel={() => {
        pausePlaying();
        props.onCancel();
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <Input
          style={{ width: 'calc(100% - 232px)', marginRight: 16 }}
          placeholder="Search music name"
          value={searchKey}
          onChange={e => {
            setSearchKey(e.target.value);
          }}
        />
        <Select
          style={{ width: 100, marginRight: 16 }}
          value={tag}
          onChange={value => {
            setTag(value);
          }}
        >
          <Select.Option value={0}>全部</Select.Option>
          <Select.Option value={1}>短音效</Select.Option>
          <Select.Option value={2}>背景音乐</Select.Option>
        </Select>
        <label className="upload-music-btn">
          <Icon type="upload" />
          {props.trans.UEditor.upload}
          <input type="file" style={{ display: 'none' }} onChange={upload} />
        </label>
      </div>
      <Radio.Group
        onChange={e => setChoseId(e.target.value)}
        style={{ width: '100%' }}
        value={choseId}
      >
        {props.music.audio.map(value => (
          <div key={value.id} className="card-music-list">
            <Radio value={value.url}></Radio>
            {value.name}
            {value.url === audioSrc ? (
              <Icon
                type="pause-circle"
                className="card-audio-paly"
                onClick={() => pausePlaying()}
              />
            ) : (
              <Icon
                type="play-circle"
                className="card-audio-paly"
                onClick={() => setAudioSrc(value.url)}
              />
            )}
          </div>
        ))}
      </Radio.Group>

      <Pagination
        simple
        current={page}
        total={props.music.count}
        pageSize={pageSize}
        onChange={value => setPage(value)}
        style={{ marginTop: 24 }}
      />
      <div className="music-modal-footer">
        <Button
          onClick={() => {
            props.onCancel();
            pausePlaying();
          }}
          className="modal-cancel"
        >
          {props.trans.AniDialog.cancel}
        </Button>
        <Button type="primary" onClick={confirm} className="modal-confirm">
          {props.trans.AniDialog.confirm}
        </Button>
      </div>
      <audio
        controlsList="nodownload"
        id="trigger-music-card"
        src={audioSrc}
        onEnded={() => setAudioSrc(undefined)}
      ></audio>
    </Modal>
  );
};

const mapStateToProps = ({ music, trans }) => ({
  music,
  trans
});

const mapDispatchToProps = dispatch => ({
  actSetMusic: pageNo => {
    dispatch({
      type: 'setMusic',
      payload: pageNo
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MusicCard);
