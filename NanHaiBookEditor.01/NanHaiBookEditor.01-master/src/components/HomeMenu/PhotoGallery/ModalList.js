import React from 'react';
import styles from './ModalList.module.scss';
import api from '../../../api/bookApi';
import ModalForm from './ModalForm';
import SvgImg from './SvgImg';
import nanoid from 'nanoid';
import LinesEllipsis from 'react-lines-ellipsis';
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
  Tooltip,
  Select,
  Divider,
} from 'antd';
import ColorPic from '../../ColorPic/ColorPic';

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
  borderRadius: 0,
};

export function ifSvgImg(url) {
  if (url && url.substring(url.length, url.lastIndexOf('.')) === '.svg') {
    return true;
  }
  return false;
}

export function getSvgDomStr(url, colors) {
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

        text = text.replace(
          '<svg',
          '<svg preserveAspectRatio="none" data-src="' + url + '"'
        );

        const nid = 's' + nanoid(8);
        const imgDom = document.createElement('div');
        imgDom.innerHTML = text;
        const svgDom = imgDom.getElementsByTagName('svg')[0];
        svgDom.setAttribute(
          'class',
          svgDom.getAttribute('class')
            ? svgDom.getAttribute('class') + ' ' + nid
            : nid
        );

        const styleTag = imgDom.getElementsByTagName('style');
        if (styleTag[0]) {
          let styles = styleTag[0].innerHTML;
          styles = styles.split('}');
          for (let i = 0; i < styles.length; i++) {
            if (i !== styles.length - 1) {
              styles[i] = styles[i].split('{');
              styles[i][0] = styles[i][0]
                .split(',')
                .map((selector) => `.${nid} ${selector}`)
                .join(',');
              styles[i] = styles[i].join('{');
            }
          }
          styleTag[0].innerHTML = styles.join('}');
        }

        resolve(imgDom.innerHTML);
      });
  });
}
class ModalList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalFormType: '',
      action: 0,
      modalTitle: '',
      width: 960,
      editRecord: {},
      initLoading: true,
      spinning: false,
      formData: {},
      mediaCategory: {
        name: '图片',
        lang: 'image',
        value: 3,
      },
      mediaCategorys: [
        {
          name: '图片',
          lang: 'image',
          value: 3,
        },
        {
          name: '我的收藏',
          lang: 'Collection',
          value: -1,
        },
        {
          name: '内置图形',
          lang: 'BuiltInGraphics',
          value: 4,
        },
      ],
      modalFormVisible: false,
      data: [],
      list: [],
      tags: [],
      tag: '',
      exts: [],
      ext: '',
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
      checkAll: false,
      moveToTagVisible: false,
      newTag: undefined,
    };
  }

  componentDidMount() {
    const { modalList } = this.props.trans;
    this.setState({
      tag: modalList.all,
      exts: [modalList.all, modalList.useMost, '.gif', '.png', '.jpg'],
      ext: modalList.all,
      checkedList: []
    });
    const { mediaCategorys } = this.state;
    this.getData(mediaCategorys);
  }

  onChange = (checkedList) => {
    const { list } = this.state;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < list.length,
      checkAll: checkedList.length === list.length,
    });
  };

  onCheckAllChange = (e) => {
    const { list } = this.state;
    let dataList = [];
    for (var i = 0; i < list.length; i++) {
      dataList.push(list[i].id);
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
      addPicUrlMargin,
    } = this.state;
    this.props.addimgInEdtior({
      addPicUrl,
      addPicUrlWidth,
      addPicUrlHeight,
      addPicUrlBorder,
      addPicUrlMargin,
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
      addPicScaleOn: false,
    });
  };

  onSearch = (e) => {
    console.log(e);
    this.setState(
      {
        searchKey: e,
      },
      this.getResetPageData
    );
  };
  getResetPageData = () => {
    this.setState(
      {
        page: 1,
      },
      this.getData
    );
  };
  getData = (e, name) => {
    const {
      tag,
      ext,
      pageSize,
      mediaCategory,
      page,
      searchKey = '',
    } = this.state;
    const { modalList } = this.props.trans;
    let _ext = '';
    let order = undefined;
    if (ext === modalList.all) {
      _ext = '';
    } else if (ext === modalList.useMost) {
      _ext = '';
      order = 'hot';
    } else {
      _ext = ext;
    }
    if (mediaCategory.value === 4) {
      _ext = '.svg';
    }
    let data = {
      searchKey,
      order,
      page,
      pageSize,
      tag: tag === modalList.all ? '' : tag,
      ext: _ext,
    };
    if (e === -1 || (!e && mediaCategory.value === -1)) {
      // data.userId = api.getUserId()
      data.myself = true;
    } else {
      data.mediaCategory = e > -1 ? e : mediaCategory.value;
    }
    this.setState(
      {
        spinning: true,
        indeterminate: false,
        checkedList: [],
        list: [],
        checkAll: false,
      },
      () => {
        api
          .getMediaImages(data)
          .then(({ result, state }) => {
            if (state) {
              let { items, total } = result;
              items.forEach((item) => {
                item.metadata = JSON.parse(item.metadata);
                if (!item.metadata) {
                  item.metadata = {};
                }
                item.metadata = {
                  ...defaultMetaData,
                  ...item.metadata,
                };
              });
              this.setState({
                spinning: false,
                list: items,
                total,
              });
            } else {
              this.setState({
                spinning: false,
              });
            }
          })
          .catch(() => {
            this.setState({
              spinning: false,
            });
          });

        this.getImageAudioTag();
      }
    );
  };
  getImageAudioTag = () => {
    const { mediaCategory } = this.state;
    api
      .getAllImageAudioTag(mediaCategory.value === 4 ? 4 : 3)
      .then(({ result, state }) => {
        if (state) {
          this.setState({
            tags: result,
          });
        }
      });
  };
  remove = (e, item) => {
    const { modalList } = this.props.trans;
    e.stopPropagation();
    api.deleteMedia(item.id, '').then(({ state }) => {
      if (state) {
        this.getResetPageData();
        message.success(modalList.deleteSuccess);
      }
    });
  };
  chooseAllAddToWorkSpace = () => {
    const { checkedList } = this.state;
    checkedList.forEach((item) => {
      const { list } = this.state;
      list.forEach((ele) => {
        if (ele.id === item) {
          this.addPicToWS(ele);
        }
      });
    });
  };
  deleteAll = () => {
    const { modalList } = this.props.trans;
    const { checkedList } = this.state;
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
  // 图集选择多张图片
  selectAll = () => {
    const { modalList } = this.props.trans;
    const { list } = this.state;
    const { checkedList } = this.state;
    if (!checkedList || checkedList.length < 1) {
      message.warn(modalList.pleaseChooseMedia);
      return;
    }
    let imageList = [];
    checkedList.forEach((ele) => {
      list.forEach((ele2) => {
        if (ele === ele2.id) {
          imageList.push(ele2.url);
        }
      });
    });
    this.setState({checkedList: []})
    // console.log('图集选择多张图片', imageList)
    this.props.addImageOk(imageList);
  };
  // 图集批量改变tag
  moveToTag = () => {
    if (!this.state.newTag) {
      message.warning('请选择移入tag', 3);
      return;
    }
    const { modalList } = this.props.trans;
    const { checkedList } = this.state;
    if (!checkedList || checkedList.length < 1) {
      message.warn(modalList.pleaseChooseMedia);
      return;
    }
    let params = {
      mediaIds: checkedList,
      newTag: this.state.newTag,
      oldTag: this.state.tag,
    };
    console.log(params);
    api.changeAllMediaTag(params).then(({ state }) => {
      if (state) {
        this.getResetPageData();

        this.setState({
          moveToTagVisible: false,
          newTag: undefined,
        });
      }
    });
  };
  edit = (e, item) => {
    e.stopPropagation();
    this.setState({
      modalFormVisible: true,
      formData: item,
      modalFormType: 'edit',
    });
  };
  uploadBatchButton = () => {
    this.setState({
      modalFormVisible: true,
      modalFormType: 'batchUpload',
    });
  };
  uploadButton = () => {
    this.setState({
      modalFormVisible: true,
      modalFormType: 'add',
    });
  };
  showModalForm = () => {
    this.setState({
      modalFormVisible: true,
    });
  };
  cancalModalForm = () => {
    this.setState(
      {
        modalFormVisible: false,
        formData: {},
        modalFormType: '',
      },
      this.getResetPageData
    );
  };
  tagChange = (i) => {
    this.setState(
      {
        tag: i,
      },
      this.getResetPageData
    );
  };
  extChange = (i) => {
    this.setState(
      {
        ext: i,
      },
      this.getResetPageData
    );
  };
  pageOnChange = (i) => {
    this.setState(
      {
        page: i,
      },
      this.getData
    );
  };
  onShowSizeChange = (a, pageSize) => {
    this.setState(
      {
        pageSize,
      },
      this.getResetPageData
    );
  };
  onMediaCategory = (mediaCategory) => {
    const { modalList } = this.props.trans;
    this.setState(
      {
        mediaCategory,
        tag: modalList.all,
      },
      this.getResetPageData
    );
  };

  preview = (e, item) => {
    e.stopPropagation();
    this.setState({
      modalFormVisible: true,
      formData: item,
      modalFormType: 'editCss',
    });
  };

  addimg = (src) => {
    console.log('src', src);
  };

  collection = (e, item) => {
    const { modalList } = this.props.trans;
    e.stopPropagation();
    if (item.colloectionState !== 1) {
      api
        .collectionMedia({
          mediaId: item.id,
        })
        .then(({ state }) => {
          if (state) {
            this.getData();
            message.success(modalList.collectSuccess);
          }
        });
    } else {
      api.cancelCollectionMedia(item.colloectionId).then(({ state }) => {
        if (state) {
          this.getData();
          message.success(modalList.cancelCollectSuccess);
        }
      });
    }
  };
  Upload = () => {
    const { modalList } = this.props.trans;
    var inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.click();
    inputFile.onchange = (e) => {
      console.log(e.target.files[0]);
      const data = new FormData();
      data.append('userId', api.getUserId());
      data.append('file', e.target.files[0]);
      fetch('/api/media/image/uploadsvg', {
        method: 'POST',
        body: data,
        headers: {
          credentials: 'same-origin',
        },
      })
        .then((res) => res.json())
        .then(({ state }) => {
          if (state) {
            this.getResetPageData();
            message.success(modalList.uploadSuccess);
          }
        });
    };
  };
  setAsBg = (item) => {
    let image = {
      url: item.url,
      opacity: item.opacity,
      backgroundSize: item.backgroundSize,
      backgroundRepeat: item.backgroundRepeat,
    };
    this.props.setPageBg(image);
  };
  addPicToWS = (item) => {
    const { addElement, onCancal, onClick } = this.props;

    if (onClick) {
      onClick(item.url, item);
      onCancal();
      return;
    }

    let image = new Image();
    image.src = item.url;
    const metadata = item.metadata;
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
    const {
      borderWidth = 0,
      imgOpacity = 0,
      borderColor = '#000000',
      borderStyle = 'solid',
      borderRadius = 0,
      defaultSvgColors = [],
      rotateY = false,
      rotateX = false,
    } = item.metadata;
    image.onload = () => {
      if (ifSvgImg(item.url)) {
        getSvgDomStr(item.url, defaultSvgColors).then((html) => {
          addElement('ImageBox', {
            config: {
              border:
                borderWidth > 0
                  ? borderWidth + 'px ' + borderColor + ' ' + borderStyle
                  : '0 solid rgba(0,0,0,1)',
              shadow: boxShadowText,
              borderRadius: borderRadius,
            },
            content:
              `<div style='
          transform:${rotateX ? 'rotateX(180deg)' : ''} ${
                rotateY ? 'rotateY(180deg)' : ''
              } ${!rotateX && !rotateY ? 'none' : ''};opacity:${
                (100 - imgOpacity) / 100
              };' class="new-svg-div">
          <div class='svgContainer' style='height:100%;width:100%;'>` +
              html +
              `</div></div>`,
            width: image.width >= 300 ? 300 : image.width,
            height:
              image.width >= 300
                ? Math.ceil((300 * image.height) / image.width)
                : image.height,
          });
        });
      } else {
        addElement('ImageBox', {
          config: {
            border:
              borderWidth > 0
                ? borderWidth + 'px ' + borderColor + ' ' + borderStyle
                : '0 solid rgba(0,0,0,1)',
            shadow: boxShadowText,
            borderRadius: borderRadius,
          },
          content: `<div style='position:relative;width:100%;height:100%; transform:${
            rotateX ? 'rotateX(180deg)' : ''
          } ${rotateY ? 'rotateY(180deg)' : ''} ${
            !rotateX && !rotateY ? 'none' : ''
          };' >
          <img  src='${
            item.url
          }' style='display: block; width: 100%; height: 100%; pointer-events: none;opacity:${
            (100 - imgOpacity) / 100
          };' /></div>`,
          width: image.width >= 300 ? 300 : image.width,
          height:
            image.width >= 300
              ? Math.ceil((300 * image.height) / image.width)
              : image.height,
        });
      }
    };
    onCancal();
  };

  render() {
    const {
      visible = false,
      onCancal,
      modalTitle,
      trans,
      isEdit,
      isAtlas,
    } = this.props;
    const {
      width,
      modalFormType,
      list,
      modalFormVisible,
      formData,
      tags,
      exts,
      total,
      spinning,
      mediaCategorys,
      mediaCategory,
      page,
    } = this.state;
    return (
      <Modal
        title={modalTitle}
        visible={visible}
        width={width}
        footer={null}
        onCancel={onCancal}
        bodyStyle={{
          padding: 0,
        }}
        style={{
          minWidth: '700px',
        }}
      >
        <Spin spinning={spinning}>
          <div className={styles.centent}>
            <div className={styles.left}>
              <div className={styles.top}>
                {mediaCategorys.map((item) => {
                  return (
                    <div
                      className={`${styles.list} ${
                        item.value === mediaCategory.value ? styles.active : ''
                      }`}
                      key={item.value}
                      onClick={() => this.onMediaCategory(item)}
                    >
                      {trans.HomeMenu[item.lang]}
                    </div>
                  );
                })}
              </div>
              <Button
                onClick={this.uploadButton}
                className={styles.plus}
                type="primary"
                shape="round"
                icon="plus"
                size="small"
                style={{ display: !isEdit ? 'block' : 'none' }}
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
                style={{ display: !isEdit ? 'block' : 'none' }}
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

              {mediaCategory.value !== 4 && (
                <div className={styles.ext}>
                  <span style={{ width: 48, display: 'inline-block' }}>
                    {trans.modalList.type}:
                  </span>
                  {exts.map((item) => {
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
              )}
              <div className={styles.tag}>
                <div
                  style={{
                    display: 'inline-block',
                    width: 40,
                    verticalAlign: 'top',
                  }}
                >
                  {trans.modalList.tag}:
                </div>
                <div style={{}} className={styles.innerTag}>
                  <CheckableTag
                    checked={this.state.tag === trans.modalList.all}
                    onChange={() => this.tagChange(trans.modalList.all)}
                  >
                    {trans.modalList.all}
                  </CheckableTag>
                  {this.state.tag !== trans.modalList.all && (
                    <CheckableTag checked={true}>{this.state.tag}</CheckableTag>
                  )}
                  {tags.map((item) => {
                    return this.state.tag !== item ? (
                      <CheckableTag
                        key={item}
                        checked={false}
                        onChange={() => this.tagChange(item)}
                      >
                        {item}
                      </CheckableTag>
                    ) : (
                      ''
                    );
                  })}
                </div>
              </div>

              <div style={{ margin: '12px 0', height: 24, lineHeight: '24px' }}>
                {isAtlas && (
                  <Button
                    className={styles.button}
                    type="primary"
                    size="small"
                    onClick={this.selectAll}
                    style={{ marginRight: '10px' }}
                  >
                    {trans.modalList.select}
                  </Button>
                )}
                <Checkbox
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}
                >
                  {trans.modalList.allCheck}
                </Checkbox>

                <Button
                  className={styles.button}
                  type="primary"
                  size="small"
                  onClick={this.deleteAll}
                  style={{
                    marginRight: 8,
                    display:
                      this.state.checkedList &&
                      this.state.checkedList.length !== 0
                        ? 'inline-block'
                        : 'none',
                  }}
                >
                  {trans.modalList.delete}
                </Button>
                {this.state.checkedList &&
                  this.state.checkedList.length > 0 &&
                  !this.props.onClick &&
                  !isEdit &&
                  !this.props.isAtlas && (
                    <Button
                      className={styles.button}
                      type="primary"
                      size="small"
                      onClick={this.chooseAllAddToWorkSpace}
                      style={{
                        marginRight: 8,
                      }}
                    >
                      {trans.modalList.addToWorkSpace}
                    </Button>
                  )}

                <Button
                  className={styles.button}
                  type="primary"
                  size="small"
                  onClick={() => this.setState({ moveToTagVisible: true })}
                  style={{
                    marginRight: 8,
                    display:
                      this.state.tag === trans.modalList.all ||
                      (this.state.checkedList &&
                        this.state.checkedList.length === 0)
                        ? 'none'
                        : 'inline-block',
                  }}
                >
                  {trans.modalList.changeTag}
                </Button>

                {/* 选择移入标签弹窗 */}
                <Modal
                  visible={this.state.moveToTagVisible}
                  width={400}
                  onCancel={() =>
                    this.setState({
                      moveToTagVisible: false,
                      newTag: undefined,
                    })
                  }
                  onOk={() => this.moveToTag()}
                >
                  {tags.map((item, index) => {
                    return (
                      <span key={item}>
                        <CheckableTag
                          checked={this.state.newTag === item}
                          onChange={() => this.setState({ newTag: item })}
                        >
                          {item}
                        </CheckableTag>
                        {index !== tags.length - 1 && (
                          <Divider type="vertical" />
                        )}
                      </span>
                    );
                  })}
                </Modal>
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
                  renderItem={(item) => (
                    <List.Item
                      className={styles.items}
                      key={item.id}
                      style={{
                        cursor: `${
                          isEdit || this.props.onClick ? 'pointer' : 'default'
                        }`,
                      }}
                      onClick={() => {
                        if (this.props.onClick) {
                          this.props.onClick(item.url, item);
                        } else if (isEdit) {
                          this.props.selectImg(item.url);
                          this.props.onCancal();

                          let image = new Image();
                          image.src = item.url;

                          image.onload = () => {
                            this.setState({
                              addPicModalVisible: true,
                              addPicUrl: item.url,
                              addPicUrlWidth: image.width,
                              addPicUrlHeight: image.height,
                              addPicScale: image.height / image.width,
                            });
                          };
                        } else if (this.props.isAtlas) {
                          this.props.addImageOk([item.url]);
                        } else {
                          this.addPicToWS(item);
                        }
                      }}
                    >
                      <ColorPic item={item}></ColorPic>
                      {item.name && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '122px',
                            width: '130px',
                            fontSize: '14px',
                          }}
                        >
                          <Tooltip placement="bottom" title={item.name}>
                            <LinesEllipsis
                              text={item.name}
                              maxLine="2"
                              ellipsis="..."
                              onReflow={(rleState) => {
                                const { clamped, text } = rleState;
                                if (clamped) {
                                }
                              }}
                              trimRight
                              basedOn="letters"
                            />
                          </Tooltip>
                        </div>
                      )}
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backgroundImage:
                            'linear-gradient(#00000011, #00000033, #00000099)',
                        }}
                      >
                        <Checkbox
                          className={styles.choose}
                          onClick={(e) => e.stopPropagation()}
                          value={item.id}
                        ></Checkbox>

                        <div
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: 27,
                            bottom: 0,
                            left: 0,
                          }}
                        >
                          <div
                            className={styles.collection}
                            onClick={(e) => this.collection(e, item)}
                            key={item.value}
                          >
                            {item.colloectionState !== 1 ? (
                              <Icon type="heart" />
                            ) : (
                              <Icon
                                type="heart"
                                theme="filled"
                                style={{ color: 'rgba(230, 70, 70, 1)' }}
                              />
                            )}
                          </div>

                          <div
                            className={styles.preview}
                            onClick={(e) => this.preview(e, item)}
                            key={item.value}
                          >
                            <Icon type="bg-colors" />
                          </div>

                          <div
                            className={styles.edit}
                            onClick={(e) => this.edit(e, item)}
                            key="list-loadmore-edit"
                          >
                            <Icon type="edit" />
                          </div>
                          <Popconfirm
                            key={item.value}
                            title="Do you want to delete this row?"
                            onConfirm={(e) => this.remove(e, item)}
                            onCancel={(e) => e.stopPropagation()}
                          >
                            <div
                              className={styles.delete}
                              onClick={(e) => e.stopPropagation()}
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
                style={{ marginTop: 16 }}
              />
            </div>
          </div>
        </Spin>
        {modalFormVisible && (
          <ModalForm
            modalTitle={modalTitle}
            onMediaCategory={this.onMediaCategory}
            formData={formData}
            type={modalFormType}
            onCancal={this.cancalModalForm}
            mediaCategorys={mediaCategorys}
            mediaCategory={mediaCategory}
            addToWs={this.addPicToWS}
            setAsBg={this.setAsBg}
            trans={trans}
            isAtlas={this.props.isAtlas}
            addImageOk={this.props.addImageOk}
          ></ModalForm>
        )}
        {/* <Modal
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
       */}
      </Modal>
    );
  }
}

export default ModalList;
