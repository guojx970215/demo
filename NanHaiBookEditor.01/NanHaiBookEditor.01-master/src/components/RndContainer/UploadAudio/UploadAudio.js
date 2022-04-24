import React from 'react'
import './uploadVideo.css'
import Api from '../../../api/bookApi';
import ModalList from '../../AudioMenu/components/ModalList'
import { Select, Checkbox } from 'antd'
const { Option } = Select

class UploadAudio extends React.Component {
  state = {
    isAddMusic: false,
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
      loop: 0,
      width: 300,
      height: 54
    },
    visibleList: false
  }
  showMusicModal = () => {
    console.log('showMusicModal')
    this.setState({
      visibleList: true
    })
  }
  selectMusic = (src) => {
    console.log('选择音乐', src)
    this.setState({
      visibleList: false,
      link: src
    })
  }
  addMusicCheckBOX = (e) => {
    console.log('addMusicCheckBOX', e.target.checked)
    this.setState({
      isAddMusic: e.target.checked
    })
  }
  // 控制音频播放状态
  controlAudio = (paused) => {
    let audio = document.querySelector('.preview').querySelector('audio');
    console.log('控制音频播放状态控制音频播放状态控制音频播放状态', audio, paused);
    setTimeout(() => {
      if (paused === 'true') {
        audio.pause();
      } else {
        audio.play();
      }
    }, 100)
  }
  componentDidMount () {
    let { element } = this.props
    console.log('uploadAudio componentDidMount', this.props)
    let value = element.content[0].value
    let srcArr = value.replace('<audio', '').replace('></audio>', '').trim().split(' ')
    let link2 = srcArr[1].split('=')[1].replace(/"/g, '')
    let config2 = {}
    config2.width = element.config.width
    config2.height = element.config.height
    let configArr = srcArr.slice(2, srcArr.length - 1)
    if (configArr.indexOf('controls') > -1) {
      config2.controls = 1
    } else {
      config2.controls = 0
    }
    if (configArr.indexOf('autoplay') > -1) {
      config2.autoplay = 1
    } else {
      config2.autoplay = 0
    }
    if (configArr.indexOf('loop') > -1) {
      config2.loop = 1
    } else {
      config2.loop = 0
    }
    console.log('configArrconfigArrconfigArr', configArr, configArr.indexOf('autoplay'), configArr.indexOf('loop'), config2)
    let extra = JSON.parse(srcArr[srcArr.length - 1].split('=')[1])
    config2.poster = extra.poster
    config2.name = extra.name
    config2.author = extra.author
    this.setState({
      link: link2,
      config: config2
    })
    let index = configArr.findIndex((ele) => {
      return ele.indexOf('paused') > -1
    })
    let paused = 'true'
    if (index > -1) {
      paused = configArr[index].split('=')[1]
    }
    this.controlAudio(paused)
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
  linkOnchange = (e) => {
    console.log('linkOnchange', e.target.value)
    this.setState({
      link: e.target.value
    })
  }
  posterChange = (e) => {
    console.log('posterChange', e.target.value)
    let config = JSON.parse(JSON.stringify(this.state.config))
    config.poster = e.target.value
    this.setState({
      config: config
    })
  }
  nameChange = (e) => {
    console.log('nameChange', e.target.value)
    let config = JSON.parse(JSON.stringify(this.state.config))
    config.name = e.target.value
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
  authorChange = (e) => {
    console.log('authorChange', e.target.value)
    let config = JSON.parse(JSON.stringify(this.state.config))
    config.author = e.target.value
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
    const { link, config } = this.state;
    let html = '';
    let dataExtra = {
      poster: config.poster,
      name: config.name,
      author: config.author
    }
    html = html + `<audio class="ueditorAudio" src="${link}"`;
    if (config.controls === 1) {
      html = html + ' controls '
    }
    if (config.autoplay === 1) {
      html = html + ' autoplay '
    }
    if (config.loop === 1) {
      html = html + ' loop '
    }
    // 为audio添加属性paused，表示该音频当前的播放状态
    let audio = document.querySelector('.preview').querySelector('audio');
    // audio.setAttribute('paused', audio.paused);
    console.log('为audio添加属性paused，表示该音频当前的播放状态', audio)
    html = html + 'paused=' + audio.paused + ' style="width:100%;height:100%;" ' + ` data-extra=${JSON.stringify(dataExtra)} controlsList="nodownload"></audio>`;
    this.props.saveUploadAudio(html, config);
    this.handleCancel()
  }
  handleCancel = e => {
    this.setState({
      linkList: [],
      config: {
        author: '',
        poster: '',
        controls: 1,
        autoplay: 0,
        name: '',
        loop: 0,
        width: 300,
        height: 54
      },
      link: '',
      isAddMusic: false
    })
    this.props.closeDialog()
  }
  upload = (e) => {
    let { isAddMusic } = this.state
    let data = new FormData();
    if (isAddMusic) {
      data.append('file', e.target.files[0]);
      data.append('userId', Api.getUserId());
      fetch('/api/media/audio', {
          method: 'POST',
          body: data,
          headers: {
              credentials: 'same-origin',
          }
      }).then(res => res.json()).then(upres => {
          if (upres.state) {
            console.log(upres.result)
            this.setState({
              link: upres.result
            })
          }
      })
    } else {
      data.append('file', e.target.files[0]);
      fetch('/api/file/upload', {
          method: 'POST',
          body: data,
          headers: {
              credentials: 'same-origin',
          }
      }).then(res => res.json()).then(upres => {
          if (upres.state) {
            console.log(upres.result)
            this.setState({
              link: upres.result.url
            })
          }
      })
    }
  }

  render () {
    const {config, link, visibleList, isAddMusic} = this.state
    const {visible, trans} = this.props
    console.log('renderrenderrenderrender', config)
    return (
      <div className="uploadWrap">
        <div className="header">
          <span className="header-text">{trans.UEditor.addlink}</span>
          <input type="text" disabled value={link} className="header-inputLink" onChange={this.linkOnchange} />
          {/* <label className="upload-btn">
              {trans.UEditor.upload}
            <input type="file" style={{display: 'none'}} onChange={this.upload} />
          </label>
          <div className="upload-btn" onClick={this.showMusicModal}>select</div> */}
        </div>
        {/* <div style={{padding: '10px 0'}}>
          <Checkbox checked={isAddMusic} onChange={this.addMusicCheckBOX}>加入音乐库</Checkbox>
        </div> */}
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
              value={config.controls}
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
              value={config.autoplay}
              onChange={this.autoplayChange}>
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
              value={config.loop}
              onChange={this.loopChange}>
              <Option value={1}>true</Option>
              <Option value={0}>false</Option>
            </Select>
          </label>
          <label className="config-label">
            <span className="label-name">poster</span>
            <input value={config.poster} type="text" onChange={this.posterChange} className="label-input" />
          </label>
          <label className="config-label">
            <span className="label-name">name</span>
            <input value={config.name} type="text" onChange={this.nameChange} className="label-input" />
          </label>
          <label className="config-label">
            <span className="label-name">author</span>
            <input value={config.author} type="text" onChange={this.authorChange} className="label-input" />
          </label>
        </form>
        <div className="preview">
          <audio controlsList="nodownload" controls style={{width: 300, height: 54}} src={link}></audio>
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
        <ModalList trans={trans}  selectMusic={this.selectMusic} isSelect={true} visible={visibleList}></ModalList>
      </div>
    )
  }
}

export default UploadAudio
