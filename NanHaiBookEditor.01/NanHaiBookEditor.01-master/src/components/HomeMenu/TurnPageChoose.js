import React from 'react'
import { Modal, Switch, Icon } from 'antd'
class TurnPageChoose extends React.Component {
  state = {
    type: false
  }
  componentDidMount() {
    const { type = 0 } = this.props
    this.setState({
      type: this.props.type ? true : false
    })
  }
  handleOk = () => {
    const { type } = this.state
    this.props.handleChange(type ? 1 : 0)
    this.props.handleClose()
  }
  handleCancel = () => {
    this.props.handleClose()
  }
  render() {
    const { trans } = this.props
    const { type } = this.state
    return (
      <Modal
        title={trans.HomeMenu.pageTurn}
        visible={true}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <span>{trans.TurnPageChoose.TurnPageChoose}: </span>
        <Switch
          checkedChildren={< Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
          checked={type} onChange={checked => {
            this.setState({type: checked})
          }} />
      </Modal>
    )
  }
}

export default TurnPageChoose
