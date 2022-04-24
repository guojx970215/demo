import React from 'react'
import './uploadVideo.css'
import Api from '../../../api/bookApi';
import ModalList from './ModalList'
import { Select,Form,Input, Modal, Checkbox,message } from 'antd'
import Tags from './Tags'
const { Option } = Select
class UploadAudio extends React.Component {
  state = {
    // 是否加入音乐库
    isAddMusic: false,
    // 是否加入工作空间
    isAddToWS: true,
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
    uploadFile: '',
    visibleList: false,
    addMusicDisable: false
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
      link: src,
      addMusicDisable: true,
      isAddMusic:false
    })
  }
  addMusicCheckBOX = (e) => {
    console.log('addMusicCheckBOX', e.target.checked)
    this.setState({
      isAddMusic: e.target.checked
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
    const {isAddMusic, uploadFile ,isAddToWS} = this.state;
    // 是否添加到音乐库
    if (isAddMusic) {
      this.handleAddToDB(uploadFile).then(result =>{
        if(isAddToWS){
          this.handleToWs()
        }
      })
    }else{
      if(isAddToWS){
        this.handleToWs()
        this.props.handleCancel(true)
      }
      else{
            message.error('请选择加入音乐库或者工作空间');
      }
    }
  }

  handleToWs = ()=>{
    const { addElement } = this.props;
    const { link, config} = this.state;
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
        console.log('为audio添加属性paused，表示该音频当前的播放状态', audio, config)
        html = html + 'paused=' + audio.paused + ' style="width:100%;height:100%;" ' + ` data-extra=${JSON.stringify(dataExtra)}  controlsList="nodownload"></audio>`;
        addElement('AudioBox', {
          content: html,
          width: config.width,
          height: config.height
        });
  }

  handleAddToDB = (uploadFile)=> {
    let {formData} = this.props
    let handleCancal = this.handleCancel
    return this.props.form.validateFields((err, values) => {
        const {userId} = JSON.parse(localStorage.getItem('token')).loginResult.userInfoDto
        values.userId = userId
        const data = new FormData()
        values.tags = values.tags.join(',')
        Object.keys(values).forEach(item => {
          if (item === 'file') {
            // data.append('file', values[item]['fileList'][0])
          } else {
            data.append(item, values[item])
          }
        })
        data.append('file', uploadFile);
        fetch('/api/media/audio', {
          method: 'POST',
          body: data,
          headers: {
            credentials: 'same-origin',
            // 'Content-Type': 'multipart/form-data'  // 不要加上这个文件类型说明
          }
        }).then(({status}) => {
          if (status === 200) {
            handleCancal()
            message.success('新增成功');
          }
        })
    })
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
      isAddMusic: false,
      uploadFile: ''
    })
    this.props.handleCancel()
  }
  upload = (e) => {
    console.log(e.target.files[0].name)
    this.setState({
      uploadFile: e.target.files[0],
      name: e.target.files[0].name
    })
    let data = new FormData();
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
            link: upres.result.url,
            addMusicDisable: false
          })
        }
    })
  }

  render () {
    const {config, link, visibleList, isAddMusic, addMusicDisable,isAddToWS, name} = this.state
    const {visible, trans, form,mediaCategorys, formData = {}, mediaCategory,type} = this.props
    const {getFieldDecorator} = form

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    }

    console.log('formDataformDataformData', formData)


    return (
      <Modal
        title={trans.UEditor.uploadAudio}
        width={648}
        visible={true}
        cancelText={trans.UEditor.cancel}
        okText={trans.UEditor.confirm}
        onOk={this.handleOk}
        onCancel={this.handleCancel}>
        <div className="header">
          <span className="header-text">{trans.UEditor.addlink}</span>
          <input type="text" value={link} className="header-inputLink" onChange={this.linkOnchange} />
          <label className="upload-btn">
              {trans.UEditor.upload}
            <input type="file" style={{display: 'none'}} onChange={this.upload} />
          </label>
          {/* <div className="upload-btn" onClick={this.showMusicModal}>select</div> */}
        </div>
        <div style={{padding: '10px 0'}}>
          <Checkbox checked={isAddMusic} disabled={addMusicDisable} onChange={this.addMusicCheckBOX}>加入音乐库</Checkbox>
          <Checkbox checked={isAddToWS} onChange={(e)=>{
            this.setState({
              isAddToWS:e.target.checked
            })
          }}>加入工作空间</Checkbox>
        </div>
        {isAddMusic && <Form onSubmit={this.handleSubmit}>
          {type!=='batchUpload' &&<Form.Item {...formItemLayout} label="Name">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please input your name',
                },
              ],
              initialValue: name,
            })(<Input placeholder="Please input file name"/>)}
          </Form.Item>
          }
          <Form.Item {...formItemLayout} label="media category">
            {getFieldDecorator('mediaCategory', {
              rules: [
                {
                  required: true,
                  message: 'Please select your media category',
                },
              ],
              initialValue: mediaCategory.value > -1 ? mediaCategory.value : undefined,
            })(<Select placeholder="Please select your media category">
              {mediaCategorys.map(item => {
                return (item.value && item.value > -1) || item.value === 0? <Option key={item.value} value={item.value}>{item.name}</Option>:''
              })}
            </Select>)}
          </Form.Item>
          {type!=='batchUpload' &&<Form.Item {...formItemLayout} label="file tag">
            {getFieldDecorator('tags', {
              rules: [
              ],
              initialValue: [],
            })(<Tags></Tags>)}
          </Form.Item>}
        </Form>}
        {isAddToWS && 
        <div>
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
        </div>
        }
        {visibleList&& <ModalList trans={trans}  selectMusic={this.selectMusic} isSelect={true} visible={true} onlyForSelect={true} onCancal={()=>{
          this.setState({
            visibleList: false
          })
        }}></ModalList>}
      </Modal>
    )
  }
}


const AddForm = Form.create({name: 'register'})(UploadAudio)
export default AddForm