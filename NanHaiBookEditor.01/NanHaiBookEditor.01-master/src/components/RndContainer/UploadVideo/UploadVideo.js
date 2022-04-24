import React from 'react'
import './uploadVideo.css'
import { Select, message } from 'antd'
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
    }
  }

  componentDidMount () {
    let { element } = this.props
    console.log('uploadVideo componentDidMount', this.props)
    let value = element.content[0].value
    let valueArr = value.split(' ')
    let srcArr = valueArr[3].replace('></iframe>', '').replace('src=', '').replace('"', '').split('?')
    let link2 = srcArr[0]
    let config2 = {}
    config2.width = element.config.width
    config2.height = element.config.height
    let configArr = srcArr[1].split('&')
    configArr.forEach((ele) => {
      console.log(ele, ele.split('=')[1])
      if (ele.indexOf('controls') > -1) {
        config2.controls = Number(ele.split('=')[1])
      }
      if (ele.indexOf('autoplay') > -1) {
        config2.autoplay = Number(ele.split('=')[1])
      }
      if (ele.indexOf('muted') > -1) {
        config2.muted = Number(ele.split('=')[1])
      }
      if (ele.indexOf('loop') > -1) {
        config2.loop = Number(ele.split('=')[1].replace('"', ''))
      }
    })
    this.setState({
      link: link2,
      config: config2
    })
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
    const { trans } = this.props;
    let { link, config } = this.state;
    let html = '';
    let firstSplit = link.indexOf('?') > -1 ? '&' : '?';
    link = `${link}${firstSplit}controls=${config.controls}&autoplay=${config.autoplay}&muted=${config.muted}&loop=${config.loop}`;
    html =
      html +
      `<iframe width="100%" height="100%" src="${link}"></iframe>`;
    this.props.saveUploadVideo(html, config);
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
    this.props.closeDialog()
  };

  render () {
    const {config, link} = this.state
    const {trans} = this.props

    return (
      <div className="uploadWrap">
        <div className="header">
          <span className="header-text">{trans.UEditor.addlink}</span>
          <input type="text" disabled value={link} className="header-inputLink" onChange={this.linkOnchange} />
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
        <div className="uploadVideo-footer">
          <div
            onClick={() => {
              this.handleOk();
            }}
            className="ueditor-button ueditor-confirm">
            {trans.UEditor.confirm}
          </div>
          <div
            onClick={this.handleCancel}
            className="ueditor-button ueditor-cancel">
            {trans.UEditor.cancel}
          </div>
        </div>
      </div>
    )
  }
}

export default UploadVideo
