import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import {
  Form,
  Button,
  Row,
  Col,
  Input,
  Drawer,
  Card,
  List,
  Icon,
  message,
  Modal
} from 'antd';
import UUID from 'node-uuid';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import PhotoGalleryModalList from '../../HomeMenu/PhotoGallery/ModalList';
import MusicCard from '../../AniDialog/musicCard';
import './Dict.css';
import api from '../../../api/bookApi';
import {
  actAddDict,
  actDeleteDict,
  actSetDict,
} from '../../../store/bookPages/actions';
import InsertImage from '../../InteractiveQuestionMenu/QuestionForm/InsertImage';
import DictContentCss from './DictContentCss';
const { TextArea } = Input;
const $ = window.$;
// import {showRichContent} from './UEditorPlugin.Dict'

class Dict extends Component {
  state = {
    dictImage: {},
    dictAudio: {},
    isShowImageModal: false,
    isShowAudioModal: false,
    textDefaultValue: '',
    imageSettingVisible: false,
    imageSetting: {},
    dictContentCss: {
      fontSize: 24,
      lineHeight: 38,
      fontWeight: false
    }
  };

  dictNode = null;
  dictContent = null;
  dictContentLink = null;
  dictImageLink = null;

  componentWillMount() {
    const {
      actSetImage,
      actSetMusic,
      actLoadElementDict,
      ueditor,
      getFieldDecorator
    } = this.props;

    actSetImage();
    actSetMusic();

    if (ueditor.selection) {
      const range = ueditor.selection.getRange();
      range.select();

      const text = ueditor.selection.getText();

      const startNode = ueditor.selection.getStart();

      this.dictNode = startNode;

      if (!$(this.dictNode).hasClass('dict-content')) {
        this.dictNode = $(startNode)
          .parents('.dict-content')
          .get(0);
      }

      if (this.dictNode) {
        let dictData = $(this.dictNode).attr('dict-data');
        dictData = Utf8.stringify(Base64.parse(dictData));
        dictData = JSON.parse(dictData);

        this.dictContent = dictData.dictContent;
        this.dictContentLink = dictData.dictContentLink;
        this.dictImageLink = dictData.dictImageLink;

        this.setState({
          dictData: dictData,
          textDefaultValue: text,
          dictImage: dictData.dictImage || {},
          dictAudio: dictData.dictAudio || {},
          dictContentCss: dictData.dictContentCss || {},
          imageSetting: dictData.imageSetting
        });
      } else {
        this.setState({
          textDefaultValue: text
        });
      }
    }
  }
  /* review = ()=>{
    const {dictData} = this.state
    debugger
    showRichContent(dictData)
  } */

