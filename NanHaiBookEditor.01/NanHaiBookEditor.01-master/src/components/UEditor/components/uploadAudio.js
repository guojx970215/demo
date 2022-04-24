import React from 'react';
import './uploadVideo.css';
import Api from '../../../api/bookApi';

import ModalList from '../../AudioMenu/components/ModalList';
import { Select, Modal, message, Button, Icon } from 'antd';
const { Option } = Select;

class UploadAudio extends React.Component {
  state = {
    link: '',
    // 连接列表
    linkList: [],
    // 参数配置
    config: {
      author: '',
      poster: '',
      controls: 1,
      autoplay: 0,
      name: '',
      loop: 0
    },
    galleryVisible: false
  };

  addLink = () => {
    const { trans } = this.props;
    if (!this.state.link) {
      message.error(trans.UEditor.noEmptyLink);
      return false;
    }
    let linkList = JSON.parse(JSON.stringify(this.state.linkList));
    linkList.unshift({
      link: this.state.link,
      config: this.state.config
    });
    this.setState({
      linkList: linkList,
      link: ''
    });
  };
  deleteLink = (index, e) => {
    let linkList = JSON.parse(JSON.stringify(this.state.linkList));
    linkList.splice(index, 1);
    this.setState({
      linkList: linkList
    });
  };
  linkOnchange = e => {
    console.log('linkOnchange', e.target.value);
    this.setState({
      link: e.target.value
    });
  };
  posterChange = e => {
    console.log('posterChange', e.target.value);
    let config = JSON.parse(JSON.stringify(this.state.config));
    config.poster = e.target.value;
    this.setState({
      config: config
    });
  };
  nameChange = e => {
    console.log('nameChange', e.target.value);
    let config = JSON.parse(JSON.stringify(this.state.config));
    config.name = e.target.value;
    this.setState({
      config: config
    });
  };
  controlsChange = value => {
    console.log('controlsChange', value);
    let config = JSON.parse(JSON.stringify(this.state.config));
    config.controls = value;
    this.setState({
      config: config
    });
  };
  autoplayChange = value => {
    console.log('autoplayChange', value);
    let config = JSON.parse(JSON.stringify(this.state.config));
    config.autoplay = value;
    this.setState({
      config: config
    });
  };
  authorChange = e => {
    console.log('authorChange', e.target.value);
    let config = JSON.parse(JSON.stringify(this.state.config));
    config.author = e.target.value;
    this.setState({
      config: config
    });
  };
  loopChange = value => {
    console.log('loopChange', value);
    let config = JSON.parse(JSON.stringify(this.state.config));
    config.loop = value;
    this.setState({
      config: config
    });
  };
  handleOk = e => {
    const { trans } = this.props;
    let linkList = this.state.linkList;
    if (linkList.length === 0) {
      message.error(trans.UEditor.leastOne);
      return false;
    }
    this.props.updateLinkList(linkList);
    this.setState({
      linkList: [],
      config: {
        author: '',
        poster: '',
        controls: 1,
        autoplay: 0,
        name: '',
        loop: 0
      },
      link: ''
    });
  };
  handleCancel = e => {
    this.setState({
      linkList: [],
      config: {
        author: '',
        poster: '',
        controls: 1,
        autoplay: 0,
        name: '',
        loop: 0
      },
      link: ''
    });
    this.props.handleCancel();
  };
  upload = e => {
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
          console.log(upres.result);
          this.setState({
            link: upres.result.url
          });
        }
      });
  };

  render() {
    const { config, linkList, link } = this.state;
    const { visible, trans } = this.props;

    return (
      <Modal
        title={trans.UEditor.uploadAudio}
        width={648}
        visible={visible}
        cancelText={trans.UEditor.cancel}
        okText={trans.UEditor.confirm}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <ModalList
          trans={trans}
          visible={this.state.galleryVisible}
          onCancal={() => this.setState({ galleryVisible: false })}
          isEdit={true}
          getAudioSrc={src =>
            this.setState({
              link: src
            })
          }
        />
        <div className="header">
          <span className="header-text">{trans.UEditor.addlink}</span>
          <input
            type="text"
            value={link}
            className="header-inputLink"
            onChange={this.linkOnchange}
          />
          <Button className="header-addBtn" onClick={this.addLink}>
            {trans.UEditor.add}
          </Button>
          <label className="upload-btn">
            {trans.UEditor.upload}
            <input
              type="file"
              style={{ display: 'none' }}
              onChange={this.upload}
            />
          </label>

          <Button
            size="small"
            type="primary"
            onClick={() => this.setState({ galleryVisible: true })}
            style={{marginLeft: 8}}
          >
            <Icon type="plus" /> Select
          </Button>
        </div>
        {linkList.length === 0 ? (
          <div className="no-link">
            <span className="text">{trans.UEditor.leastOneLink}</span>
          </div>
        ) : (
          <div className="link-box">
            {linkList.map((item, index) => {
              return (
                <span key={index} className="link-item">
                  <span className="text">{item.link}</span>
                  <i
                    className="cancel"
                    onClick={this.deleteLink.bind(this, index)}
                  >
                    x
                  </i>
                </span>
              );
            })}
          </div>
        )}
        <span className="config-title">{trans.UEditor.parameter}</span>
        <form className="config-form">
          <label className="config-label">
            <span className="label-name">controls</span>
            <Select
              size="small"
              style={{ width: 80, marginLeft: 10, marginRight: 10 }}
              dropdownClassName="label-select"
              defaultValue={config.controls}
              onChange={this.controlsChange}
            >
              <Option value={1}>true</Option>
              <Option value={0}>false</Option>
            </Select>
          </label>
          <label className="config-label">
            <span className="label-name">autoplay</span>
            <Select
              size="small"
              style={{ width: 80, marginLeft: 10, marginRight: 10 }}
              dropdownClassName="label-select"
              defaultValue={config.autoplay}
              onChange={this.autoplayChange}
            >
              <Option value={1}>true</Option>
              <Option value={0}>false</Option>
            </Select>
          </label>
          <label className="config-label">
            <span className="label-name">loop</span>
            <Select
              size="small"
              style={{ width: 80, marginLeft: 10, marginRight: 10 }}
              dropdownClassName="label-select"
              defaultValue={config.loop}
              onChange={this.loopChange}
            >
              <Option value={1}>true</Option>
              <Option value={0}>false</Option>
            </Select>
          </label>
          <label className="config-label">
            <span className="label-name">poster</span>
            <input
              value={config.poster}
              type="text"
              onChange={this.posterChange}
              className="label-input"
            />
          </label>
          <label className="config-label">
            <span className="label-name">name</span>
            <input
              value={config.name}
              type="text"
              onChange={this.nameChange}
              className="label-input"
            />
          </label>
          <label className="config-label">
            <span className="label-name">author</span>
            <input
              value={config.author}
              type="text"
              onChange={this.authorChange}
              className="label-input"
            />
          </label>
        </form>
        <div className="preview">
          <audio controlsList="nodownload" controls style={{ width: 400 }} src={link}></audio>
        </div>
      </Modal>
    );
  }
}

export default UploadAudio;
