import React from 'react'
import { Button, Form, Input, Modal, Select, message } from 'antd'
import api from '../../../api/bookApi'
import Tags from './Tags'

const {Option} = Select

class ModalForm extends React.Component {
  state = {
    action: 0,
    modalTitle: '',
    editRecord: {}
  }

  handleSubmit = e => {
    e.preventDefault()
    console.log(e)
    let {formData} = this.props
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if(this.props.type === 'batchUpload'){
        const {userId} = JSON.parse(localStorage.getItem('token')).loginResult.userInfoDto
        values.userId = userId
        const data = new FormData()
        Object.keys(values).forEach(item => {
          if (item === 'file') {
            // data.append('file', values[item]['fileList'][0])
          } else {
            data.append(item, values[item])
          }
        })
        let fileField = document.querySelector('#register_flie')
        console.log(data, fileField.files)
        data.append('file', fileField.files[0])
        fetch('/api/media/audio/batchupload', {
          method: 'POST',
          body: data,
          headers: {
            credentials: 'same-origin',
            // 'Content-Type': 'multipart/form-data'  // 不要加上这个文件类型说明
          }
        }).then(({status}) => {
          console.log(data)
          if (status === 200) {
            this.handleCancal()
            message.success('新增成功');
          }
        })
      }else if (!formData.id) {
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
        var fileField = document.querySelector('#register_flie')
        console.log(data, fileField.files)
        data.append('file', fileField.files[0])
        fetch('/api/media/audio', {
          method: 'POST',
          body: data,
          headers: {
            credentials: 'same-origin',
            // 'Content-Type': 'multipart/form-data'  // 不要加上这个文件类型说明
          }
        }).then(({status}) => {
          console.log(data)
          if (status === 200) {
            this.handleCancal()
            message.success('新增成功');
          }
        })

      } else {
        api.editAudio({
          id: formData.id,
          name: values.name,
          tags: values.tags
        }).then(({state}) => {
          if (state) {
            this.handleCancal()
            message.success('修改成功');
          }
        })
      }

    })
  }
  onChange = (e) => {
    console.log(e)
  }
  handleReset = () => {
    this.props.form.resetFields()
  }
  handleCancal = e => {
    this.handleReset()
    this.props.onCancal(e)
  }

  render () {
    const {visible = false, form, mediaCategorys, formData = {}, mediaCategory,type} = this.props
    const {getFieldDecorator} = form

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    }
    const formTailLayout = {
      labelCol: {span: 12},
      wrapperCol: {span: 12, offset: 8},
    }
    let {id, name, tags} = formData
    // console.log(tags)
    return (
      <Modal
        title={(formData.id ? '修改' : type==='batchUpload'?'批量上传':'新增' + mediaCategory.name)}
        visible={visible}
        footer={null}
        onCancel={this.handleCancal}
      >
        <Form onSubmit={this.handleSubmit}>
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
          {!id && <Form.Item {...formItemLayout} label="media category">
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
          </Form.Item>}
          {!id && <Form.Item {...formItemLayout} label="file">
            {getFieldDecorator('flie', {
              rules: [
                {
                  required: true,
                  message: 'Please select your file',
                },
              ]
            })(
              <Input type='file'>
              </Input>)}
          </Form.Item>}
          {type!=='batchUpload' &&<Form.Item {...formItemLayout} label="file tag">
            {getFieldDecorator('tags', {
              rules: [
                {
                  required: true,
                  message: 'Please select your tags',
                },
              ],
              initialValue: tags,
            })(<Tags></Tags>)}
          </Form.Item>}
          <Form.Item {...formTailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleCancal}>
              Cancal
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

const AddForm = Form.create({name: 'register'})(ModalForm)
export default AddForm
