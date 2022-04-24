import React from 'react'
import { Button, Input, Tag, Tooltip } from 'antd'
import { ChromePicker } from 'react-color';
import ReactDOM from 'react-dom';
import ColorPickerModal from './ColorPickerModal';
class ColorPicker extends React.Component {
  modal(e) {
    const { color, change } = this.props
    let body = document.body;
    let showDom = document.createElement("div");
    // 设置基本属性
    showDom.style.position = 'absolute';
    showDom.style.top = e.pageY + 'px';
    showDom.style.left = e.pageX + 'px';
    if (body.clientHeight - e.pageY < 300) {
      showDom.style.top = (body.clientHeight - 300) + 'px'
    }
    if (body.clientWidth - e.pageX < 250) {
      showDom.style.left = (body.clientWidth - 250) + 'px'
    }
    showDom.style.zIndex = '9999';
    body.appendChild(showDom);
    // 自我删除的方法
    let close = () => {
      ReactDOM.unmountComponentAtNode(showDom);
      body.removeChild(showDom);
    }
    ReactDOM.render(
      <ColorPickerModal color={color} onClose={close} change={change} />,
      showDom
    )
  }

  render() {
    const { color } = this.props
    return (
      <div style={{
        display: 'inline-block',
        position: 'relative',
        margin: '2px',
        boxShadow: '1px 1px 3px #c7c1c1'
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          backgroundColor: color,
          cursor: 'pointer'
        }} onClick={e => {
          this.modal(e)
        }}></div>
      </div>
    )
  }
}

export default ColorPicker
