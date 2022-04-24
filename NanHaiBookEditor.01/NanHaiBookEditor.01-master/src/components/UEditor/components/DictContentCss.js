import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox, InputNumber, Switch } from 'antd';
class DictContentCss extends Component {
  state = {
    setting: {
      fontSize: ''
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values)
      }
    });
  };
  render() {

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const { fontSize, fontWeight, underline, fontStyle, lineHeight } = this.props.setting
    return (
      <Form onSubmit={this.handleSubmit}  {...formItemLayout}>
        <Form.Item label="字体大小">
          {getFieldDecorator('fontSize', {
            initialValue: fontSize
          })(
            <InputNumber
              placeholder="font size"
            />,
          )}
        </Form.Item>
        <Form.Item label="加粗">
          {getFieldDecorator('fontWeight', {
            valuePropName: 'checked',
            initialValue: fontWeight
          })(
            <Switch />
          )}
        </Form.Item>
        <Form.Item label="下划线">
          {getFieldDecorator('underline', {
            valuePropName: 'checked',
            initialValue: underline
          })(
            <Switch />
          )}
        </Form.Item>
        <Form.Item label="斜体">
          {getFieldDecorator('fontStyle', {
            valuePropName: 'checked',
            initialValue: fontStyle
          })(
            <Switch />
          )}
        </Form.Item>
        <Form.Item label="行距">
          {getFieldDecorator('lineHeight', {
            initialValue: lineHeight
          })(
            <InputNumber
              placeholder="line height"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            confirm
          </Button>
        </Form.Item>
      </Form>)
  }
}

export default Form.create({ name: 'register' })(DictContentCss);
