import React from 'react';
import {
  Button,
  Switch,
  Form,
  Upload,
  Icon,
  Radio,
  Input,
  message,
  Modal,
  Select,
  InputNumber,
  Slider,
  Checkbox,
  Divider,
  Row,
  Col,
  Collapse,
} from 'antd';
import api from '../../../api/bookApi';
import Tags from './Tags';
import SvgImg from './SvgImg';
import ColorPicker from './ColorPicker';

const { Option } = Select;

function getSvgHtml(url, colors) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        if (text.indexOf('<svg') > -1) {
          text = text.substring(text.indexOf('<svg'), text.length);
        }
        if (colors && colors.length > 0) {
          colors.forEach((item) => {
            text = text.replace(item.color, item.newColor);
          });
        }
        resolve(text);
      });
  });
}
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
      isSetToBackGround: false,
      metadata: {},
      pickColor: '#000000',
      svgImgColors: [],
      svgResetColor: false,
      svgImgRef: null,
      file: null,
      fileList: [],
      chooseTagsRef: null,
      placement: 1,
      opacityValue: 0,
    };
  }

  ifSvgImg(url) {
    if (url && url.substring(url.length, url.lastIndexOf('.')) === '.svg') {
      return true;
    }
    return false;
  }

  componentDidMount() {
    let { formData } = this.props;

    if (formData) {
      if (!formData.metadata) {
        formData.metadata = {};
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
        borderRadius = 0,
        rotateY = false,
        rotateX = false,
        defaultSvgColors = [],
      } = formData.metadata;
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
          borderRadius: borderRadius,
          defaultSvgColors: defaultSvgColors,
          rotateX,
          rotateY,
        },
      });
    }
  }

  async saveSvg(url, colors) {
    const html = await getSvgHtml(url, colors);
    await api.saveSvgHtml(url, html);
  }
  handleAddToDB = async (values, flag) => {
    const { metadata, file } = this.state;
    const { modalForm } = this.props.trans;
    metadata.defaultSvgColors = this.state.svgImgColors;
    let { formData, type } = this.props;
    if (this.props.type === 'batchUpload') {
      const { userId } = JSON.parse(
        localStorage.getItem('token')
      ).loginResult.userInfoDto;
      values.userId = userId;
      const data = new FormData();
      Object.keys(values).forEach((item) => {
        if (item === 'file') {
          // data.append('file', values[item]['fileList'][0])
        } else {
          data.append(item, values[item]);
        }
      });
      data.append('file', file);
      await fetch('/api/media/image/batchupload', {
        method: 'POST',
        body: data,
        headers: {
          credentials: 'same-origin',
          // 'Content-Type': 'multipart/form-data'  // 不要加上这个文件类型说明
        },
      }).then(({ status }) => {
        if (status === 200) {
          message.success(modalForm.addSuccess);
        }
      });
    } else if (!formData.id) {
      //新增操作
      const { userId } = JSON.parse(
        localStorage.getItem('token')
      ).loginResult.userInfoDto;
      values.userId = userId;
      const data = new FormData();
      values.tags = values.tags ? values.tags.join(',') : '';

      await this.saveSvg(formData.url, metadata.defaultSvgColors);
      values.metadata = JSON.stringify(metadata);
      Object.keys(values).forEach((item) => {
        if (item === 'file') {
          // data.append('file', values[item]['fileList'][0])
        } else {
          data.append(item, values[item]);
        }
      });

      data.append('file', file);
      await fetch('/api/media/image', {
        method: 'POST',
        body: data,
        headers: {
          credentials: 'same-origin',
          // 'Content-Type': 'multipart/form-data'  // 不要加上这个文件类型说明
        },
      }).then(({ status }) => {
        if (status === 200) {
          message.success(modalForm.addSuccess);
        }
      });
    } else {
      //修改操作
      let params = {
        ...formData,
        id: formData.id,
        ifCopy: flag === 'new',
        metadata: JSON.stringify(metadata),
      };
      if (type !== 'editCss') {
        params.name = values.name;
        params.tags = values.tags;
      }
      await api.editImage(params).then(({ state }) => {
        if (state) {
          message.success(modalForm.updateSuccess);
        }
      });
    }
  };
  batchAddToWs = () => {
    const { file } = this.state;
    const batchData = new FormData();
    batchData.append('file', file);

    fetch('/api/file/batchupload', {
      method: 'POST',
      body: batchData,
      headers: {
        credentials: 'same-origin',
      },
    })
      .then((res) => res.json())
      .then((upres) => {
        console.log('upres.result');
        console.info(upres.result);
        if (upres.state) {
          let items = upres.result;
          console.log(items);
          if (this.props.isAtlas) {
            this.props.addImageOk(items);
          } else {
            items.forEach((item) => {
              this.props.addToWs({
                url: item,
                metadata: '',
              });
            });
          }
        }
      });
  };
  handleSubmit = (e) => {
    const { isAddToDB, isAddToWS, metadata, isSetToBackGround } = this.state;
    const { formData, type } = this.props;
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        //如果是批量添加
        if (type === 'batchUpload') {
          console.log('批量添加');
          if (isAddToDB) {
            await this.handleAddToDB(values);
          }
          if (isAddToWS) {
            console.log("添加到工作区")
            this.batchAddToWs();
          }
          this.handleCancal();
          return;
        }

        if (type === 'edit' || (type === 'editCss' && !isAddToDB && !isAddToWS)) {
          // 如果都没有选择，则修改数据库中原图
          await this.handleAddToDB(values);
          this.handleCancal();
          return;
        }

        if (isAddToDB) {
          // 如果选择插入数据库，并且数据库没有，则插入一张新图
          if (formData.id) {
            await this.handleAddToDB(values, 'new');
          } else {
            await this.handleAddToDB(values);
          }
        }

        if (isAddToWS) {
          metadata.defaultSvgColors = this.state.svgImgColors;
          if (type !== 'batchUpload' && this.props.addToQs) {
            // 添加到题型中
            this.props.addToQs(formData.url);
          } else if (this.props.isAtlas) {
            this.props.addImageOk([formData.url]);
          } else {
            this.props.addToWs({
              url: formData.url,
              metadata: metadata,
            });
          }
        }
        if (isSetToBackGround) {
          this.props.setAsBg({
            url: formData.url,
            backgroundSize: this.state.placement == 1 ? '100% 100%' : 'auto',
            backgroundRepeat:
              this.state.placement == 2 ? 'repeat' : 'no-repeat',
            opacity: this.state.opacityValue,
          });
        }
        this.handleCancal();
      }
    });
  };
  onChange = (e) => {
    console.log(e);
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  handleCancal = (e) => {
    this.handleReset();
    this.props.onCancal(e);
  };
  changeFile = (file) => {
    let { name } = this.props.formData;
    if (!name || name === '') {
      this.props.formData.name = file.name;

      if (file.name.toLowerCase().includes('.svg')) {
        this.props.form.setFieldsValue({
          mediaCategory: 4,
        });
        this.state.chooseTagsRef.refreshByCategory(4);
      } else {
        this.props.form.setFieldsValue({
          mediaCategory: 3,
        });
        this.state.chooseTagsRef.refreshByCategory(3);
      }
    }
    if (file) {
      this.uploadFile(file).then((url) => {
        this.props.formData.url = url;
        this.setState({
          file: file,
          fileList: [file],
          submitButton: true,
        });
      });
    }
    return false;
  };

  uploadFile = (file) => {
    let data = new FormData();
    data.append('file', file);
    return new Promise((resolve, reject) => {
      fetch('/api/file/upload', {
        method: 'POST',
        body: data,
        headers: {
          credentials: 'same-origin',
        },
      })
        .then((res) => res.json())
        .then((upres) => {
          if (upres.state) {
            console.log(upres.result);
            resolve(upres.result.url);
          }
        });
    });
  };
  changeSvgColor(newColor, id) {
    const { svgImgColors } = this.state;
    svgImgColors.forEach((item) => {
      if (item.id === id) {
        item.newColor = newColor;
      }
    });
    this.svgImgRef.changeSvgColor(newColor, id);
    this.setState({
      svgImgColors: svgImgColors,
      svgResetColor: true,
    });
  }
  resetSvgColors() {
    const { svgImgColors } = this.state;
    svgImgColors.forEach((item) => {
      item.newColor = item.color;
    });
    this.svgImgRef.changeAllSvgColor(svgImgColors);
    //debugger;
    this.setState({
      svgImgColors: svgImgColors,
      svgResetColor: false,
    });
  }

  render() {
    const {
      form,
      mediaCategorys,
      formData = {},
      mediaCategory,
      type,
      trans,
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      fileList,
      submitButton,
      isAddToDB,
      isAddToWS,
      metadata,
      svgImgColors,
      svgResetColor,
      isSetToBackGround,
    } = this.state;
    const {
      borderWidth,
      borderColor,
      imgOpacity,
      borderStyle,
      boxColor,
      borderRadius,
      defaultSvgColors,
      rotateX,
      rotateY,
    } = metadata;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const formTailLayout = {
      labelCol: { span: 12 },
      wrapperCol: { span: 12, offset: 8 },
    };
    let { id, name, tags } = formData;
    let accept = 'image/jpg, image/png, image/jpeg, image/gif, image/svg, .svg';

    if (type === 'batchUpload') {
      accept = 'application/zip,application/x-zip,application/x-zip-compressed';
    }
    let boxShadowText =
      metadata.shadowType === '1'
        ? metadata.boxShadowText
        : metadata.boxHShadow +
          'px ' +
          metadata.boxVShadow +
          'px ' +
          metadata.boxBlur +
          'px ' +
          metadata.boxSpread +
          'px ' +
          metadata.boxColor +
          ' ' +
          (metadata.boxInset === 'inset' ? 'inset' : '');
    return (
      <Modal
        title={
          formData.id
            ? trans.modalForm.mod
            : type === 'batchUpload'
            ? trans.modalForm.batchUpload
            : trans.modalForm.addPics
        }
        visible={true}
        footer={null}
        onCancel={this.handleCancal}
        width={'600px'}
      >
        <Form onSubmit={this.handleSubmit}>
          {(type === 'add' || type === 'edit') && (
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
          )}

          {['batchUpload', 'add'].indexOf(type) > -1 && (
            <Form.Item {...formItemLayout} label="file">
              {getFieldDecorator('flie', {
                rules: [
                  {
                    required: true,
                    message: 'Please select your file',
                  },
                ],
              })(
                <Upload
                  accept={accept}
                  beforeUpload={this.changeFile}
                  onRemove={(file) => {
                    this.props.formData.url = null;
                    this.setState({
                      fileList: [],
                    });
                  }}
                  fileList={fileList}
                >
                  <Button>
                    <Icon type="upload" /> {trans.modalForm.uploadText}
                  </Button>
                </Upload>
              )}
            </Form.Item>
          )}

          <Form.Item
            {...formItemLayout}
            label="picture category"
            // style={{
            //   display:
            //     ['batchUpload', 'add'].indexOf(type) > -1 && isAddToDB
            //       ? 'block'
            //       : 'none'
            // }}
            style={{ display: 'none' }}
          >
            {getFieldDecorator('mediaCategory')(
              <Select
                placeholder="Please select your picture category"
                disabled={true}
              >
                {mediaCategorys.map((item) => {
                  return item.value !== -1 ? (
                    <Option key={item.value} value={item.value}>
                      {trans.HomeMenu[item.lang]}
                    </Option>
                  ) : (
                    ''
                  );
                })}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="file tag"
            style={{
              display:
                type === 'edit' || (type === 'add' && isAddToDB)
                  ? 'block'
                  : 'none',
            }}
          >
            {getFieldDecorator('tags', {
              rules: [],
              initialValue: tags,
            })(
              <Tags
                mediaCategory={formData.mediaCategory}
                ref={(chooseTags) =>
                  this.setState({ chooseTagsRef: chooseTags })
                }
              ></Tags>
            )}
          </Form.Item>

          {/* 修改样式部分开始 */}
          <Collapse
            bordered={false}
            defaultActiveKey={type === 'editCss' ? 1 : null}
          >
            {(isAddToDB || isAddToWS || type === 'editCss') &&
              formData.url &&
              ['editCss', 'add'].indexOf(type) > -1 && (
                <Collapse.Panel
                  header="修改图片样式"
                  key="1"
                  disabled={type === 'editCss'}
                  forceRender={true}
                >
                  <Form.Item>
                    <div>
                      <div
                        style={{
                          width: '50%',
                          maxHeight: '500px',
                          margin: 'auto',
                          opacity: `${(100 - imgOpacity) / 100}`,
                          position: 'relative',
                          backgroundColor: '#8e8e8e',
                          borderStyle: borderStyle,
                          borderWidth: borderWidth + 'px',
                          borderRadius: borderRadius + 'px',
                          borderColor: borderColor,
                          boxShadow: boxShadowText,
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                            transform:
                              (rotateY ? 'rotateY(180deg)' : '') +
                              (rotateX ? 'rotateX(180deg)' : ''),
                          }}
                        >
                          {!this.ifSvgImg(formData.url) ? (
                            <img
                              src={formData.url}
                              style={{
                                maxWidth: '100%',

                                maxHeight: '200px',
                                width: '100%',
                              }}
                            />
                          ) : (
                            <SvgImg
                              url={formData.url}
                              defaultColors={defaultSvgColors}
                              ref={(ref) => {
                                this.svgImgRef = ref;
                              }}
                              svgImgColors={(colors) => {
                                this.setState({
                                  svgImgColors: colors,
                                });
                              }}
                              style={{
                                maxWidth: '100%',
                                height: '200px',
                              }}
                            ></SvgImg>
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          position: 'relative',
                          justifyContent: 'space-between',
                          marginTop: '10px',
                        }}
                      >
                        <div
                          style={{
                            width: '45%',
                          }}
                        >
                          <div>
                            {trans.modalForm.borderWidth}
                            <InputNumber
                              min={0}
                              defaultValue={0}
                              style={{ marginLeft: 16 }}
                              value={borderWidth}
                              precision={0}
                              onChange={(value) => {
                                metadata.borderWidth = value;
                                this.setState({
                                  metadata: metadata,
                                });
                              }}
                            />
                          </div>
                          <div>
                            {trans.modalForm.boxRadius}
                            <InputNumber
                              min={0}
                              defaultValue={0}
                              style={{ marginLeft: 16 }}
                              value={borderRadius}
                              precision={0}
                              onChange={(value) => {
                                metadata.borderRadius = value;
                                this.setState({
                                  metadata: metadata,
                                });
                              }}
                            />
                          </div>
                          {borderWidth > 0 && (
                            <div>
                              <div>
                                <span>{trans.modalForm.borderColor}</span>
                                <ColorPicker
                                  color={borderColor}
                                  change={(value) => {
                                    metadata.borderColor = value;
                                    this.setState({
                                      metadata,
                                    });
                                  }}
                                ></ColorPicker>
                              </div>
                              <div>
                                <span>border-style:</span>
                                <Select
                                  defaultValue="solid"
                                  style={{ width: 120 }}
                                  onChange={(value) => {
                                    metadata.borderStyle = value;
                                    this.setState({ metadata: metadata });
                                  }}
                                >
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
                            </div>
                          )}
                          <div>
                            <div>
                              <span>{trans.modalForm.rotateY}</span>
                              <Switch
                                checked={rotateY}
                                onChange={(checked) => {
                                  metadata.rotateY = checked;
                                  this.setState({ metadata });
                                }}
                              />
                            </div>
                            <div>
                              <span>{trans.modalForm.rotateX}</span>
                              <Switch
                                checked={rotateX}
                                onChange={(checked) => {
                                  metadata.rotateX = checked;
                                  this.setState({ metadata });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <Divider
                          type="vertical"
                          style={{
                            position: 'absolute',
                            height: '100%',
                            left: '50%',
                          }}
                        />
                        <div
                          style={{
                            width: '45%',
                          }}
                        >
                          <div>
                            <div>
                              {trans.modalForm.boxShadow}:
                              <Radio.Group
                                onChange={(e) => {
                                  metadata.shadowType = e.target.value;
                                  this.setState({
                                    metadata: metadata,
                                  });
                                }}
                                defaultValue={metadata.shadowType}
                                buttonStyle="solid"
                              >
                                <Radio.Button value="1">
                                  {trans.modalForm.textSet}
                                </Radio.Button>
                                <Radio.Button value="2">
                                  {trans.modalForm.setManually}
                                </Radio.Button>
                              </Radio.Group>
                            </div>
                            {metadata.shadowType === '1' && (
                              <Input
                                value={metadata.boxShadowText}
                                placeholder={
                                  trans.modalForm.example +
                                  ':5px 8px 4px #756c6c'
                                }
                                onChange={(e) => {
                                  metadata.boxShadowText = e.target.value;
                                  this.setState({
                                    metadata: metadata,
                                  });
                                }}
                              />
                            )}
                            {metadata.shadowType === '2' && (
                              <div>
                                <Row>
                                  <Col span={12}>
                                    h-offset:
                                    <InputNumber
                                      size="small"
                                      style={{ width: 50 }}
                                      value={metadata.boxHShadow}
                                      precision={0}
                                      onChange={(value) => {
                                        metadata.boxHShadow = value;
                                        this.setState({
                                          metadata: metadata,
                                        });
                                      }}
                                    />
                                  </Col>
                                  <Col span={12}>
                                    v-offset:
                                    <InputNumber
                                      size="small"
                                      style={{ width: 50 }}
                                      value={metadata.boxVShadow}
                                      precision={0}
                                      onChange={(value) => {
                                        metadata.boxVShadow = value;
                                        this.setState({
                                          metadata: metadata,
                                        });
                                      }}
                                    />
                                  </Col>
                                </Row>
                                <div>
                                  blur radius:
                                  <InputNumber
                                    size="small"
                                    style={{ width: 80 }}
                                    value={metadata.boxBlur}
                                    precision={0}
                                    onChange={(value) => {
                                      metadata.boxBlur = value;
                                      this.setState({
                                        metadata: metadata,
                                      });
                                    }}
                                  />
                                </div>
                                <div>
                                  spread radius:
                                  <InputNumber
                                    size="small"
                                    style={{ width: 80 }}
                                    value={metadata.boxSpread}
                                    precision={0}
                                    onChange={(value) => {
                                      metadata.boxSpread = value;
                                      this.setState({
                                        metadata: metadata,
                                      });
                                    }}
                                  />
                                </div>
                                <div>
                                  color:
                                  <ColorPicker
                                    color={boxColor}
                                    change={(value) => {
                                      metadata.boxColor = value;
                                      this.setState({
                                        metadata: metadata,
                                      });
                                    }}
                                  ></ColorPicker>
                                </div>
                                <div>
                                  <Radio.Group
                                    onChange={(e) => {
                                      metadata.boxInset = e.target.value;
                                      this.setState({
                                        metadata: metadata,
                                      });
                                    }}
                                    defaultValue={metadata.boxInset}
                                    buttonStyle="solid"
                                  >
                                    <Radio.Button value="inset">
                                      inset
                                    </Radio.Button>
                                    <Radio.Button value="outset">
                                      outset
                                    </Radio.Button>
                                  </Radio.Group>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          width: 200,
                          margin: 'auto',
                        }}
                      >
                        {trans.modalForm.transprant}
                        <Slider
                          min={0}
                          max={100}
                          value={imgOpacity}
                          onChange={(value) => {
                            metadata.imgOpacity = value;
                            this.setState({
                              metadata: metadata,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </Form.Item>
                </Collapse.Panel>
              )}

            {formData.url &&
              this.ifSvgImg(formData.url) &&
              ['editCss', 'add'].indexOf(type) > -1 && (
                <Collapse.Panel header="修改svg样式" key="2">
                  <Form.Item>
                    <div>
                      {trans.modalForm.editSvgColors}
                      {svgResetColor && (
                        <Button
                          style={{
                            marginLeft: 10,
                          }}
                          onClick={() => {
                            this.resetSvgColors();
                          }}
                        >
                          {trans.modalForm.reset}
                        </Button>
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        overflow: 'auto',
                        maxHeight: '98px',
                      }}
                    >
                      {svgImgColors.map((item) => {
                        return (
                          <ColorPicker
                            color={item.newColor}
                            change={(value) => {
                              this.changeSvgColor(value, item.id);
                            }}
                            key={item.id}
                          ></ColorPicker>
                        );
                      })}
                    </div>
                  </Form.Item>
                </Collapse.Panel>
              )}

            {formData.url && isSetToBackGround && (
              <Collapse.Panel header="设置背景样式" key="3">
                <Form.Item
                  {...formItemLayout}
                  label={trans.Background.setPlace}
                >
                  <Select
                    onChange={(value) =>
                      this.setState({
                        placement: value,
                      })
                    }
                    value={this.state.placement}
                    style={{ width: 120 }}
                  >
                    <Select.Option value={0}>
                      {trans.Background.placeDefault}
                    </Select.Option>
                    <Select.Option value={1}>
                      {trans.Background.placeLs}
                    </Select.Option>
                    <Select.Option value={2}>
                      {trans.Background.placeRepeat}
                    </Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item {...formItemLayout} label={trans.Background.opacity}>
                  <Slider
                    min={0}
                    max={100}
                    value={this.state.opacityValue}
                    defaultValue={this.state.opacityValue}
                    onChange={(value) => this.setState({ opacityValue: value })}
                    style={{
                      width: 'calc(100% - 60px)',
                      marginRight: 8,
                      display: 'inline-block',
                    }}
                  />
                  <div
                    style={{
                      width: '30px',
                      display: 'inline-block',
                      verticalAlign: 'top',
                    }}
                  >
                    {this.state.opacityValue}
                  </div>
                </Form.Item>
              </Collapse.Panel>
            )}
          </Collapse>

          {type !== 'edit' && (
            <div style={{ padding: '10px 0', textAlign: 'center' }}>
              <Checkbox
                checked={isAddToDB}
                onChange={(e) => {
                  this.setState({
                    isAddToDB: e.target.checked,
                  });
                }}
              >
                {trans.modalForm.addToLib}
              </Checkbox>
              <Checkbox
                checked={isAddToWS}
                onChange={(e) => {
                  this.setState({
                    isAddToWS: e.target.checked,
                  });
                }}
              >
                {trans.modalForm.addToWs}
              </Checkbox>
              {type === 'add' && (
                <Checkbox
                  checked={isSetToBackGround}
                  onChange={(e) => {
                    this.setState({
                      isSetToBackGround: e.target.checked,
                    });
                  }}
                >
                  {trans.modalForm.setToBackGround}
                </Checkbox>
              )}
            </div>
          )}
          <Form.Item {...formTailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                !(formData.id || submitButton) ||
                (!formData.id && !(isAddToDB || isAddToWS || isSetToBackGround))
              }
            >
              {trans.modalForm.submit}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleCancal}>
              {trans.modalForm.cancel}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const AddForm = Form.create({ name: 'register' })(ModalForm);

export default AddForm;