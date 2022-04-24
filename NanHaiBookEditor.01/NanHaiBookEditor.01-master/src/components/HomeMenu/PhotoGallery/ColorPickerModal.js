import React from 'react'
import { Button } from 'antd'
import { ChromePicker } from 'react-color';

class ColorPickerModal extends React.Component {
  state = {
    pickColor: '',
    originColor: ''
  }
  componentDidMount() {
    this.setState({
      pickColor: this.props.color,
      originColor: this.props.color
    })
  }

  changeRgbObject(rgb) {
    const { r, g, b, a } = rgb
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
  }
  render() {
    const { pickColor, originColor } = this.state
    return (
      <div
        className="color-picker"
        style={{
          top: 22,
          left: 22
        }}>
        <ChromePicker
          color={pickColor}
          onChange={color => {
            const rgb = this.changeRgbObject(color.rgb)
            this.setState({
              pickColor: rgb
            }, this.props.change(rgb))
          }}
        />
        <div style={{
          textAlign: 'center'
        }}>
          <Button
            type="primary"
            onClick={() => {
              this.setState({
                originColor: pickColor
              }, this.props.change(pickColor))
              this.props.onClose()
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
              }, this.props.change(originColor))
              this.props.onClose()
            }}
          >取消</Button>
        </div>
      </div>
    )
  }
}

export default ColorPickerModal
