import React from 'react'
import { Button, Form, Radio, Input, message, Modal, Select, InputNumber, Slider, Checkbox, Divider, Row, Col } from 'antd'
import api from '../../api/bookApi'
import Tags from './Tags'
import ColorPicker from './ColorPicker';

const { Option } = Select

class ModalForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action: 0,
      modalTitle: '',
      editRecord: {},
      colorPickerVisible: false,
      submitButton: false,
      isAddToDB: false,
      isAddToWS: true,
      metadata: {},
      pickColor: '#000000'
    }
  }

  componentDidMount() {
    let { formData } = this.props
    if (formData) {
      if (!formData.metadata) {
        formData.metadata = {}
      }
      const {
        borderWidth = 0,
        imgOpacity = 0,
        borderColor = '#000000',
        borderStyle = 'solid',
        boxColor = '#000000',
        boxHShadow = 0,
        boxVShadow = 0,
        boxBlur = 0,
        boxSpread = 0,
        boxInset = 'inset',
        shadowType = '1',
        boxShadowText = '',
        borderRadius = 0
      } = formData.metadata
      this.setState({
        pickColor: borderColor,
        metadata: {
          borderWidth: borderWidth,
          imgOpacity: imgOpacity,
          borderColor: borderColor,
          borderStyle: borderStyle,
          boxColor: boxColor,
          boxHShadow: boxHShadow,
          boxVShadow: boxVShadow,
          boxBlur: boxBlur,
          boxSpread: boxSpread,
          boxInset: boxInset,
          shadowType: shadowType,
          boxShadowText: boxShadowText,
          borderRadius: borderRadius
        }
      });
    }
  }
  handleAddToDB = (flag) => {
    const { metadata } = this.state
    const { modalForm } = this.props.trans
    let { formData, type } = this.props
    this.props.form.validateFields((err, values) => {
      if (this.props.type === 'batchUpload') {
        const { userId } = JSON.parse(localStorage.getItem('token')).loginResult.userInfoDto
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
        data.append('file', fileField.files[0])
        data.append('mediaCategory', 5)
        fetch('/api/media/image/batchupload', {
          method: 'POST',
          body: data,
          headers: {
            credentials: 'same-origin',
            // 'Content-Type': 'multipart/form-data'  // 不要加上这个文件类型说明
          }
        }).then(({ status }) => {
          if (status === 200) {
            message.success(modalForm.addSuccess)
            this.handleCancal()
          }
        })
      } else if (!formData.id) {
        //新增操作
        const { userId } = JSON.parse(localStorage.getItem('token')).loginResult.userInfoDto
        values.userId = userId
        const data = new FormData()
        values.tags = values.tags ? values.tags.join(',') : ''

        values.metadata = JSON.stringify(metadata)

        Object.keys(values).forEach(item => {
          if (item === 'file') {
            // data.append('file', values[item]['fileList'][0])
          } else {
            data.append(item, values[item])
          }
        })
        var fileField = document.querySelector('#register_flie')
        data.append('file', fileField.files[0])
        fetch('/api/media/image', {
          method: 'POST',
          body: data,
          headers: {
            credentials: 'same-origin',
            // 'Content-Type': 'multipart/form-data'  // 不要加上这个文件类型说明
          }
        }).then(({ status }) => {
          if (status === 200) {
            message.success(modalForm.addSuccess)
            this.handleCancal()
          }
        })
        console.log('Received values of form: ', values)
      } else {
        //修改操作
        let params = {
          ...formData,
          id: formData.id,
          ifCopy: flag === 'new',
          metadata: JSON.stringify(metadata)
        }
        if (type !== 'editCss') {
          params.name = values.name
          params.tags = values.tags
        }
        api.editImage(params).then(({ state }) => {
          if (state) {
            message.success(modalForm.updateSuccess)
            this.handleCancal()
          }
        })
      }
    })
  }
  handleSubmit = e => {
    const { isAddToDB, isAddToWS, metadata } = this.state
    const { formData, type } = this.props
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        //如果是批量添加
        if (type === 'batchUpload') {
          this.handleAddToDB()
          return
        }
        if (type === 'edit' || (!isAddToDB && !isAddToWS)) {
          // 如果都没有选择，则修改数据库中原图
          this.handleAddToDB()
          return
        }
        if (isAddToDB) {
          // 如果选择插入数据库，并且数据库没有，则插入一张新图
          if (formData.id) {
            this.handleAddToDB('new')
          } else {
            this.handleAddToDB()
          }
        }
        if (isAddToWS) {
          this.props.addToWs(formData.url)
          this.handleCancal()
        }
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
  changeFile = () => {
    let { name } = this.props.formData
    let fileField = document.querySelector('#register_flie')
    if (fileField && fileField.files && fileField.files.length > 0 && (!name || name === '')) {
      this.props.formData.name = fileField.files[0].name
      this.uploadFile(fileField.files[0]).then(url => {
        this.props.formData.url = url
        this.setState({
          uploadFile: fileField.files[0],
          submitButton: true
        })
      })
    }
  }

  uploadFile = (file) => {
    let data = new FormData();
    data.append('file', file);
    return new Promise((resolve, reject) => {
      fetch('/api/file/upload', {
        method: 'POST',
        body: data,
        headers: {
          credentials: 'same-origin',
        }
      }).then(res => res.json()).then(upres => {
        if (upres.state) {
          console.log(upres.result)
          resolve(upres.result.url)
        }
      })
    })
  }

  render() {
    const { form, mediaCategorys, formData = {}, mediaCategory, type, trans } = this.props
    const { getFieldDecorator } = form
    const { colorPickerVisible, pickColor, submitButton, isAddToDB, isAddToWS, metadata } = this.state
    const { borderWidth, borderColor, imgOpacity, borderStyle, boxColor, borderRadius } = metadata
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }
    const formTailLayout = {
      labelCol: { span: 12 },
      wrapperCol: { span: 12, offset: 8 },
    }
    let { id, name, tags } = formData
    let accept = 'image/jpg, image/png, image/jpeg, image/gif'
    if (mediaCategory.value === 4) {
      accept = 'image/svg'
    }
    if (type === 'batchUpload') {
      accept = 'application/zip,application/x-zip,application/x-zip-compressed'
    }
    let boxShadowText = metadata.shadowType === '1' ? metadata.boxShadowText : (
      metadata.boxHShadow + 'px ' + metadata.boxVShadow + 'px ' + metadata.boxBlur + 'px ' + metadata.boxSpread + 'px ' + metadata.boxColor + ' ' + (metadata.boxInset === 'inset' ? 'inset' : '')
    )
    return (
      <Modal
        title={(formData.id ? trans.modalForm.mod : type === 'batchUpload' ? trans.modalForm.batchUpload : trans.modalForm.addPics)}
        visible={true}
        footer={null}
        onCancel={this.handleCancal}
        width={'600px'}
      >
        <Form onSubmit={this.handleSubmit}>
          {
            type !== 'batchUpload' && type !== 'editCss' &&
            <Form.Item {...formItemLayout} label="Name">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your name',
                  },
                ],
                initialValue: name,
              })(<Input placeholder="Please input file name" />)}
            </Form.Item>
          }
          {((type === 'batchUpload' && isAddToDB) || (!id && isAddToDB && type !== 'editCss')) && <Form.Item {...formItemLayout} label="picture category">
            {getFieldDecorator('mediaCategory', {
              rules: [
                {
                  required: true,
                  message: 'Please select your picture category',
                },
              ],
              initialValue: mediaCategory.value > -1 ? mediaCategory.value : undefined,
            })(<Select placeholder="Please select your picture category">
              {mediaCategorys.map(item => {
                return item.value !== -1 ? <Option key={item.value} value={item.value}>{trans.OtherMenu[item.lang]}</Option> : ''
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
              <Input type='file' accept={accept} onChange={this.changeFile()}>
              </Input>)}
          </Form.Item>}
          {
            (type === 'edit' || (type !== 'batchUpload' && type !== 'editCss' && ((!isAddToWS && !isAddToDB && formData.id) || isAddToDB))) && <Form.Item {...formItemLayout} label="file tag">
              {getFieldDecorator('tags', {
                rules: [
                ],
                initialValue: tags,
              })(<Tags mediaCategory={formData.mediaCategory}></Tags>)}

            </Form.Item>
          }

          <Form.Item>{formData.url && type === 'editCss' &&
            <div>
              <div style={{
                width: '50%',
                maxHeight: '500px',
                margin: 'auto',
                opacity: `${(100 - imgOpacity) / 100}`,
              }}><div style={{
                borderStyle: borderStyle,
                borderWidth: borderWidth + 'px',
                borderRadius: borderRadius + 'px',
                borderColor: borderColor,
                boxShadow: boxShadowText,
                width: '100%',
                height: '100%',
                overflow: 'hidden'
              }}></div></div>

              <div style={{
                display: 'flex',
                position: 'relative',
                justifyContent: 'space-between',
                marginTop: '10px'
              }}>

                <div style={{
                  width: '45%'
                }}>

                  <div>{trans.modalForm.borderWidth}<InputNumber min={0} defaultValue={0}
                    style={{ marginLeft: 16 }}
                    value={borderWidth}
                    precision={0} onChange={(value) => {
                      metadata.borderWidth = value
                      this.setState({
                        metadata: metadata
                      })
                    }} /></div>
                  <div>{trans.modalForm.boxRadius}<InputNumber min={0} defaultValue={0}
                    style={{ marginLeft: 16 }}
                    value={borderRadius}
                    precision={0} onChange={(value) => {
                      metadata.borderRadius = value
                      this.setState({
                        metadata: metadata
                      })
                    }} /></div>
                  {borderWidth > 0 &&
                    <div>
                      <div>
                        <span>{trans.modalForm.borderColor}</span>
                        <ColorPicker color={borderColor} change={value => {
                          metadata.borderColor = value
                          this.setState({
                            metadata
                          })
                        }}></ColorPicker>
                      </div>
                      <div>
                        <span>border-style:</span>
                        <Select defaultValue="solid" style={{ width: 120 }} onChange={(value) => {
                          metadata.borderStyle = value
                          this.setState({ metadata: metadata })
                        }}>
                          <Option value="dotted">dotted</Option>
                          <Option value="dashed">dashed</Option>
                          <Option value="solid">solid</Option>
                          <Option value="double">double</Option>
                          <Option value="groove">groove</Option>
                          <Option value="ridge">ridge</Option>
                          <Option value="inset">inset</Option>
                          <Option value="outset">outset</Option>
                        </Select>
                      </div>
                    </div>}
                </div>
                <Divider type="vertical" style={{
                  position: 'absolute',
                  height: '100%',
                  left: '50%'
                }} />
                <div style={{
                  width: '45%'
                }}>
                  <div>
                    <div>{trans.modalForm.boxShadow}:
                    <Radio.Group onChange={(e) => {
                        metadata.shadowType = e.target.value
                        this.setState({
                          metadata: metadata
                        })
                      }} defaultValue={metadata.shadowType} buttonStyle="solid">
                        <Radio.Button value="1">{trans.modalForm.textSet}</Radio.Button>
                        <Radio.Button value="2">{trans.modalForm.setManually}</Radio.Button>
                      </Radio.Group>
                    </div>
                    {metadata.shadowType === '1' &&
                      <Input value={metadata.boxShadowText} placeholder={trans.modalForm.example + ":5px 8px 4px #756c6c"} onChange={(e) => {
                        metadata.boxShadowText = e.target.value
                        this.setState({
                          metadata: metadata
                        })
                      }} />}
                    {metadata.shadowType === '2' &&
                      <div>
                        <Row>
                          <Col span={12}>h-offset:<InputNumber
                            size="small"
                            style={{ width: 50 }}
                            value={metadata.boxHShadow}
                            precision={0} onChange={(value) => {
                              metadata.boxHShadow = value
                              this.setState({
                                metadata: metadata
                              })
                            }} /></Col>
                          <Col span={12}>v-offset:<InputNumber
                            size="small"
                            style={{ width: 50 }}
                            value={metadata.boxVShadow}
                            precision={0} onChange={(value) => {
                              metadata.boxVShadow = value
                              this.setState({
                                metadata: metadata
                              })
                            }} /></Col>
                        </Row>
                        <div>
                          blur radius:<InputNumber
                            size="small"
                            style={{ width: 80 }}
                            value={metadata.boxBlur}
                            precision={0} onChange={(value) => {
                              metadata.boxBlur = value
                              this.setState({
                                metadata: metadata
                              })
                            }} />
                        </div>
                        <div>
                          spread radius:<InputNumber
                            size="small"
                            style={{ width: 80 }}
                            value={metadata.boxSpread}
                            precision={0} onChange={(value) => {
                              metadata.boxSpread = value
                              this.setState({
                                metadata: metadata
                              })
                            }} />
                        </div>
                        <div>
                          color:<ColorPicker color={boxColor} change={(value) => {
                            metadata.boxColor = value
                            this.setState({
                              metadata: metadata
                            })
                          }}></ColorPicker>
                        </div>
                        <div>
                          <Radio.Group onChange={(e) => {
                            metadata.boxInset = e.target.value
                            this.setState({
                              metadata: metadata
                            })
                          }} defaultValue={metadata.boxInset} buttonStyle="solid">
                            <Radio.Button value="inset">inset</Radio.Button>
                            <Radio.Button value="outset">outset</Radio.Button>
                          </Radio.Group>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
              <div style={{
                width: 200,
                margin: 'auto'
              }}>{trans.modalForm.transprant}<Slider min={0}
                max={100}
                value={imgOpacity}
                onChange={(value) => {
                  metadata.imgOpacity = value
                  this.setState({
                    metadata: metadata
                  })
                }}
                /></div>
            </div>
          }</Form.Item>
          {
            type !== 'edit' &&
            <div style={{ padding: '10px 0', textAlign: 'center' }}>
              {
                type !== 'batchUpload' && 
                <Checkbox checked={isAddToDB} onChange={(e) => {
                  this.setState({
                    isAddToDB: e.target.checked
                  })
                }}>{trans.modalForm.addToLib}</Checkbox>
              }
              {
                type !== 'batchUpload' && 
                <Checkbox checked={isAddToWS} onChange={(e) => {
                  this.setState({
                    isAddToWS: e.target.checked
                  })
                }}>{trans.modalForm.addToWs}</Checkbox>
              }
            </div>
          }
          <Form.Item {...formTailLayout}>
            <Button type="primary" htmlType="submit" disabled={!(formData.id || submitButton) || !formData.id && !isAddToDB && !isAddToWS}>
              {trans.modalForm.submit}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleCancal}>
              {trans.modalForm.cancel}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

const AddForm = Form.create({ name: 'register' })(ModalForm)
export default AddForm
