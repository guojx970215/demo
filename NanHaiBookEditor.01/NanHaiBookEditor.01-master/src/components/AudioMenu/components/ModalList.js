import React from 'react';
import styles from './ModalList.module.scss';
import api from '../../../api/bookApi';
import ModalForm from './ModalForm';
import {
  Button,
  Input,
  List,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Spin,
  Tag,
  Checkbox
} from 'antd';
import UploadAudio from './UploadAudio';

const { Search } = Input;
const { confirm } = Modal;
const { CheckableTag } = Tag;

class ModalList extends React.Component {
  state = {
    modalFormType: '',
    action: 0,
    width: '50%',
    editRecord: {},
    initLoading: true,
    spinning: false,
    formData: {},
    modalFormVisible: false,
    data: [],
    list: [],
    tags: [],
    tag: '全部',
    exts: ['全部', '.mp3', '.wav'],
    ext: '全部',
    page: 1,
    pageSize: 10,
    total: 0,
    indeterminate: false,
    checkedList: [],
    checkAll: false,
    // 音频搜索关键字
    searchKey: '',
    mediaCategory: {
      value: ''
    },
    uploadAudioShow: false,
    mediaCategorys: [
      {
        name: '全部音乐',
        lang: 'allMusic',
        value: ''
      },
      {
        name: '短音乐',
        lang: 'shortmMusic',
        value: 1
      },
      {
        name: '背景音乐',
        lang: 'backgroundMusic',
        value: 2
      }
    ]
  };

