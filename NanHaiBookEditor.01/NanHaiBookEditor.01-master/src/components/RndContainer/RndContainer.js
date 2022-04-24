import { Modal, Tag, Icon } from 'antd';
import React from 'react';
import styles from './RndContainer.module.css';
import Dialog from '../Dialog/Dialog';
import UEditor from '../UEditor/UEditor';
import AniDialog from '../AniDialog/index';
import htmlReactParser from 'html-react-parser';
import QuestionForm from '../InteractiveQuestionMenu/QuestionForm/QuestionForm.tsx';
import { ElementTypes } from '../../constants';
import Drawing from '../Drawing';
import UploadVideo from './UploadVideo/UploadVideo';
import UploadAudio from './UploadAudio/UploadAudio';
import Code from './Code/Code';
import ColorFillGame from '../ColorFillGame/ColorFillGame';
import Atlas from '../Atlas/Atlas';
import AniBtnIcon from '../../icons/AnibtnIcon';
import ElementEditIcon from '../../icons/ElementEditIcon';
import NewRnd from '../NewRnd/NewRnd';
import ProofRuby from '../ProofRuby/Index';
import PhotoGallery from '../HomeMenu/PhotoGallery/ModalList';

import './Pinyin.css';
import './Question.css';
import './UeditorList.css';
import './UeditorTable.css';

// 控制音频播放状态
const controlAudio = () => {
  let audioList = document.querySelectorAll('.ueditorAudio');
  // console.log('控制音频播放状态控制音频播放状态控制音频播放状态', audioList);
  for (let i = 0; i < audioList.length; i++) {
    let audio = audioList[i];
    let paused = audio.getAttribute('paused');
    // console.log('rndContainer saveUeditorContent audio', audio, paused);
    if (paused === 'true') {
      audio.pause();
    } else {
      audio.play();
    }
  }
};

const openEditorDialog = (
  trans,
  act,
  element,
  elementId,
  htmlContent = '',
  background,
  bookPages
) => {
  let fontStyle = {};

  let currentPage = bookPages.present.pages.find((item) => {
    return item.id === bookPages.showingPageId;
  });

  if (currentPage.config && currentPage.config.fontSize) {
    fontStyle.fontSize = currentPage.config.fontSize;
  }
  if (currentPage.config && currentPage.config.fontFamily) {
    fontStyle.fontFamily = currentPage.config.fontFamily;
  }
  if (currentPage.config && currentPage.config.fontColor) {
    fontStyle.fontColor = currentPage.config.fontColor;
  }

  // 为editor内的字典增加不可编辑
  if (htmlContent) {
    htmlContent = htmlContent.replace(
      /class="distioncontent"/g,
      'class="distioncontent" contenteditable="false"/'
    );
  }
  Dialog.open({
    childrens: [UEditor],
    props: {
      lang: trans.id === 'en' ? 'en' : 'zh-cn',
      htmlContent,
      trans,
      element,
      background,
      bookPages,
      saveUeditorContent: (editorResult, background) => {
        act(editorResult, elementId, background);
        setTimeout(() => {
          controlAudio();
        }, 0);
        Dialog.close();
      },
      closeDialog: () => {
        Dialog.close();
      },
    },
    closeDialog: () => {
      console.log('关闭了dialog');
    },
  });
};

const openUploadVideoDialog = (
  trans,
  act,
  element,
  elementId,
  content = ''
) => {
  Dialog.open({
    childrens: [UploadVideo],
    props: {
      lang: trans.id === 'en' ? 'en' : 'zh-cn',
      content,
      trans,
      element,
      saveUploadVideo: (videoIframe, config) => {
        act(element.content[0].value, videoIframe, elementId, config);
        Dialog.close();
      },
      closeDialog: () => {
        Dialog.close();
      },
    },
    closeDialog: () => {
      console.log('openUploadVideoDialog 关闭了dialog');
    },
  });
};

const openUploadAudioDialog = (
  trans,
  act,
  element,
  elementId,
  content = '',
  config
) => {
  Dialog.open({
    childrens: [UploadAudio],
    props: {
      lang: trans.id === 'en' ? 'en' : 'zh-cn',
      content,
      trans,
      element,
      saveUploadAudio: (audioIframe, config) => {
        console.log('openUploadAudioDialog', audioIframe, config);
        act(element.content[0].value, audioIframe, elementId, config);
        setTimeout(() => {
          controlAudio();
        }, 0);
        Dialog.close();
      },
      closeDialog: () => {
        Dialog.close();
      },
    },
    closeDialog: () => {
      // console.log('openUploadAudioDialog 关闭了dialog');
    },
  });
};

