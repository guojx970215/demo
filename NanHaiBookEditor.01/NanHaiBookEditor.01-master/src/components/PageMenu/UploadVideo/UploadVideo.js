import React from 'react'
import './uploadVideo.css'
import { Select, Modal, message } from 'antd'
const { Option } = Select

class UploadVideo extends React.Component {
  state = {
    link: '',
    // 参数配置
    config: {
      width: 400,
      height: 250,
      controls: 1,
      autoplay: 0,
      muted: 0,
      loop: 0
    },
    oldStr: ''
  }
  linkOnchange = (e) => {
    console.log('linkOnchange', e.target.value)
    this.setState({
      link: e.target.value
    })
  }
  widthChange = (e) => {
    console.log('widthChange', e.target.value)
    let config = JSON.parse(JSON.stringify(this.state.config))
    config.width = e.target.value
    this.setState({
      config: config
    })
  }
  heightChange = (e) => {
    console.log('heightChange', e.target.value)
    let config = JSON.parse(JSON.stringify(this.state.config))
    config.height = e.target.value
    this.setState({
      config: config
    })
  }
  controlsChange = (value) => {
    console.log('controlsChange', value)
    let config = JSON.parse(JSON.stringify(this.state.config))
    config.controls = value
    this.setState({
      config: config
    })
  }
  autoplayChange = (value) => {
    console.log('autoplayChange', value)
    let config = JSON.parse(JSON.stringify(this.state.config))
    config.autoplay = value
    this.setState({
      config: config
    })
  }
  mutedChange = (value) => {
    console.log('mutedChange', value)
    let config = JSON.parse(JSON.stringify(this.state.config))
    config.muted = value
    this.setState({
      config: config
    })
  }
  loopChange = (value) => {
    console.log('loopChange', value)
    let config = JSON.parse(JSON.stringify(this.state.config))
    config.loop = value
    this.setState({
      config: config
    })
  }
  handleOk = e => {
    const { trans, addElement } = this.props;
    let { link, config } = this.state;
    let html = '';
    let firstSplit = link.indexOf('?') > -1 ? '&' : '?';
    link = `${link}${firstSplit}controls=${config.controls}&autoplay=${config.autoplay}&muted=${config.muted}&loop=${config.loop}`;
    html =
      html +
      `<iframe width="100%" height="100%" src="${link}"></iframe>`;
    addElement('VideoBox', {
      content: html,
      width: config.width ? Number(config.width) : 400,
      height: config.height ? Number(config.height) : 250
    });
    this.handleCancel()
  }

  handleCancel = e => {
    this.setState({
      config: {
        width: 400,
        height: 250,
        controls: 1,
        autoplay: 0,
        muted: 0,
        loop: 0
      },
      link: ''
    })
    this.props.handleCancel()
  };

  render () {
    const {config, link} = this.state
    const {visible, trans, isReplace, element} = this.props

    return (
      <Modal
        title={trans.UEditor.uploadVideo}
        width={648}
        cancelText={trans.UEditor.cancel}
        okText={trans.UEditor.confirm}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}>
        <div className="header">
          <span className="header-text">{trans.UEditor.addlink}</span>
          <input type="text" value={link} className="header-inputLink" onChange={this.linkOnchange} />
        </div>
        <span className="config-title">{trans.UEditor.parameter}</span>
        <form className="config-form">
          <label className="config-label">
            <span className="label-name">width</span>
            <input value={config.width} type="text" onChange={this.widthChange} className="label-input" />
          </label>
          <label className="config-label">
            <span className="label-name">height</span>
            <input value={config.height} type="text" onChange={this.heightChange} className="label-input" />
          </label>
          <label className="config-label">
            <span className="label-name">controls</span>
            <Select
              size="small"
              style={{ width: 80, marginLeft: 10, marginRight: 10 }}
              dropdownClassName="label-select"
              defaultValue={config.controls}
              onChange={this.controlsChange}>
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
              onChange={this.autoplayChange}>
              <Option value={1}>true</Option>
              <Option value={0}>false</Option>
            </Select>
          </label>
          <label className="config-label">
            <span className="label-name">muted</span>
            <Select
              size="small"
              style={{ width: 80, marginLeft: 10, marginRight: 10 }}
              dropdownClassName="label-select"
              defaultValue={config.muted}
              onChange={this.mutedChange}>
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
              onChange={this.loopChange}>
              <Option value={1}>true</Option>
              <Option value={0}>false</Option>
            </Select>
          </label>
        </form>
        <div className="preview">
          {
            link ? <iframe width="400" height="250"
              src={link}>
            </iframe> : <video controls style={{width: 400, height: 250}} src=""></video>
          }
        </div>
      </Modal>
    )
  }
}

export default UploadVideo