  render() {
    const {
      ueditor,
      onOk,
      onClear,
      images,
      audios,
      actSaveElementDict,
      actAddDict,
      actSetDict,
      actDeleteDict,
      trans
    } = this.props;
    const { getFieldDecorator, imageSettingVisible } = this.props.form;

    const handlePreview = async () => {
      let dictDom = document.createElement('div');

      const pinyin = await api.getPinyinContent({
        text: [this.state.textDefaultValue]
      });


      dictDom.innerHTML = `
       <div class="dict-back-mask" id="dict-modal">
          <div class="dict-outer-wrapper">
            <div class="dict-title">Dictionary</div>
            <div class="dict-close" onclick="document.getElementById('dict-modal').outerHTML = ''"></div>
            <div class="dict-main-container" style="font-size: ${
              this.state.dictContentCss.fontSize
            }px; font-weight: ${
        this.state.dictContentCss.fontWeight ? 700 : 'normal'
      }; line-height: ${this.state.dictContentCss.lineHeight}px;">

              <div class="dict-inner-title">${this.state.textDefaultValue} ${pinyin[0].pinyin.join(" ")}
              ${
                this.state.dictAudio.url
                  ? `<div class="music-pause" onclick="dictPrePlayAudio()">
                  <audio src="${this.state.dictAudio.url}" /></div>`
                  : ''
              }</div>

              <div class="dict-inner-content">
                ${this.dictContent ? this.dictContent.replace(/\n/g,'<br/>') : ''}
              </div>

              ${this.state.dictImage.url ? `<div style="padding: 0 16px">
                ${this.dictImageLink ? `<a href="${this.dictImageLink}" target="_black">` : ''}
                <img src="${this.state.dictImage.url}" style="width: ${
        this.state.imageSetting.picW || '500px'
      }; height: ${this.state.imageSetting.picH || 'auto'};" />               
                ${this.dictImageLink ? '</a>' : ''}
              </div>` : ''}
 
              ${
                this.dictContentLink
                  ? `<div class="dict-main-more"><a href="${this.dictContentLink}" target="_black">更多······</a></div>`
                  : ''
              }

            </div>
          </div> 
       </div>`;

      document.body.appendChild(dictDom);
    };
    const handleOk = async review => {
      const { form } = this.props;

      form.validateFields(async (err, fieldsValue) => {
        if (err) {
          return;
        }

        let dictId = '';

        if (this.dictNode) {
          dictId = this.dictNode.id;
        } else {
          dictId = 'dict-' + UUID.v4();
        }

        if (ueditor.selection) {
          const fanti = await api.getPinyinContent({
            text: [this.dictContent]
          });
          let dictData = {
            dictContent: this.dictContent,
            dictContentTradition: fanti[0].traditional.join(''),
            dictContentLink: this.dictContentLink,
            dictImage: {
              url: this.state.dictImage.url
            },
            dictImageLink: this.dictImageLink,
            imageSetting: this.state.imageSetting,
            dictAudio: {
              url: this.state.dictAudio.url,
              name: this.state.dictAudio.name
            },
            dictContentCss: this.state.dictContentCss
          };
          this.setState({ dictData });

          // actSetDict({id: dictId, ...dictData});

          dictData = JSON.stringify(dictData);
          dictData = Base64.stringify(Utf8.parse(dictData));
          // 如果当前选区没有被设置过字典，则新增
          if (!this.dictNode) {
            const range = ueditor.selection.getRange();
            range.applyInlineStyle('a', {
              style:
                'text-decoration-line:underline;text-decoration-style:wavy;text-decoration-color:#c6c6c6;',
              class: 'dict-content',
              id: dictId,
              href:
                "javascript:UEditorPlugin.dict.showRichContent('" +
                dictId +
                "')",
              'dict-data': dictData
            });
          } else {
            $(this.dictNode).attr('dict-data', dictData);
          }

          /* if (this.state.dictAudio.url) {
            const editorDom = ueditor.document.getElementById(dictId)
            $(editorDom).children(`#${dictId}-andioNode`).remove()
            $(editorDom).html($(editorDom).html() + `<div id="${dictId}-andioNode" class="music-pause" style="display:inline-block">
            <audio controlsList="nodownload" src="${this.state.dictAudio.url}"></audio>
            </div>`)
          } */
        }
        if (review === 'review') {
          handlePreview();
        } else if (onOk) {
          onOk();
        }
      });
    };
    const handleClear = () => {
      if (ueditor.selection) {
        const range = ueditor.selection.getRange();

        range.removeInlineStyle('a', { class: 'dict-content' });

        // if (this.dictNode) {
        //   let dictId = this.dictNode.id;

        //   actDeleteDict(dictId);
        // }

        // 这里应该也需要调用接口清空字典，但目前怎么做，还没考虑好

        if (onClear) {
          onClear();
        }
      }
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const { dictContentCss } = this.state;
    return (
      <div className="dict-editor-container">
        <Form {...formItemLayout}>
          <Form.Item label="原文">{this.state.textDefaultValue}</Form.Item>
          <Form.Item label="字典内容">
            {getFieldDecorator('dictContent', {
              initialValue: this.dictContent,
              rules: [
                {
                  required: true,
                  message: '请输入字典内容'
                }
              ]
            })(
              <TextArea
                rows={5}
                style={{
                  lineHeight: dictContentCss.lineHeight + 'px',
                  fontSize: dictContentCss.fontSize + 'px',
                  fontStyle: dictContentCss.fontStyle ? 'italic' : 'normal',
                  textDecoration: dictContentCss.underline
                    ? 'underline'
                    : 'none',
                  fontWeight: dictContentCss.fontWeight ? 'bold' : 'normal'
                }}
                placeholder="请输入字典内容"
                onChange={event => {
                  this.dictContent = event.target.value;
                }}
              ></TextArea>
            )}
          </Form.Item>
          <Form.Item label="字典样式">
            <Button
              onClick={() => {
                this.setState({ showDictContentCss: true });
              }}
            >
              设置
            </Button>
          </Form.Item>
          <Form.Item label="内容链接">
            {getFieldDecorator('dictContentLink', {
              initialValue: this.dictContentLink
            })(
              <Input
                onChange={event => {
                  this.dictContentLink = event.target.value;
                }}
              ></Input>
            )}
          </Form.Item>
          <Form.Item label="图片">
            <Card
              style={{ width: 400, position: 'relative' }}
              cover={<img src={this.state.dictImage.url} />}
              actions={[
                <Icon
                  type="select"
                  key="select"
                  onClick={() => {
                    this.showImageModal();
                  }}
                />,
                <Icon
                  type="delete"
                  key="delete"
                  onClick={() => {
                    this.setState({
                      dictImage: ''
                    });
                  }}
                />
              ]}
            >
              {this.state.dictImage.url && (
                <div
                  style={{ position: 'absolute', bottom: 60, right: 0 }}
                  onClick={() => {
                    this.setState({
                      imageSettingVisible: true
                    });
                  }}
                >
                  <Icon type="setting" style={{ fontSize: '20px' }} />
                </div>
              )}
            </Card>
          </Form.Item>
          <Form.Item label="图片链接">
            {getFieldDecorator('dictImageLink', {
              initialValue: this.dictImageLink
            })(
              <Input
                onChange={event => {
                  this.dictImageLink = event.target.value;
                }}
              ></Input>
            )}
          </Form.Item>
          <Form.Item label="音频">
            <Card
              style={{ width: 400 }}
              cover={
                <audio
                  src={this.state.dictAudio.url}
                  controls
                  controlsList="nodownload"
                />
              }
              actions={[
                <Icon
                  type="select"
                  key="select"
                  onClick={() => {
                    this.showAudioModal();
                  }}
                />,
                <Icon
                  type="delete"
                  key="delete"
                  onClick={() => {
                    this.setState({
                      dictAudio: {}
                    });
                  }}
                />
              ]}
            >
              <Card.Meta title={this.state.dictAudio.name} />
            </Card>
          </Form.Item>
          <Row>
            <Col style={{ textAlign: 'right' }}>
              <Button key="back" type="warning" onClick={handleClear}>
                清除字典
              </Button>
              <Button
                key="submit"
                type="primary"
                onClick={handleOk}
                style={{ marginLeft: 10 }}
              >
                确定
              </Button>
              <Button
                key="preview"
                type="primary"
                onClick={() => {
                  handlePreview();
                }}
                style={{ marginLeft: 10 }}
              >
                预览
              </Button>
            </Col>
          </Row>
        </Form>
        <PhotoGalleryModalList
          visible={this.state.isShowImageModal}
          trans={trans}
          onCancal={() => {
            this.hideImageModal();
          }}
          onClick={url => {
            this.setState({
              dictImage: {
                url: url
              }
            });

            this.hideImageModal();
          }}
        ></PhotoGalleryModalList>
        <MusicCard
          visible={this.state.isShowAudioModal}
          onOk={audio => {
            this.setState({
              dictAudio: audio[0]
            });

            this.hideAudioModal();
          }}
          onCancel={() => {
            this.hideAudioModal();
          }}
        ></MusicCard>

        <InsertImage
          visible={this.state.imageSettingVisible}
          onCancel={() => {
            this.setState({ imageSettingVisible: false });
          }}
          trans={this.props.trans}
          imageSrc={this.state.dictImage.url}
          onOk={size => {
            let imageSetting = this.state.imageSetting;
            imageSetting.picW = size.width;
            imageSetting.picH = size.height;
            this.setState({ imageSetting });
          }}
          defaultSize={{
            width: this.state.imageSetting.picW,
            height: this.state.imageSetting.picH
          }}
          hideDefault={true}
          dict={true}
        ></InsertImage>
        {this.state.showDictContentCss && (
          <Modal
            onCancel={() => {
              this.setState({ showDictContentCss: false });
            }}
            visible={true}
            title={'设置样式'}
            footer={null}
          >
            <DictContentCss
              setting={this.state.dictContentCss}
              onSubmit={values => {
                this.setState({
                  showDictContentCss: false,
                  dictContentCss: values
                });
              }}
            />
          </Modal>
        )}
      </div>
    );
  }