const openCodeDialog = (trans, act, element) => {
  Dialog.open({
    childrens: [Code],
    props: {
      lang: trans.id === 'en' ? 'en' : 'zh-cn',
      trans,
      element,
      saveCode: (html, config) => {
        // console.log('openCodeDialogopenCodeDialogopenCodeDialog', html);
        act(element.content[0].value, html, element.id, config);
        Dialog.close();
      },
      closeDialog: () => {
        Dialog.close();
      },
    },
    closeDialog: () => {
      // console.log('openCodeDialog 关闭了dialog');
    },
  });
};

const anilist = [
  { label: 'bounce', meaning: '弹跳' },
  { label: 'flash', meaning: '闪现' },
  { label: 'pulse', meaning: '脉搏' },
  { label: 'rubberBand', meaning: '橡皮筋' },
  { label: 'shake', meaning: '摇晃' },
  { label: 'swing', meaning: '摇摆' },
  { label: 'tada', meaning: '嗒哒' },
  { label: 'wobble', meaning: '晃动' },
  { label: 'jello', meaning: '果冻' },
  { label: 'heartBeat', meaning: '心跳' },
  { label: 'bounceIn', meaning: '进场' },
  { label: 'bounceInDown', meaning: '上进场' },
  { label: 'bounceInLeft', meaning: '左进场' },
  { label: 'bounceInRight', meaning: '右进场' },
  { label: 'bounceInUp', meaning: '下进场' },
  { label: 'bounceOut', meaning: '出场' },
  { label: 'bounceOutDown', meaning: '上出场' },
  { label: 'bounceOutLeft', meaning: '左进场' },
  { label: 'bounceOutRight', meaning: '右进场' },
  { label: 'bounceOutUp', meaning: '下进场' },
  { label: 'fadeIn', meaning: '入场' },
  { label: 'fadeInDown', meaning: '上入场' },
  { label: 'fadeInDownBig', meaning: '大上入场' },
  { label: 'fadeInLeft', meaning: '左入场' },
  { label: 'fadeInLeftBig', meaning: '大左入场' },
  { label: 'fadeInRight', meaning: '右入场' },
  { label: 'fadeInRightBig', meaning: '大右入场' },
  { label: 'fadeInUp', meaning: '上入场' },
  { label: 'fadeInUpBig', meaning: '大上入场' },
  { label: 'fadeOut', meaning: '出场' },
  { label: 'fadeOutDown', meaning: '上出场' },
  { label: 'fadeOutDownBig', meaning: '大上出场' },
  { label: 'fadeOutLeft', meaning: '左出场' },
  { label: 'fadeOutLeftBig', meaning: '大左出场' },
  { label: 'fadeOutRight', meaning: '右出场' },
  { label: 'fadeOutRightBig', meaning: '大右出场' },
  { label: 'fadeOutUp', meaning: '上出场' },
  { label: 'fadeOutUpBig', meaning: '大上出场' },
  { label: 'flip', meaning: '翻转' },
  { label: 'flipInX', meaning: '垂直翻转进场' },
  { label: 'flipInY', meaning: '水平翻转进场' },
  { label: 'flipOutX', meaning: '垂直翻转出场' },
  { label: 'flipOutY', meaning: '水平翻转出场' },
  { label: 'lightSpeedIn', meaning: '光速进场' },
  { label: 'lightSpeedOut', meaning: '光速出场' },
  { label: 'rotateIn', meaning: '旋转入场' },
  { label: 'rotateInDownLeft', meaning: '左下旋转入场' },
  { label: 'rotateInDownRight', meaning: '右下旋转入场' },
  { label: 'rotateInUpLeft', meaning: '左上旋转入场' },
  { label: 'rotateInUpRight', meaning: '右上旋转入场' },
  { label: 'rotateOut', meaning: '旋转出场' },
  { label: 'rotateOutDownLeft', meaning: '左下旋转出场' },
  { label: 'rotateOutDownRight', meaning: '右下旋转出场' },
  { label: 'rotateOutUpLeft', meaning: '左上旋转出场' },
  { label: 'rotateOutUpRight', meaning: '右上旋转出场' },
  { label: 'slideInUp', meaning: '上滑动入场' },
  { label: 'slideInDown', meaning: '下滑动入场' },
  { label: 'slideInLeft', meaning: '左滑动入场' },
  { label: 'slideInRight', meaning: '右滑动入场' },
  { label: 'slideOutUp', meaning: '上滑动出场' },
  { label: 'slideOutDown', meaning: '下滑动出场' },
  { label: 'slideOutLeft', meaning: '左滑动出场' },
  { label: 'slideOutRight', meaning: '右滑动出场' },
  { label: 'zoomIn', meaning: '缩放入场' },
  { label: 'zoomInDown', meaning: '下缩放入场' },
  { label: 'zoomInLeft', meaning: '左缩放入场' },
  { label: 'zoomInRight', meaning: '右缩放入场' },
  { label: 'zoomInUp', meaning: '上缩放入场' },
  { label: 'zoomOut', meaning: '缩放出场' },
  { label: 'zoomOutDown', meaning: '下缩放出场' },
  { label: 'zoomOutLeft', meaning: '左缩放出场' },
  { label: 'zoomOutRight', meaning: '右缩放出场' },
  { label: 'zoomOutUp', meaning: '上缩放出场' },
  { label: 'hinge', meaning: '悬挂掉落出场' },
  { label: 'jackInTheBox', meaning: '弹出' },
  { label: 'rollIn', meaning: '翻滚进场' },
  { label: 'rollOut', meaning: '翻滚出场' },
];

class RndContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      editTemplate: false,
      onDrag: false,
      aniclass: '',
      modalTitle: '修改题目',
      modalVisible: false,
      isShowAniContent: false,
      previewAni: undefined,
      resizeable: true,
      chooseQuestion: false,
      groupList: [],
      questionName: [],
      editGroup: undefined,
      ColorFillGameShow: false,
      ColorFillGameChild: {},
      AtlasChild: {},
      startTime: 0,
      endTime: 0,
      eidtSvgVisible: false,
      drawingVisible: false,
      photoGallery: false,
    };
    this.clickTemplateCard = this.clickTemplateCard.bind(this);
  }
  findAniMeaning(name) {
    let ani = anilist.find((item) => item.label === name);
    if (ani) {
      return this.props.trans.id === 'en' ? ani.label : ani.meaning;
    }
  }
  handleModalCancel() {
    this.setState({
      modalVisible: false,
    });
  }
  handleOpenMomal() {
    this.setState({
      modalVisible: true,
    });
  }
  editQuestion(act, element) {
    return (...argus) => {
      act(argus[0], element.id);
      this.setState({
        modalVisible: false,
      });
    };
  }

  componentDidMount() {
    controlAudio();
    // showCanvasImg();

    if (this.props.element.type === ElementTypes.questionGroup) {
      this.getGroupQuestionsList(this.props.element.content[0].value);
    }

    if (this.props.element.type === ElementTypes.textBox) {
      const div = document.createElement('div');
      div.innerHTML = this.props.element.content[0].value;
      const words = div.getElementsByClassName('words');

      if (words[0]) {
        let startTime = words[0].getAttribute('data-start');
        let endTime = words[words.length - 1].getAttribute('data-end');
        this.setState({ startTime, endTime });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.element.type === ElementTypes.questionGroup) {
      if (
        this.props.element.content[0].value !==
        prevProps.element.content[0].value
      ) {
        this.getGroupQuestionsList(this.props.element.content[0].value);
      }
    }
  }

  getGroupQuestionsList(content) {
    const divEle = document.createElement('div');
    divEle.innerHTML = content;
    const questionEles = divEle.getElementsByClassName('question-container');
    let questionArr = [];
    let questionName = [];

    for (let i = 0; i < questionEles.length; i++) {
      const stem = questionEles[i]
        .getElementsByClassName('question-name')[0]
        .getElementsByClassName('simp-p')[0];

      if (stem) {
        const textInner = document.createElement('div');
        textInner.innerHTML = stem.innerHTML.replace(/<rt>.*?<\/rt>/g, '');
        questionName.push(
          questionEles[i].style.zIndex +
            '. ' +
            textInner.innerText.replace(/^\s+|\s+$/g, '')
        );
      } else {
        questionName.push(
          questionEles[i].style.zIndex +
            '. ' +
            questionEles[i].getElementsByClassName('question-name')[0].innerText
        );
      }
      questionArr.push(questionEles[i].outerHTML);
    }

    this.setState({ questionGroup: questionArr, questionName });
  }

  onDragHandler() {
    return (...args) => {
      // console.log('%onDragHandler' + this.state.onDrag, 'color:red');
      this.setState({
        onDrag: true,
      });
    };
  }
  onDragStopHandler(element, act, keyShift) {
    return (...args) => {
      // console.log('%conDragStopHandler', 'color:red');

      setTimeout(() => {
        this.setState({
          onDrag: false,
        });
      }, 0);

      // 按住shift 时选中元素会产生NaN
      let { config } = element;
      if (!keyShift) {
        let dragDetail = args[1];

        let x = dragDetail.x ? dragDetail.x : config.x;
        let y = dragDetail.y ? dragDetail.y : config.y;
        act(
          {
            x,
            y,
          },
          element.id
        );
      }

      // x = keyShift ? x + resetStyle.minX : x
      // y = keyShift ? y + resetStyle.minY: y
    };
  }
  onSelectElementHandler(id, act) {
    // 如果在拖动过程中就不选中，否则容易定位失败
    return (...args) => {
      //if (!this.state.onDrag) {
      // console.log('%conSelectElementHandler', 'color:red');
      act(id);
      //}
    };
  }

  clickTemplateCard(e, act, element) {
    const domToString = (node) => {
      let tmpNode = document.createElement('div');
      tmpNode.appendChild(node);
      let str = tmpNode.innerHTML;
      tmpNode = node = null; // 解除引用，以便于垃圾回收
      return str;
    };
    e.persist();
    if (e.target.id.indexOf('placeholder') > -1) {
      let oldDom = e.target;
      let newDom = oldDom.cloneNode(true);
      let htmlStr = domToString(newDom);

      openEditorDialog(
        {},
        (result, elementId) => {
          act(htmlStr, result, elementId);
        },
        element,
        element.id,
        htmlStr,
        element.content[0].background
      );
      this.setState({
        editTemplate: true,
      });
    }
  }

  setPreviewAni(name) {
    this.setState({ previewAni: name });
  }

  openSetAniDialog = (config, actSet, id, actTri) => {
    const page = this.props.bookPages.present.pages.find(
      (value) => value.id === this.props.bookPages.showingPageId
    );

    const elements = [{ value: id, label: 'Self' }];
    const groups = [];

    for (let i = 0; i < page.elements.length; i++) {
      const element = page.elements[i];
      if (element.id !== id) {
        elements.push({
          value: element.id,
          label: element.config.name || element.type,
        });
      }

      if (
        element.config &&
        element.config.groupName &&
        !groups.includes(element.config.groupName)
      ) {
        groups.push(element.config.groupName);
      }
    }

    AniDialog.open({
      groups,
      elements,
      aniClassName: config.aniClassName,
      rotateDeg: config.rotateDeg,
      aniTimes: config.anitimes, // 动画次数
      aniLoop: config.aniloop, // 动画循环
      aniDuration: config.duration, // 动画时长
      aniDelay: config.anidelay, //动画延时
      showState: config.showState,
      hideDelay: config.hideDelay,
      aniAudioUrl: config.aniAudioUrl,
      aniAudioName: config.aniAudioName,

      trigger: config.trigger !== 0 ? config.trigger : undefined, // 触发方式 1:单击 2:双击
      triggerType: config.triggerType !== 0 ? config.triggerType : undefined, // 触发效果 1:播放声音 2:播放动画 3:插入新图片
      triggerMusicName: config.triggerMusicName, // 触发音乐名称
      triggerAudio: config.triggerAudio, // 触发音乐链接
      triggerMusicLoop: config.triggerMusicLoop, // 触发音乐次数
      triggerMusicTimes: config.triggerMusicTimes, // 触发音乐名称
      triggerAniName: config.triggerAniName, // 触发动画名称
      triggerAniTimes: config.triggerAniTimes, // 触发动画次数
      triggerAniLoop: config.triggerAniLoop, // 触发动画循环
      triggerAniDuration: config.triggerAniDuration, // 触发动画时长
      triggerAniDelay: config.triggerAniDelay, //触发动画延时
      triggerElId: config.triggerElId,
      triggerHideElId: config.triggerHideElId, // 触发隐藏的elementId
      triggerHideAni: config.triggerHideAni,
      triggerHideDelay: config.triggerHideDelay,
      bringToFront: config.bringToFront,
      bringToBack: config.bringToBack,
      group: undefined,
      confirmAniset: (ani) => {
        actSet(ani, id);
      },
      confirmTriset: (tri) => {
        actTri(tri, id);
      },
      closeDialog: () => {},
      previewAni: (ani) => {
        this.setPreviewAni(ani.preAniClassName);
      },
    });
  };

  deleteGroupQuestion = (index) => {
    let questionGroup = this.state.questionGroup;
    questionGroup.splice(index, 1);
    let innerHTML = `<div class='questions-group'>${questionGroup.join(
      ''
    )}</div>`;
    this.props.setQuestionsGroup(innerHTML, true);
  };

  editGroupQuestion = (content) => {
    let index = this.state.editIndex;
    let questionGroup = this.state.questionGroup;
    if (this.state.editIndex !== 0 && !this.state.editIndex) {
      // 新加入题组
      this.props.setQuestionsGroup(content, false, this.props.element.id);
    } else {
      questionGroup[index] = content;

      let innerHTML = `<div class='questions-group'>${questionGroup.join(
        ''
      )}</div>`;

      this.props.setQuestionsGroup(innerHTML, true);
    }
  };

  editQuestion = ({ dom, isGroup }) => {
    const { element, actEditChoiceQuestion } = this.props;

    if (!isGroup) {
      if (!this.state.editIndex) {
        actEditChoiceQuestion(dom, element.id);
      } else {
        let index = this.state.editIndex;
        let questionGroup = this.state.questionGroup;
        questionGroup.splice(index, 1);
        let innerHTML = `<div class='questions-group'>${questionGroup.join(
          ''
        )}</div>`;
        this.props.setQuestionsGroup(innerHTML, true, null, dom);
      }
    } else {
      this.editGroupQuestion(dom);
    }
  };

  getImg = (content) => {
    const image = content.replace(/<iframe .*?><\/iframe>/g, '');

    return image ? htmlReactParser(image) : '';
  };

  // rnd cb
  onRotateStop = (rotate) => {
    this.setState({ imageRotate: rotate });

    const { config, id } = this.props.element;
    this.props.actSetElementAni(
      {
        rotateDeg: `${rotate}deg`,
        aniClassName: config.aniClassName,
        aniTimes: config.anitimes || 1,
        aniDelay: config.anidelay || 0,
        aniDuration: config.duration || 1,
        aniLoop: config.aniloop || false,
        hideDelay: config.hideDelay,
        showState: config.showState,
        aniAudioName: config.aniAudioName,
        aniAudioUrl: config.aniAudioUrl,
      },
      id
    );
  };
  onDragStop = (position) => {
    this.props.actSetElementPos(
      { x: position.x, y: position.y },
      this.props.element.id
    );
  };
  onResizeStop = (size) => {
    this.props.actSetElementSize(
      { width: size.width, height: size.height },
      this.props.element.id
    );
  };
  setFocus = (focus) => {
    if (this.props.setFocus) {
      this.props.setFocus(focus);
    }
  };

  render() {
    const {
      element,
      trans,
      bookPages,
      actSetElementAni,
      actSetElementTrigger,
      actSelectElement,
      actSetTextHtml,
      actReplaceTempParagraph,
      actSetElementContent,
    } = this.props;
    const { config } = element;
    // 前端显示音频
    element.content[0].value2 = element.content[0].value.replace(
      /autoplay/g,
      ''
    );
    element.content[0].value2 = element.content[0].value2.replace(
      /text decoration/g,
      'text-decoration'
    );
    element.content[0].value = element.content[0].value.replace(
      /text decoration/g,
      'text-decoration'
    );

    let innerStyle = {};
    innerStyle.background = element.content[0].background;
    innerStyle.padding = element.config.padding;
    innerStyle.borderRadius = element.config.borderRadius;
    innerStyle.border = element.config.border;
    innerStyle.boxShadow = element.config.shadow;

    let className = '';
    if (!element.show) {
      className += ` ${styles.rndItemHidden}`;
    }

    if (element.highlight) {
      className += ` ${styles.highlight}`;
    }

    let fontStyle = {};

    let currentPage = bookPages.present.pages.find((item) => {
      return item.id === bookPages.showingPageId;
    });

    if (currentPage.config && currentPage.config.fontSize) {
      fontStyle.fontSize = currentPage.config.fontSize;
    }
    if (currentPage.config && currentPage.config.fontFamily) {
      fontStyle.fontFamily = currentPage.config.fontFamily;
    }
    if (currentPage.config && currentPage.config.fontColor) {
      fontStyle.color = currentPage.config.fontColor;
    }
    if (currentPage.config && currentPage.config.textAlign) {
      fontStyle.textAlign = currentPage.config.textAlign;
    }

    const showBtn =
      element.config.select && !this.props.grouped
        ? {}
        : {
            display: 'none',
          };

    return (
      <>
        <NewRnd
          contextMenu={() => {
            if (element.type === ElementTypes.imageBox) {
              this.setState({ eidtSvgVisible: true });
            }
          }}
          size={{
            width: Number(config.width),
            height: Number(config.height),
          }}
          position={{
            x: Number(config.x),
            y: Number(config.y),
          }}
          hideHandle={element.type === ElementTypes.nextButton}
          disabled={this.state.modalVisible}
          // 横屏竖屏围栏
          dragGrid={
            bookPages.present.config.isVertical
              ? { x: 768, y: 984 }
              : { x: 1024, y: 728 }
          }
          rotate={
            config.rotateDeg ? Number(config.rotateDeg.replace('deg', '')) : 0
          }
          innerStyle={innerStyle}
          innerClass={this.state.previewAni}
          show={element.show}
          highlight={element.highlight}
          selectElement={(event) => {
            actSelectElement(element.id);
          }}
          element={element}
          onSelect={element.id === bookPages.selectElementId}
          onRotateStop={this.onRotateStop}
          onDragStop={this.onDragStop}
          onResizeStop={this.onResizeStop}
          setFocus={this.setFocus}
          translate={this.props.grouped}
        >
          {element.type === ElementTypes.nextButton && (
            <div
              id={element.id}
              style={{ width: '100%', height: '100%', visible: 'hidden' }}
            >
              <div className={`${styles.triggerCover} trigger-cover`}></div>
              {htmlReactParser(element.content[0].value)}
            </div>
          )}
          {element.type === ElementTypes.newChoiceQuestion ||
          element.type === ElementTypes.questionGroup ? (
            <div
              id={element.id}
              className={`${
                bookPages.present.config.simple ? 'hideTrad' : 'hideSimp'
              }${
                !bookPages.present.config.pinyin ? ` ${styles.hidePinyin}` : ''
              }`}
              style={{
                width: '100%',
                height: '100%',
                visible: 'hidden',
                pointerEvents: 'none',
              }}
            >
              <div className={`${styles.triggerCover} trigger-cover`}></div>
              {htmlReactParser(element.content[0].value)}
            </div>
          ) : (
            ''
          )}
          {element.type === ElementTypes.imageBox ? (
            <div
              id={element.id}
              style={{ width: '100%', height: '100%', visible: 'hidden' }}
            >
              <div className={`${styles.triggerCover} trigger-cover`}></div>

              {/* htmlReactParser 会导致内联svg fill使用url失效的问题 */}
              <div
                dangerouslySetInnerHTML={{ __html: element.content[0].value }}
                style={{ position: 'relative', width: '100%', height: '100%' }}
              ></div>
            </div>
          ) : (
            ''
          )}
          {element.type === ElementTypes.insertCode && (
            <div
              id={element.id}
              style={{
                width: '100%',
                height: '100%',
                visible: 'hidden',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div className={`${styles.triggerCover} trigger-cover`}></div>
              {
                <iframe
                  style={{
                    border: 0,
                    height: '100%',
                    width: '100%',
                  }}
                  srcDoc={
                    element.config.extends
                      ? `<style>${
                          JSON.parse(element.config.extends).cssTem
                        }</style><script>${
                          JSON.parse(element.config.extends).jsTem
                        }</script>${JSON.parse(element.config.extends).htmlTem}`
                      : ''
                  }
                ></iframe>
              }
              <div className={styles.videoMask}></div>
            </div>
          )}

          {element.type === ElementTypes.videoBox ||
          element.type === ElementTypes.audioBox ||
          element.type === ElementTypes.colorFillGame ||
          element.type === ElementTypes.atlas ? (
            <div
              id={element.id}
              style={{
                width: '100%',
                height: '100%',
                visible: 'hidden',
                position: 'relative',
                overflow:
                  element.type === ElementTypes.atlas ? 'visible' : 'hidden',
              }}
            >
              <div className={`${styles.triggerCover} trigger-cover`}></div>
              {htmlReactParser(element.content[0].value)}
              <div className={styles.videoMask}></div>
            </div>
          ) : (
            ''
          )}

          {element.type === ElementTypes.textBox ||
          element.type === ElementTypes.templateCard ||
          element.type === ElementTypes.choiceQuestion ? (
            <div className={styles.templateCardBox} id={element.id}>
              <div className={`${styles.triggerCover} trigger-cover`}></div>
              <div
                id="templateCard"
                onClick={(event) => {
                  this.clickTemplateCard(
                    event,
                    actReplaceTempParagraph,
                    element
                  );
                }}
                className={`${styles.innerContainer} ${
                  bookPages.present.config.simple ? 'hideTrad' : 'hideSimp'
                }${
                  !bookPages.present.config.pinyin
                    ? ` ${styles.hidePinyin}`
                    : ''
                }`}
                style={element.type === ElementTypes.textBox ? fontStyle : {}}
              >
                {htmlReactParser(element.content[0].value)}
                <div className={styles.videoMask}></div>
              </div>
            </div>
          ) : element.type === ElementTypes.leafletMap &&
            element.content[0].value ? (
            <div className={styles.templateCardBox} id={element.id}>
              <div className={`${styles.triggerCover} trigger-cover`}></div>
              <img
                draggable="false"
                className={styles.mapImage}
                src={element.content[0].value}
              />
            </div>
          ) : element.type === ElementTypes.drawingBox ? (
            <div className={styles.DrawingboxInner} id={element.id}>
              <div className={`${styles.triggerCover} trigger-cover`}></div>
              drawing box
              {htmlReactParser(
                element.content[0].value.replace(/<iframe .*?><\/iframe>/g, '')
              )}
            </div>
          ) : element.type === ElementTypes.typingBox ? (
            <div className={styles.templateCardBox} id={element.id}>
              <div className={`${styles.triggerCover} trigger-cover`}></div>
              打字框
            </div>
          ) : (
            ''
          )}

          {/* 编辑,设置按钮 */}
          <div className={styles.iconContainer}>
            {element.type === ElementTypes.imageBox && (
              <div
                className={styles.iconButton}
                style={showBtn}
                onMouseDown={(event) => {
                  event.stopPropagation();
                  event.preventDefault();

                  this.setState({ photoGallery: true });
                }}
              >
                <Icon type="picture" />
              </div>
            )}

            {element.type === ElementTypes.imageBox ||
            element.type === ElementTypes.nextButton ? (
              <div
                className={styles.iconButton}
                style={showBtn}
                onMouseDown={(event) => {
                  event.stopPropagation();
                  event.preventDefault();

                  this.openSetAniDialog(
                    config,
                    actSetElementAni,
                    element.id,
                    actSetElementTrigger
                  );
                }}
              >
                <AniBtnIcon />
              </div>
            ) : (
              ''
            )}

            {element.type === ElementTypes.videoBox ||
            element.type === ElementTypes.audioBox ||
            element.type === ElementTypes.insertCode ? (
              <div
                className={styles.iconButton}
                style={showBtn}
                onMouseDown={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  this.openSetAniDialog(
                    config,
                    actSetElementAni,
                    element.id,
                    actSetElementTrigger
                  );
                }}
              >
                <AniBtnIcon />
              </div>
            ) : (
              ''
            )}
            {element.type === ElementTypes.videoBox ||
            element.type === ElementTypes.audioBox ||
            element.type === ElementTypes.insertCode ||
            element.type === ElementTypes.colorFillGame ||
            element.type === ElementTypes.atlas ? (
              <div
                onMouseDown={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  if (element.type === ElementTypes.videoBox) {
                    openUploadVideoDialog(
                      trans,
                      actReplaceTempParagraph,
                      element,
                      element.id,
                      element.content[0].value
                    );
                  } else if (element.type === ElementTypes.audioBox) {
                    openUploadAudioDialog(
                      trans,
                      actReplaceTempParagraph,
                      element,
                      element.id,
                      element.content[0].value
                    );
                  } else if (element.type === ElementTypes.insertCode) {
                    openCodeDialog(trans, actReplaceTempParagraph, element);
                  } else if (element.type === ElementTypes.colorFillGame) {
                    this.setState({
                      ColorFillGameShow: true,
                    });
                    // this.state.ColorFillGameChild.init(document.querySelector('#defaultImg').src)
                  } else if (element.type === ElementTypes.atlas) {
                    this.setState({
                      AtlasShow: true,
                    });
                    this.state.AtlasChild.init();
                  }
                }}
                className={styles.iconButton}
                style={showBtn}
              >
                <div>
                  <ElementEditIcon width={36} height={36} />
                </div>
              </div>
            ) : (
              ''
            )}

            {element.type === ElementTypes.textBox ||
            element.type === ElementTypes.drawingBox ||
            element.type === ElementTypes.newChoiceQuestion ||
            element.type === ElementTypes.questionGroup ? (
              <>
                <div
                  className={styles.iconButton}
                  style={showBtn}
                  onMouseDown={(event) => {
                    event.stopPropagation();
                    event.preventDefault();

                    this.openSetAniDialog(
                      config,
                      actSetElementAni,
                      element.id,
                      actSetElementTrigger
                    );
                  }}
                >
                  <AniBtnIcon />
                </div>

                <div
                  onMouseDown={(event) => {
                    event.stopPropagation();
                    event.preventDefault();

                    if (element.type === ElementTypes.textBox) {
                      openEditorDialog(
                        trans,
                        actSetTextHtml,
                        element,
                        element.id,
                        element.content[0].value,
                        element.content[0].background,
                        bookPages
                      );
                    }
                    if (element.type === ElementTypes.drawingBox) {
                      this.setState({ drawingVisible: true });
                    }
                    if (element.type === ElementTypes.newChoiceQuestion) {
                      this.handleOpenMomal();
                    }
                    if (element.type === ElementTypes.questionGroup) {
                      this.setState({ chooseQuestion: true });
                    }
                  }}
                  className={styles.iconButton}
                  style={showBtn}
                >
                  <div>
                    <ElementEditIcon width={36} height={36} />
                  </div>
                </div>
              </>
            ) : (
              ''
            )}
            {element.type === ElementTypes.questionGroup ||
            element.type === ElementTypes.newChoiceQuestion ||
            element.type === ElementTypes.textBox ? (
              <div
                className={styles.iconButton}
                style={showBtn}
                onMouseDown={(event) => {
                  event.stopPropagation();
                  event.preventDefault();

                  this.setState({ proofVisible: true });
                }}
              >
                <Icon type="highlight" />
              </div>
            ) : (
              ''
            )}
          </div>

          {/* animation tip */}
          <div
            className={styles.aniTip}
            style={{ transform: `rotate(-${config.rotateDeg})` }}
          >
            {config.rotateDeg && config.rotateDeg !== '0deg' ? (
              <Tag color="#108ee9">
                {trans.AniDialog.rotate}: {config.rotateDeg}
              </Tag>
            ) : (
              ''
            )}
            {config.aniClassName &&
            config.aniClassName.replace('animateElement ', '') ? (
              <Tag color="#108ee9">
                {trans.AniDialog.animate}:
                {this.findAniMeaning(
                  config.aniClassName.replace('animateElement ', '')
                )}
                - {trans.AniDialog.loop}:
                {config.aniloop ? trans.AniDialog.infinite : config.anitimes}
                {config.anidelay !== 0
                  ? ` ${trans.AniDialog.delay}:${config.anidelay}s`
                  : ''}
              </Tag>
            ) : (
              ''
            )}
            {config.hideDelay ? (
              <Tag color="#108ee9">
                {trans.AniDialog.hideDelay}: {config.hideDelay}s
              </Tag>
            ) : (
              ''
            )}
            {this.state.startTime && this.state.endTime ? (
              <Tag color="#108ee9">
                read: {this.state.startTime}s - {this.state.endTime}s
              </Tag>
            ) : (
              ''
            )}
            {config.trigger ? (
              <Tag color="#108ee9">
                {trans.AniDialog.tab2}:
                {config.trigger === 1
                  ? trans.AniDialog.click
                  : trans.AniDialog.dbleclick}
                -
                {config.triggerAudio &&
                  `${trans.AniDialog.playAudio}-${trans.AniDialog.loop}:${
                    config.triggerMusicLoop
                      ? trans.AniDialog.infinite
                      : config.triggerMusicTimes
                  }`}
                {config.triggerAniName &&
                  ` / ${trans.AniDialog.addAnimate}:${this.findAniMeaning(
                    config.triggerAniName
                  )}-${trans.AniDialog.loop}:${
                    config.triggerAniLoop
                      ? trans.AniDialog.infinite
                      : config.triggerAniTimes
                  } ${
                    config.triggerAniDelay !== 0
                      ? `${trans.AniDialog.delay}:${config.triggerAniDelay}s`
                      : ''
                  }`}
                {config.triggerElId && ` / ${trans.AniDialog.showElement}`}
              </Tag>
            ) : (
              ''
            )}
          </div>
        </NewRnd>
        {element.type === ElementTypes.imageBox && (
          <PhotoGallery
            trans={trans}
            onCancal={() => this.setState({ photoGallery: false })}
            visible={this.state.photoGallery}
            isEdit={false}
            addElement={(type, content) => {
              const newContent = element.content;
              newContent[0].value = content.content;
              this.props.actSetElementContent(newContent, element.id);
            }}
          />
        )}

        {element.type === ElementTypes.colorFillGame ? (
          <ColorFillGame
            visible={this.state.ColorFillGameShow}
            handleCancel={() => {
              setTimeout(() => {
                // showCanvasImg();
              }, 0);
              this.setState({ ColorFillGameShow: false });
            }}
            trans={trans}
            isEdit={true}
            element={element}
            onRef={(ref) => {
              this.setState({ ColorFillGameChild: ref });
            }}
            actReplaceTempParagraph={actReplaceTempParagraph}
          />
        ) : (
          ''
        )}
        {element.type === ElementTypes.atlas ? (
          <Atlas
            visible={this.state.AtlasShow}
            handleCancel={() => {
              setTimeout(() => {
                // showCanvasImg()
              }, 0);
              this.setState({ AtlasShow: false });
            }}
            trans={trans}
            isEdit={true}
            element={element}
            onRef={(ref) => {
              this.setState({ AtlasChild: ref });
            }}
            actReplaceTempParagraph={actReplaceTempParagraph}
          />
        ) : (
          ''
        )}

        {element.type === ElementTypes.newChoiceQuestion ||
        element.type === ElementTypes.questionGroup ? (
          <QuestionForm
            trans={trans}
            onCancel={() => this.setState({ modalVisible: false })}
            visible={this.state.modalVisible}
            content={
              element.type !== ElementTypes.questionGroup
                ? element.content[0].value
                : this.state.editGroup
            }
            onOk={this.editQuestion}
          ></QuestionForm>
        ) : (
          ''
        )}

        {element.type === ElementTypes.questionGroup ? (
          <Modal
            visible={this.state.chooseQuestion}
            width="430px"
            onCancel={() => this.setState({ chooseQuestion: false })}
            destroyOnClose={true}
            footer={null}
          >
            <div>
              {this.state.questionName.map((value, index) => (
                <div key={index} className={styles.questionList}>
                  <span>{value}</span>
                  {/* <a
                    style={{ marginRight: 8 }}
                    onClick={() => this.setState({ proofVisible: true })}
                  >
                    <Icon type="highlight" />
                  </a> */}
                  <a
                    style={{ marginRight: 8 }}
                    onClick={() => {
                      this.setState({
                        editGroup: this.state.questionGroup[index], // 修改的html
                        modalVisible: true,
                        editIndex: index, // 修改的index
                      });
                    }}
                  >
                    <Icon type="edit" />
                  </a>
                  <a onClick={() => this.deleteGroupQuestion(index)}>
                    <Icon type="close" />
                  </a>
                </div>
              ))}
            </div>
          </Modal>
        ) : (
          ''
        )}

        {(element.type === ElementTypes.questionGroup ||
          element.type === ElementTypes.newChoiceQuestion ||
          element.type === ElementTypes.textBox) && (
          <ProofRuby
            element={element}
            visible={this.state.proofVisible}
            onCancel={() => this.setState({ proofVisible: false })}
          />
        )}

        {element.type === ElementTypes.drawingBox && (
          <Drawing
            trans={trans}
            visible={this.state.drawingVisible}
            handleCancel={() => this.setState({ drawingVisible: false })}
            content={element.content[0].value}
            element={element}
            actSetElementContent={actSetElementContent}
          />
        )}
      </>
    );
  }
}

export default RndContainer;