  onChange = checkedList => {
    const { list } = this.state;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < list.length,
      checkAll: checkedList.length === list.length
    });
  };

  onCheckAllChange = e => {
    const { list } = this.state;
    let dataList = [];
    for (var i = 0; i < list.length; i++) {
      dataList.push(list[i].id);
    }
    this.setState({
      checkedList: e.target.checked ? dataList : [],
      indeterminate: false,
      checkAll: e.target.checked
    });
  };

  onTopicEditSubmit = act => {
    return (...argus) => {
      act(argus[0], 'edit');
      console.log('修改后的topic', argus[0]);
      this.setState({
        visible: false
      });
    };
  };

  onMediaCategory(mediaCategory) {
    if (mediaCategory.value !== this.state.mediaCategory.value) {
      this.getData(mediaCategory.value);
      this.setState({
        mediaCategory: mediaCategory
      });
    }
  }

  componentDidMount() {
    const { mediaCategorys } = this.state;
    this.getData(mediaCategorys);
    this.getMediaAudioTag();
  }

  searchAudio = value => {
    this.setState({
      searchKey: value
    });
    setTimeout(() => {
      this.getData();
    }, 0);
  };
  getData = (e, name) => {
    const { tag, ext, pageSize, page, mediaCategory, searchKey } = this.state;
    let data = {
      page,
      pageSize,
      tag: tag === '全部' ? '' : tag,
      ext: ext === '全部' ? '' : ext,
      searchKey
    };
    if (e === -1 || (!e && mediaCategory.value === -1)) {
      data.userId = api.getUserId();
    } else {
      data.mediaCategory = e > -1 ? e : mediaCategory.value;
    }
    this.setState(
      {
        spinning: true,
        indeterminate: false,
        checkedList: [],
        list: [],
        checkAll: false
      },
      () => {
        api
          .getMediaAudios(data)
          .then(({ result, state }) => {
            if (state) {
              let { items, total } = result;
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
      }
    );
  };
  getMediaAudioTag = () => {
    const { mediaCategory } = this.state;
    api.getMediaAudioTag().then(({ result, state }) => {
      if (state) {
        this.setState({
          tags: result
        });
      }
    });
  };
  remove = e => {
    api.deleteMedia(e.id, '').then(({ state }) => {
      if (state) {
        this.getData();
        message.success('删除成功');
      }
    });
  };
  deleteAll = () => {
    const { checkedList } = this.state;
    if (!checkedList || checkedList.length < 1) {
      message.warn('请先选择需要删除的媒体');
      return;
    }
    api.deleteAllMedia(checkedList, '').then(({ state }) => {
      if (state) {
        this.getData();
        message.success('删除成功');
      }
    });
  };
  edit = e => {
    this.setState({
      modalFormVisible: true,
      formData: e
    });
  };

  onLoadMore = () => {
    this.setState({
      spinning: true,
      list: ''
    });
    this.getData(res => {
      const data = this.state.data.concat(res.results);
      this.setState(
        {
          data,
          list: data,
          loading: false
        },
        () => {
          window.dispatchEvent(new Event('resize'));
        }
      );
    });
  };
  showModalForm = () => {
    this.setState({
      modalFormVisible: true
    });
  };
  uploadBatchButton = () => {
    this.setState({
      modalFormVisible: true,
      modalFormType: 'batchUpload'
    });
  };
  cancalModalForm = () => {
    this.setState(
      {
        modalFormVisible: false,
        formData: {},
        modalFormType: ''
      },
      this.getData
    );
  };
  tagChange = i => {
    this.setState(
      {
        tag: i
      },
      this.getData
    );
  };
  extChange = i => {
    this.setState(
      {
        ext: i
      },
      this.getData
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
      this.getData
    );
  };
  play = src => {
    let { handleToWs } = this;
    confirm({
      content: (
        <audio src={src} controlsList="nodownload" controls="controls" autoPlay="autoplay">
          您的浏览器不支持 audio 标签。
        </audio>
      ),
      onOk() {
        handleToWs(src);
      },
      icon: '',
      onCancel() {}
    });
  };
  handleToWs = src => {
    this.props.onCancal();
    const { addElement } = this.props;
    let html = '';
    html = html + `<audio controlsList="nodownload" class="ueditorAudio" src="${src}"`;
    html =
      html +
      ' controls paused=true style="width:100%;height:100%;" ' +
      `></audio>`;
    addElement('AudioBox', {
      content: html,
      width: 300,
      height: 54
    });
  };

  render() {
    const {
      visible = false,
      onCancal,
      trans,
      isSelect,
      addElement,
      onlyForSelect,
      isEdit,
      getAudioSrc
    } = this.props;
    const {
      width,
      list,
      modalFormVisible,
      formData,
      tags,
      exts,
      total,
      spinning,
      mediaCategorys,
      mediaCategory,
      modalFormType,
      modalTitle,
      uploadAudioShow
    } = this.state;

    return (
      <Modal
        visible={visible}
        width={width}
        footer={null}
        onCancel={onCancal}
        bodyStyle={{
          padding: 0
        }}
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
                      onClick={() => this.onMediaCategory(item)}
                    >
                      {trans.AudioMenu[item.lang]}
                    </div>
                  );
                })}
              </div>
              {!onlyForSelect && (
                <Button
                  onClick={() => {
                    this.setState({
                      uploadAudioShow: true
                    });
                  }}
                  className={styles.plus}
                  type="primary"
                  shape="round"
                  icon="plus"
                  size="small"
                >
                  Add
                </Button>
              )}

              {!onlyForSelect && (
                <Button
                  onClick={this.uploadBatchButton}
                  className={styles.plus}
                  type="primary"
                  shape="round"
                  icon="plus"
                  size="small"
                >
                  批量上传
                </Button>
              )}
            </div>
            <div className={styles.right}>
              <Search
                style={{ marginBottom: '10px' }}
                placeholder="input search text"
                onSearch={value => {
                  this.searchAudio(value);
                }}
                enterButton
              />
              <div className={styles.ext}>
                类型：
                {exts.map(item => {
                  return (
                    <CheckableTag
                      key={item}
                      checked={this.state.ext === item}
                      onChange={() => this.extChange(item)}
                    >
                      {item}
                    </CheckableTag>
                  );
                })}
              </div>
              <div className={styles.tag}>
                标签：
                <CheckableTag
                  checked={this.state.tag === '全部'}
                  onChange={() => this.tagChange('全部')}
                >
                  全部
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
              <div style={{ display: 'inline-block', marginBottom: '10px' }}>
                <Button
                  className={styles.button}
                  type="primary"
                  size="small"
                  onClick={this.deleteAll}
                  style={{ float: 'right' }}
                >
                  删除
                </Button>
                <Checkbox
                  style={{ float: 'right' }}
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}
                >
                  全选
                </Checkbox>
              </div>
              <Checkbox.Group
                style={{ width: '100%' }}
                value={this.state.checkedList}
                onChange={this.onChange}
              >
                <List
                  className="demo-loadmore-list"
                  itemLayout="horizontal"
                  loadMore={this.loadMore}
                  dataSource={list}
                  style={{
                    maxHeight: '376px',
                    overflow: 'auto'
                  }}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <a onClick={() => this.play(item.url)} key={item.id}>
                          play
                        </a>,
                        onlyForSelect ? (
                          ''
                        ) : (
                          <a onClick={() => this.edit(item)} key={item.id}>
                            edit
                          </a>
                        ),
                        onlyForSelect ? (
                          ''
                        ) : (
                          <Popconfirm
                            key={item.value}
                            title="Do you want to delete this row?"
                            onConfirm={() => this.remove(item)}
                          >
                            <a>delete</a>
                          </Popconfirm>
                        ),
                        isEdit ? (
                          <a
                            onClick={() => {
                              getAudioSrc(item.url);
                              onCancal();
                            }}
                          >
                            insert
                          </a>
                        ) : (
                          ''
                        )
                      ]}
                    >
                      <Checkbox
                        onClick={e => e.stopPropagation()}
                        value={item.id}
                      ></Checkbox>{' '}
                      {item.name}
                    </List.Item>
                  )}
                />
              </Checkbox.Group>
              <Pagination
                size="small"
                total={total}
                showSizeChanger
                showQuickJumper
                onChange={this.pageOnChange}
                onShowSizeChange={this.onShowSizeChange}
              />
            </div>
          </div>
        </Spin>
        <ModalForm
          modalTitle={modalTitle}
          onMediaCategory={this.onMediaCategory}
          formData={formData}
          onCancal={this.cancalModalForm}
          mediaCategorys={mediaCategorys}
          mediaCategory={mediaCategory}
          type={modalFormType}
          visible={modalFormVisible}
        ></ModalForm>
        {uploadAudioShow && (
          <UploadAudio
            handleCancel={value => {
              console.log('UploadAudio', value);
              if (value) {
                onCancal();
              }
              this.setState(
                {
                  uploadAudioShow: false,
                  modalFormType: ''
                },
                this.getData
              );
            }}
            mediaCategorys={mediaCategorys}
            trans={trans}
            tags={tags}
            formData={formData}
            mediaCategory={mediaCategory}
            type={modalFormType}
            addElement={addElement}
          ></UploadAudio>
        )}
      </Modal>
    );
  }
}

export default ModalList;