  showImageModal = () => {
    this.setState({
      isShowImageModal: true
    });
  };

  hideImageModal = () => {
    this.setState({
      isShowImageModal: false
    });
  };

  showAudioModal = () => {
    this.setState({
      isShowAudioModal: true
    });
  };

  hideAudioModal = () => {
    this.setState({
      isShowAudioModal: false
    });
  };
}

const mapStateToProps = ({ bookPages, imageList, music, trans }) => {
  let currentId = bookPages.showingPageId;
  let currentPage = bookPages.present.pages.find(item => {
    return item.id === currentId;
  });
  return {
    bookPages: bookPages,
    currentPage: currentPage,
    images: imageList.images,
    audios: music.audio,
    trans
  };
};

const mapDispatchToProps = dispatch => ({
  actSetImage: () => {
    dispatch({
      type: 'setImage',
      payload: {
        ext: '',
        page: 1,
        searchKey: '',
        pageSize: 16,
        tag: ''
      }
    });
  },
  actSetMusic: () => {
    dispatch({
      type: 'setMusic',
      payload: 1
    });
  },
  actSaveElementDict: ({ payload, callback }) => {
    dispatch({
      type: 'book/saveElementDict',
      payload,
      callback
    });
  },
  actLoadElementDict: ({ payload, callback }) => {
    dispatch({
      type: 'book/loadElementDict',
      payload,
      callback
    });
  },
  actAddDict: dict => {
    dispatch(actAddDict(dict))
  },
  actSetDict: dict => {
    dispatch(actSetDict(dict))
  },
  actDeleteDict: dict => {
    dispatch(actDeleteDict(dict))
  }
});

const WrappedRegistrationForm = Form.create({ name: 'dict' })(Dict);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedRegistrationForm);
