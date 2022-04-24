/* eslint-disable no-useless-escape */
import React, { createElement } from 'react'
import styles from './ModalList.module.scss';
import api from '../../api/bookApi';
import ModalForm from './ModalForm';
import LinesEllipsis from 'react-lines-ellipsis'
import './ColorFillGame.css'
import {
  Button,
  Icon,
  Input,
  List,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Spin,
  Tag,
  InputNumber,
  Checkbox,
  Tooltip
} from 'antd';
const { Search } = Input;
const { CheckableTag } = Tag;
const { info } = Modal;
const defaultMetaData = {
  borderWidth: 0,
  imgOpacity: 0,
  borderColor: '#000000',
  borderStyle: 'solid',
  boxColor: '#000000',
  boxHShadow: 0,
  boxVShadow: 0,
  boxBlur: 0,
  boxSpread: 0,
  boxInset: 'inset',
  shadowType: '1',
  boxShadowText: '',
  borderRadius: 0
}

class ColorFillGame extends React.Component {
  state = {
    modalTitle: "填色游戏",
    selectImage: '',
    modalFormType: '',
    action: 0,
    width: '70%',
    editRecord: {},
    initLoading: true,
    spinning: false,
    formData: {},
    mediaCategory: {
      name: '填色游戏图片',
      lang: 'FillColorGame',
      value: 5
    },
    mediaCategorys: [
      {
        name: '填色游戏图片',
        lang: 'FillColorGame',
        value: 5
      }
    ],
    modalFormVisible: false,
    data: [],
    list: [],
    tags: [],
    tag: '',
    page: 1,
    pageSize: 10,
    total: 0,
    addPicModalVisible: false,
    addPicUrl: undefined,
    addPicUrlWidth: 0,
    addPicUrlHeight: 0,
    addPicUrlBorder: 0,
    addPicUrlMargin: 0,
    addPicScale: 1,
    addPicScaleOn: false,
    indeterminate: false,
    checkedList: [],
    checkAll: false
  }
  componentDidMount () {
    if (this.props.onRef) {
      this.props.onRef(this)
    }
    const { modalList } = this.props.trans
    this.setState({
      tag: modalList.all
    })
    const { mediaCategorys } = this.state;
    this.getData(mediaCategorys);
  }

