import React from 'react'
import './InsertLink.css'
import { Input, Modal, message, Checkbox } from 'antd'

class InsertLink extends React.Component {
  state = {
    content: '',
    linkUrl: '',
    title: '',
    isBlank: false
  }
  componentDidMount () {
    this.props.onRef(this)
  }
  init = (selectTxt, nodeTitle, nodeHref, nodeTarget) => {
    this.setState({
      content: selectTxt,
      linkUrl: nodeHref,
      title: nodeTitle,
      isBlank: nodeTarget
    })
  }
  contentChange = (e) => {
    // console.log('contentChange', e.target.value)
    this.setState({
      content: e.target.value
    })
  }
  linkUrlChange = (e) => {
    // console.log('linkUrlChange', e.target.value)
    this.setState({
      linkUrl: e.target.value
    })
  }
  titleChange = (e) => {
    // console.log('titleChange', e.target.value)
    this.setState({
      title: e.target.value
    })
  }
  isBlankChange = (e) => {
    // console.log('titleChange', e)
    this.setState({
      isBlank: e.target.checked
    })
  }
  handleOk = e => {
    let { content, linkUrl, title, isBlank } = this.state;
    if (!content) {
      message.info('请输入文本内容')
      return false
    }
    let patt = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
    if (linkUrl && !patt.test(linkUrl)) {
      message.info('请输入正确的链接')
      return false
    }
    this.props.handleOk(content, linkUrl, title, isBlank)
    this.handleCancel()
  }
  handleCancel = e => {
    this.props.handleCancel()
  }

  render () {
    const { content, linkUrl, title, isBlank } = this.state
    const { visible, trans } = this.props

    return (
      <Modal
        title={trans.UEditor.insertLink}
        visible={visible}
        cancelText={trans.UEditor.cancel}
        okText={trans.UEditor.confirm}
        onOk={this.handleOk}
        onCancel={this.handleCancel}>
        <div className="insertLinkMain">
          <div className="item">
            <span className="name">文本内容: </span>
            <Input value={content} size="small" className="value" placeholder=""
              onChange={this.contentChange} />
          </div>
          <div className="item">
            <span className="name">链接地址: </span>
            <Input value={linkUrl} size="small" className="value" placeholder=""
              onChange={this.linkUrlChange} />
          </div>
          <div className="item">
            <span className="name">标题: </span>
            <Input value={title} size="small" className="value" placeholder=""
              onChange={this.titleChange} />
          </div>
          <div className="item">
            <span className="name">是否在新窗口打开: </span>
            <Checkbox checked={isBlank} className="value" size="small" onChange={this.isBlankChange}></Checkbox>
          </div>
        </div>
      </Modal>
    )
  }
}

export default InsertLink