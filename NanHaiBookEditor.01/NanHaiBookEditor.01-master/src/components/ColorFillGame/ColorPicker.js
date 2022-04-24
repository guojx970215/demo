import React from 'react'
import { Button, Input, Tag, Tooltip } from 'antd'
import { ChromePicker } from 'react-color';

class ColorPicker extends React.Component {
  state = {
    colorPickerVisible: false,
    pickColor: '',
    originColor:''
  }
  componentDidMount() {
    this.setState({
      pickColor: this.props.color,
      originColor:this.props.color
    })
  }
  render() {
    const { colorPickerVisible, pickColor,originColor } = this.state
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
          backgroundColor: color
        }} onClick={() => {
          this.setState({
            colorPickerVisible: true
          })
        }}></div>
        {colorPickerVisible && <div
          className="color-picker"
          style={{
            top: 22,
            left: 22
          }}>
          <ChromePicker
            color={pickColor}
            onChange={color => {
              this.setState({
                pickColor: color.hex
              },this.props.change(color.hex))
            }}
          />
          <div style={{
            textAlign: 'center'
          }}>
            <Button
              type="primary"
              onClick={() => {
                this.props.change(pickColor)
                this.setState({
                  colorPickerVisible: false,
                  originColor:pickColor
                })
              }}
            >确定</Button>
            <Button
              style={{
                marginLeft: 10
              }}
              onClick={() => {
                this.setState({
                  pickColor: originColor,
                  colorPickerVisible: false
                },this.props.change(originColor))
              }}
            >取消</Button>
          </div>
        </div>}
      </div>
    )
  }
}

export default ColorPicker