  onChange = checkedList => {
    const {
      list
    } = this.state;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < list.length,
      checkAll: checkedList.length === list.length,
    });
  };

  onCheckAllChange = e => {
    const {
      list
    } = this.state;
    let dataList = []
    for (var i = 0; i < list.length; i++) {
      dataList.push(list[i].id)
    }
    this.setState({
      checkedList: e.target.checked ? dataList : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  addPicToEditor = () => {
    this.setState({ addPicModalVisible: false });
    let {
      addPicUrl,
      addPicUrlWidth,
      addPicUrlHeight,
      addPicUrlBorder,
      addPicUrlMargin
    } = this.state;
    this.props.addimgInEdtior({
      addPicUrl,
      addPicUrlWidth,
      addPicUrlHeight,
      addPicUrlBorder,
      addPicUrlMargin
    });
    this.props.onCancal();
  };

  cancleAddPicToEditor = () => {
    this.setState({
      addPicModalVisible: false,
      addPicUrl: undefined,
      addPicUrlWidth: 0,
      addPicUrlHeight: 0,
      addPicUrlBorder: 0,
      addPicUrlMargin: 0,
      addPicScale: 1,
      addPicScaleOn: false
    });
  };

  onSearch = e => {
    console.log(e);
    this.setState(
      {
        searchKey: e
      },
      this.getData
    );
  };
  getResetPageData = () => {
    this.setState({
      page: 1
    }, this.getData)
  }
  getData = (e, name) => {
    const {
      tag,
      pageSize,
      mediaCategory,
      page,
      searchKey = ''
    } = this.state;
    const { modalList } = this.props.trans
    let _ext = '';
    let order = undefined;
    let data = {
      searchKey,
      order,
      page,
      pageSize,
      tag: tag === modalList.all ? '' : tag,
      ext: ''
    };
    if (e === -1 || (!e && mediaCategory.value === -1)) {
      // data.userId = api.getUserId()
      data.myself = true;
    } else {
      data.mediaCategory = e > -1 ? e : mediaCategory.value;
      data.mediaCategory = data.mediaCategory === 3 ? null : data.mediaCategory
    }
    this.setState({
      spinning: true,
      indeterminate: false,
      checkedList: [],
      list: [],
      checkAll: false,
    }, () => {
      api.getMediaImages(data)
        .then(({ result, state }) => {
          if (state) {
            let { items, total } = result;
            items.forEach(item => {
              item.metadata = JSON.parse(item.metadata)
              if (!item.metadata) {
                item.metadata = {}
              }
              item.metadata = {
                ...defaultMetaData,
                ...item.metadata
              }
            })
            this.setState({
              spinning: false,
              list: items,
              total
            });
          } else {
            this.setState({
              spinning: false
            });
          }
        })
        .catch(() => {
          this.setState({
            spinning: false
          });
        });

      this.getImageAudioTag();
    });
  };
  getImageAudioTag = () => {
    const { mediaCategory } = this.state;
    api
      .getImageAudioTag(mediaCategory.value)
      .then(({ result, state }) => {
        if (state) {
          this.setState({
            tags: result
          });
        }
      });
  };
  remove = (e, item) => {
    const { modalList } = this.props.trans
    e.stopPropagation()
    api.deleteMedia(item.id, '').then(({ state }) => {
      if (state) {
        this.getResetPageData();
        message.success(modalList.deleteSuccess);
      }
    });
  };
  deleteAll = () => {
    const { modalList } = this.props.trans
    const {
      checkedList
    } = this.state;
    if (!checkedList || checkedList.length < 1) {
      message.warn(modalList.pleaseChooseMedia);
      return;
    }
    api.deleteAllMedia(checkedList, '').then(({ state }) => {
      if (state) {
        this.getResetPageData();
        message.success(modalList.deleteSuccess);
      }
    });
  };
  edit = (e, item) => {
    e.stopPropagation();
    this.setState({
      modalFormVisible: true,
      formData: item,
      modalFormType: 'edit'
    });
  };
  // 批量上传
  uploadBatchButton = () => {
    this.setState({
      modalFormVisible: true,
      modalFormType: 'batchUpload'
    });
  };
  showModalForm = () => {
    this.setState({
      modalFormVisible: true
    });
  };
  cancalModalForm = () => {
    this.setState(
      {
        modalFormVisible: false,
        formData: {},
        modalFormType: ''
      },
      this.getResetPageData
    );
  };
  tagChange = i => {
    this.setState(
      {
        tag: i
      },
      this.getResetPageData
    );
  };
  pageOnChange = i => {
    this.setState(
      {
        page: i
      },
      this.getData
    );
  };
  onShowSizeChange = (a, pageSize) => {
    this.setState(
      {
        pageSize
      },
      this.getResetPageData
    );
  };
  onMediaCategory = mediaCategory => {
    const { modalList } = this.props.trans
    this.setState(
      {
        mediaCategory,
        tag: modalList.all
      },
      this.getResetPageData
    );
  };

  addPicToWS = (url) => {
    this.setState({
      selectImage: url
    })
    setTimeout(() => {
      this.handleOk()
    }, 0)
  }


  handleOk = () => {
    const { selectImage } = this.state
    const { addElement, isEdit, actReplaceTempParagraph, element } = this.props
    
    let html = `
      <div class="fill-container">
        <section class="page fill-balloon">
          <section class="page drawBalloon">
            <div class="fill-draw-wrap">
              <img class="fill-defaultImg" src="${selectImage}" crossOrigin />
              <div class="save" onclick="download(this)">Save Image</div>
              <canvas class="fill-canvas"></canvas>
              <div class="fill-wire"></div>
            </div>
            <ul class="fill-colors">
              <li style="background-color:#0050a1;">0050a1</li>
              <li style="background-color:#02a1e3;">02a1e3</li>
              <li style="background-color:#abdced;">abdced</li>
              <li style="background-color:#ef790b;">ef790b</li>
              <li style="background-color:#f8bc28;">f8bc28</li>
              <li style="background-color:#96c730;">96c730</li>
              <li style="background-color:#d3e6ba;">d3e6ba</li>
              <li style="background-color:#f79ab5;">f79ab5</li>
              <li style="background-color:#e1147f;">e1147f</li>
              <li style="background-color:#ffff00;">ffff00</li>
              <li style="background-color:#a1488e;">a1488e</li>
              <li style="background-color:#ee0000;">ee0000</li>
              <li style="background-color:#4d9b46;">4d9b46</li>
              <li style="background-color:#ffffff;border:solid 3px #0050a1;">ffffff</li>
            </ul>
          </section>
        </section>
      </div>
      `
    if (isEdit) {
      actReplaceTempParagraph(element.content[0].value, html, element.id)
    } else {
      addElement('ColorFillGame', {
        content: html
      })();
    }
    this.handleCancel()
  }
  handleCancel = () => {
    this.props.handleCancel()
  };

  render() {
    const {
      modalTitle,
      width,
      modalFormType,
      list,
      modalFormVisible,
      formData,
      tags,
      total,
      spinning,
      mediaCategorys,
      mediaCategory,
      page
    } = this.state
    const { visible, trans } = this.props
    return (
      <Modal
        visible={visible}
        footer={null}
        onCancel={this.handleCancel}
        bodyStyle={{
          padding: 0
        }}
        style={{
          minWidth: '700px'
        }}
        width={960}
        >
          <Spin spinning={spinning}>
          <div className={styles.centent}>
            <div className={styles.left}>
              <div className={styles.top}>
                {mediaCategorys.map(item => {
                  return (
                    <div
                      className={`${styles.list} ${
                        item.value === mediaCategory.value ? styles.active : ''
                        }`}
                      key={item.value}
                      onClick={() => this.onMediaCategory(item)}>
                      {trans.OtherMenu[item.lang]}
                    </div>
                  );
                })}
              </div>
              <Button
                onClick={this.showModalForm}
                className={styles.plus}
                type="primary"
                shape="round"
                icon="plus"
                size="small"
                style={{ display: 'block' }}
              >
                {trans.modalList.addUpload}
              </Button>
              <Button
                onClick={this.uploadBatchButton}
                className={styles.plus}
                type="primary"
                shape="round"
                icon="plus"
                size="small"
                style={{ display: 'block' }}
              >
                {trans.modalList.moreUpload}
              </Button>
            </div>
            <div className={styles.right}>

              <p className={styles.tool}>
                <Search
                  className={styles.Search}
                  placeholder="input search text"
                  onSearch={this.onSearch}
                  enterButton
                />
              </p>
             
              <div className={styles.tag}>
                {trans.modalList.tag}:
                <CheckableTag
                  checked={this.state.tag === trans.modalList.all}
                  onChange={() => this.tagChange(trans.modalList.all)}
                >
                  {trans.modalList.all}
                </CheckableTag>
                {tags.map(item => {
                  return (
                    <CheckableTag
                      key={item}
                      checked={this.state.tag === item}
                      onChange={() => this.tagChange(item)}
                    >
                      {item}
                    </CheckableTag>
                  );
                })}
              </div>

              <div style={{ display: "inline-block", margin: '10px 0 24px 0' }}>
                <Checkbox
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}
                >{trans.modalList.allCheck}</Checkbox>

                
                <Button
                  className={styles.button}
                  type="primary"
                  size="small"
                  onClick={this.deleteAll}
                >
                  {trans.modalList.delete}
                </Button>
              </div>
              <Checkbox.Group
                style={{ width: '100%' }}
                value={this.state.checkedList}
                onChange={this.onChange}
              >
                <List
                  className={styles.loadmoreList}
                  itemLayout="horizontal"
                  loadMore={this.loadMore}
                  dataSource={list}
                  renderItem={item => (
                    <List.Item
                      className={styles.items}
                      key={item.id}
                      onClick={() => {
                        this.addPicToWS(item.url)
                      }}
                      style={{cursor: "pointer"}}
                    >
                      <div style={{
                        width: '100%',
                        height: '100%',
                        opacity: `${(100 - item.metadata.imgOpacity) / 100}`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain'
                      }}><div style={{
                        borderStyle: item.metadata.borderStyle,
                        borderWidth: item.metadata.borderWidth + 'px',
                        borderRadius: item.metadata.borderRadius + 'px',
                        borderColor: item.metadata.borderColor,
                        boxShadow: item.metadata.shadowType === '1' ? item.metadata.boxShadowText : (
                          item.metadata.boxHShadow + 'px ' + item.metadata.boxVShadow + 'px ' + item.metadata.boxBlur + 'px ' + item.metadata.boxSpread + 'px ' + item.metadata.boxColor + ' ' + (item.metadata.boxInset === 'inset' ? 'inset' : '')
                        ),
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={item.url}
                          style={{
                            maxWidth: '100%',
                            width: '100%',
                            height: '100%',
                            maxHeight: '100%'
                          }}
                        />
                        </div>
                      </div>
                      {item.name && <div style={{
                        position: 'absolute',
                        top: '122px',
                        width: '130px',
                        fontSize: '14px'
                      }}>
                        <Tooltip placement="topLeft" title={item.name}><LinesEllipsis
                          text={item.name}
                          maxLine='2'
                          ellipsis='...'
                          onReflow={(rleState) => {
                            const {
                              clamped,
                              text,
                            } = rleState
                            if (clamped) {
                            }
                          }}
                          trimRight
                          basedOn='letters'
                        /></Tooltip></div>}

                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backgroundImage:
                            'linear-gradient(#00000011, #00000033, #00000099)'
                        }}
                      >
                        <Checkbox
                          className={styles.choose}
                          onClick={e => e.stopPropagation()}
                          value={item.id}
                        ></Checkbox>

                        <div
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: 27,
                            bottom: 0,
                            left: 0,
                            textAlign: 'right'
                          }}
                        >
                         
                          <div
                            className={styles.edit}
                            onClick={e => this.edit(e, item)}
                            key="list-loadmore-edit"
                          >
                            <Icon type="edit" />
                          </div>
                          <Popconfirm
                            key={item.value}
                            title="Do you want to delete this row?"
                            onConfirm={e => this.remove(e, item)}
                            onCancel={e => e.stopPropagation()}
                          >
                            <div
                              className={styles.delete}
                              onClick={e => e.stopPropagation()}
                            >
                              <Icon type="close" />
                            </div>
                          </Popconfirm>
                        </div>
                      </div>
                    
                    </List.Item>
                  )}
                />
              </Checkbox.Group>
              <Pagination
                size="small"
                total={total}
                showSizeChanger
                current={page}
                showQuickJumper
                onChange={this.pageOnChange}
                onShowSizeChange={this.onShowSizeChange}
              />
            </div>
          </div>
        </Spin>
        {modalFormVisible &&
          <ModalForm
            modalTitle={modalTitle}
            onMediaCategory={this.onMediaCategory}
            formData={formData}
            type={modalFormType}
            onCancal={this.cancalModalForm}
            mediaCategorys={mediaCategorys}
            mediaCategory={mediaCategory}
            addToWs={this.addPicToWS}
            trans={trans}
          ></ModalForm>}
        <Modal
          title={trans.modalList.setPicSize}
          visible={this.state.addPicModalVisible}
          onOk={this.addPicToEditor}
          onCancel={this.cancleAddPicToEditor}
        >
          <div className={styles.setPicInput}>
            <span>{trans.modalList.picAddress}:</span>
            <Input
              value={this.state.addPicUrl}
              disabled
              style={{ width: 'calc(100% - 80px)' }}
            />
          </div>
          <div className={styles.setPicInput}>
            <span>{trans.modalList.width}:</span>
            <InputNumber
              value={this.state.addPicUrlWidth}
              style={{ width: 100, marginRight: 32 }}
              onChange={value => {
                console.log(value, this.state.addPicScale);
                if (this.state.addPicScaleOn) {
                  this.setState({
                    addPicUrlWidth: value,
                    addPicUrlHeight: Math.ceil(value * this.state.addPicScale)
                  });
                } else {
                  this.setState({
                    addPicUrlWidth: value
                  });
                }
              }}
            />
            <span>{trans.modalList.height}:</span>
            <InputNumber
              value={this.state.addPicUrlHeight}
              style={{ width: 100, marginRight: 32 }}
              onChange={value => {
                if (this.state.addPicScaleOn) {
                  this.setState({
                    addPicUrlWidth: Math.ceil(value / this.state.addPicScale),
                    addPicUrlHeight: value
                  });
                } else {
                  this.setState({
                    addPicUrlHeight: value
                  });
                }
              }}
            />
            <Checkbox
              checked={this.state.addPicScaleOn}
              onChange={e => {
                this.setState({
                  addPicScaleOn: e.target.checked
                });
              }}
            >
              {trans.modalList.gudingbili}
            </Checkbox>
          </div>
          <div className={styles.setPicInput}>
            <span>{trans.modalList.border}:</span>
            <InputNumber
              value={this.state.addPicUrlBorder}
              style={{ width: 100, marginRight: 32 }}
              onChange={value => {
                this.setState({ addPicUrlBorder: value });
              }}
            />
            <span>{trans.modalList.padding}:</span>
            <InputNumber
              value={this.state.addPicUrlMargin}
              style={{ width: 100, marginRight: 32 }}
              onChange={value => {
                this.setState({ addPicUrlMargin: value });
              }}
            />
          </div>
        </Modal>
      </Modal>
    )
  }
}

export default ColorFillGame