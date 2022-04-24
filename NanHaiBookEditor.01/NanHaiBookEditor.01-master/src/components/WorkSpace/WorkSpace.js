import React, { useState, useEffect, StrictMode } from 'react';
import domtoimage from 'dom-to-image-more';
import { connect } from 'react-redux';
import RndContainer from '../RndContainer';
import styles from './WorkSpace.module.css';
import { PageLayouts } from '../../constants';
import ColorBackGround from '../ColorPic/ColorBackGround';
import {
  actSetPageThumb,
  actSetPdfThumb,
  actEditChoiceQuestion,
  copyElement,
  deleteElement,
  actEditTimer,
  actDeleteTimer,
  actSetElementSize,
  actSetElementPos,
  actIsVertical,
  actSelectElement,
  actSetElementPosition,
  actSetGroupTri,
  actSetGroupAni,
} from '../../store/bookPages/actions';
import nanoid from 'nanoid';
import { ElementTypes } from '../../constants';
import ScaleRuler from '../ScaleRuler';
import GroupStyle from './GroupStyle';
import TemplateCardList from '../TemplateCardList';
import { actSetGlobalBackgroundImage } from '../../store/ui/ui';
import NewRnd from '../NewRnd/NewRnd';
import TimerPanel from '../Timer/TimrtPanel';
import SlideBar from '../SlideBar/SlideBar';
import AniBtnIcon from '../../icons/AnibtnIcon';
import AniDialog from '../AniDialog/index';
import ScaleGrid from '../ScaleGrid';
import './WorkSpace.css';
import { Icon } from 'antd';

import ElementStyle from './ElementStyle';

const $ = window.$;

let initFlag = false;
let lastDataUrl = '';
let lastGlobalBackgoundUrl = '';

const portraitLayout = PageLayouts.portrait;
const landscapeLayout = PageLayouts.landscape;

const getScale = (layout, width, height) => {
  const mainWidth = width * 0.9;
  const mainHeight = height * 0.9;

  let w = layout.width;
  let h = layout.height;
  let wr = w / mainWidth;
  let hr = h / mainHeight;
  let s = 1;
  if (w > mainWidth || h > mainHeight) {
    if (wr >= hr) {
      s = 1 / wr;
    } else {
      s = 1 / hr;
    }
    s = Math.floor(s * 1000) / 1000;
    return s;
  }
  return 1;
};

const getTransformValue = (layout, nums = 100) => {
  let x = 0;
  let y = 0;
  const main = document.getElementById('ID-App-Main');
  const mainWidth = main.clientWidth;
  const mainHeight = main.clientHeight;
  let scale = getScale(layout, mainWidth, mainHeight) * (nums / 100);
  let w = layout.width * scale;
  let h = layout.height * scale;

  x = (mainWidth - w) / 2 / scale;
  x = Math.floor(x * 100) / 100;
  y = (mainHeight - h) / 2 / scale;
  y = Math.floor(y * 100) / 100;

  localStorage.setItem('translateInfo', JSON.stringify({ x: x, y: y }));
  return {
    style: `scale(${scale}) translate(${x - 105}px,${y - 15}px)`,
    scale: scale,
  };
};

const compareObject = (obj1, obj2) => {
  // 当前Object对象
  var propsCurr = Object.getOwnPropertyNames(obj2);
  // 要比较的另外一个Object对象
  var propsCompare = Object.getOwnPropertyNames(obj1);
  if (propsCurr.length != propsCompare.length) {
    return false;
  }
  for (var i = 0, max = propsCurr.length; i < max; i++) {
    var propName = propsCurr[i];
    if (obj2[propName] !== obj1[propName]) {
      return false;
    }
  }
  return true;
};


const openSetAniDialog = (config, actSet, id, actTri) => {
  const options = {
    triElements: [],
    aniTimes: 1, // 动画次数
    aniDuration: 0, // 动画时长
    aniDelay: 0, //动画延时
    ...config,
    confirmAniset: (ani) => {
      actSet(ani, id);
    },
    confirmTriset: (tri) => {
      actTri(tri, id);
    },
    closeDialog: () => {},
    clearPic: () => {},
    showImage: () => {},
    previewAni: () => {},
    group: true,
  };

  AniDialog.open(options);
};

const renderElements = (
  elements,
  setFocus,
  actEditQuestion,
  selectGroupId,
  actSetElementPosition,
  actSelectElement,
  isVertical,
  setGroupAni,
  setGroupTri,
  selectedId,
  currentPage
) => {
  const createElement = (element, grouped) => {

    let elementDom;
    let type = element.type;
    if (
      type === ElementTypes.textBox ||
      type === ElementTypes.leafletMap ||
      type === ElementTypes.templateCard ||
      type === ElementTypes.drawingBox ||
      type === ElementTypes.imageBox
    ) {
      elementDom = (
        <RndContainer
          key={element.id}
          show={element.show}
          select={element.config.select}
          // highlight={element.highlight}
          setFocus={setFocus}
          element={element}
          showEdit={type === ElementTypes.textBox ? true : false}
          grouped={grouped}
          currentPage={currentPage}
        />
      );
    } else {
      elementDom = (
        <RndContainer
          key={element.id}
          element={element}
          setFocus={setFocus}
          actEditQuestion={actEditQuestion}
          grouped={grouped}
          currentPage={currentPage}
        />
      );
    }

    return elementDom;
  };

  let elementDoms = [];

  elements.forEach((element, index) => {
    let elementDom;
    let groupName = element.config.groupName;
    // 分组的判断
    if (
      groupName &&
      index > 0 &&
      elements[index - 1].config.groupName === groupName &&
      groupName !== selectGroupId
    ) {
      // 存在分组,且已被创建
      return;
    } else if (groupName && groupName !== selectGroupId) {
      // 创建分组
      let groupDoms = [],
        left = [],
        width = [],
        top = [],
        height = [];

      let aniConfig = {
        aniClassName: element.config.aniClassName,
        rotateDeg: element.config.rotateDeg,
        aniTimes: element.config.anitimes, // 动画次数
        aniLoop: element.config.aniloop, // 动画循环
        aniDuration: element.config.duration, // 动画时长
        aniDelay: element.config.anidelay, //动画延时
        showState: element.config.showState,
        hideDelay: element.config.hideDelay,
        aniAudioUrl: element.config.aniAudioUrl,
        aniAudioName: element.config.aniAudioName,
      };

      for (let i = index; i < elements.length; i++) {
        let nextEle = elements[i];
        if (
          nextEle.config.groupName &&
          nextEle.config.groupName === groupName
        ) {
          groupDoms.push(nextEle);
          left.push(Number(nextEle.config.x));
          width.push(Number(nextEle.config.x )+ Number(nextEle.config.width));
          top.push(Number(nextEle.config.y));
          height.push(Number(nextEle.config.y) + Number(nextEle.config.height));
          let eleAniConfig = {
            aniClassName: nextEle.config.aniClassName,
            rotateDeg: nextEle.config.rotateDeg,
            aniTimes: nextEle.config.anitimes, // 动画次数
            aniLoop: nextEle.config.aniloop, // 动画循环
            aniDuration: nextEle.config.duration, // 动画时长
            aniDelay: nextEle.config.anidelay, //动画延时
            showState: nextEle.config.showState,
            hideDelay: nextEle.config.hideDelay,
            aniAudioUrl: nextEle.config.aniAudioUrl,
            aniAudioName: nextEle.config.aniAudioName,
          };
          if (!compareObject(aniConfig, eleAniConfig)) {
            aniConfig = {};
          }
        } else {
          break;
        }
      }

      let x = Math.min(...left);
      let y = Math.min(...top);
      let w = Math.max(...width) - x;
      let h = Math.max(...height) - y;

      elementDoms.push(
        <NewRnd
          key={groupName}
          size={{
            width: w,
            height: h,
          }}
          position={{
            x,
            y,
          }}
          hideHandle={true}
          // 横屏竖屏围栏
          dragGrid={isVertical ? { x: 768, y: 984 } : { x: 1024, y: 728 }}
          grouped={true}
          rotate={0}
          onDragStop={(position) => {
            actSetElementPosition({
              x: position.x - x,
              y: position.y - y,
              name: groupName,
            });
          }}
          show={true}
          setFocus={(focus) => {
            if (setFocus) {
              setFocus(focus);
            }
          }}
          onSelect={selectedId && groupName === selectedId.replace('group:', '')}
          selectElement={() => {
            actSelectElement('group:' + groupName);
          }}
        >
          <div id={`group_${groupName}`} style={{width: '100%', height: '100%'}}>
            {groupDoms.map((element) => createElement(element, { x, y }))}
          </div>
          <div
            className="group-set-ani"
            onMouseDown={(event) => {
              event.stopPropagation();
              event.preventDefault();

              openSetAniDialog(aniConfig, setGroupAni, groupName, setGroupTri);
            }}
          >
            <AniBtnIcon />
          </div>
        </NewRnd>
      );
    } else if (
      (groupName && groupName === selectGroupId) ||
      (!groupName && !selectGroupId)
    ) {
      elementDom = createElement(element);
    } else {
      elementDom = createElement(element, true);
    }

    elementDoms.push(elementDom);
  });

  return elementDoms;
};

const WorkSpace = ({
  id,
  elements,
  actSetPageThumb,
  bookPages,
  zoomLevel,
  ruler,
  grid,
  actSetGlobalBackgroundImage,
  actEditQuestion,
  copyElement,
  deleteElement,
  actSavePage,
  actEditTimer,
  deleteTimer,
  setIsVertical,
  showThumb,
  selectElement,
  actCancelSelectElement,
  actSetElementPosition,
  actSetGroupAni,
  actSetGroupTri,
}) => {
  const { zoomValue } = zoomLevel;
  const [transformStyle, setTransformStyle] = useState({
    style: '',
    scale: 1,
  });
  let shudeStyle = {
    opacity: 0,
  };
  let shudeItem = null;
  let globalStyle = {};
  let defaultStyle = {};
  let defaultImageStyle = {};

  let currentPage = bookPages.present.pages.find((item) => {
    return item.id === bookPages.showingPageId;
  });

  if (currentPage.config && currentPage.config.color) {
    globalStyle =
      currentPage.config.color.type == 0
        ? {
            backgroundColor: currentPage.config.color.color,
          }
        : {
            background: `${currentPage.config.color.color}`,
          };
  }

  if (currentPage.config && currentPage.config.image) {
    defaultImageStyle = {
      width: '100%',
      height: '100%',
    };
    shudeStyle = {
      backgroundImage: `url(${currentPage.config.image.url}`,
      backgroundRepeat: currentPage.config.image.backgroundRepeat,
      backgroundSize: currentPage.config.image.backgroundSize,
      opacity: 1 - currentPage.config.image.opacity / 100,
    };
    if (currentPage.config.image.url === 'none') {
      shudeItem = currentPage.config.image.picSet;
    }
  }

  const paginate = bookPages.present.paginate || {};
  const pageContent = currentPage.pageContent;
  const [focus, setFocus] = useState(false);
  const updateDimensions = (e) => {
    setTransformStyle(getTransformValue(landscapeLayout, zoomValue));
  };
  const getHistory = async () => {
    if (localStorage.getItem('book')) {
      const book = 
        JSON.parse(localStorage.getItem('book'));

        if (!book.bookName) return;

      actSavePage(bookPages, book.bookName, book.bookCode);
    }
  };
  const onKeyDown = (e) => {
    if (navigator.platform.match('Mac')) {
      // mac
      let keyCode = localStorage.getItem('keyCode')
        ? Number(localStorage.getItem('keyCode'))
        : '';
      if (keyCode === 18 && e.keyCode === 68) {
        // 删除
        deleteElement();
        return false;
      }
    } else {
      if (e.keyCode === 8 || e.keyCode === 46) {
        // 删除 delete
        deleteElement();
        return false;
      }
    }

    if (e.keyCode == 67 && e.ctrlKey) {
      // 复制 ctrl+c
      copyElement('CtrlC');
    } else if (e.keyCode == 86 && e.ctrlKey) {
      // 粘贴 ctrl+v
      copyElement('CtrlV');
    } else if (e.keyCode == 83 && e.ctrlKey) {
      e.preventDefault();
      // 保存 ctrl+s
      getHistory();
    }
    localStorage.setItem('keyCode', e.keyCode);
  };
  
  useEffect(() => {
    let timeoutHandle = setTimeout(() => {
      if (!focus) {
        actSetPageThumb(id, focus, bookPages.present.pages)();
        // actSetPdfThumb(id, focus, bookPages.present.pages)();
      }
      if (!currentPage.config || !currentPage.config.image) {
        actSetGlobalBackgroundImage();
      }
    }, 3000);

    window.addEventListener('resize', updateDimensions);
    document.querySelector('#workspace').setAttribute('tabindex', 1);
    document.querySelector('#workspace').addEventListener('keydown', onKeyDown);
    if (zoomLevel.flag) {
      initFlag = false;
    }
    if (!initFlag) {
      updateDimensions();
      initFlag = true;
      zoomLevel.flag = false;
    }

    return () => {
      clearTimeout(timeoutHandle);
      timeoutHandle = null;
      window.removeEventListener('resize', updateDimensions);
      document
        .querySelector('#workspace')
        .removeEventListener('keydown', onKeyDown);
    };
  });

  useEffect(() => {
    if (localStorage.getItem('isVertical') === 'true') {
      setIsVertical();
    }
  }, []);

  const { present } = bookPages || {};
  const { config } = present || {};

  const isVertical = config.isVertical;

  const { width, height, unit } =
    isVertical === true ? PageLayouts.portrait : PageLayouts.landscape;

  const portraitSize = {
    width: `${width}${unit}`,
    height: `${height}${unit}`,
  };

  const [onShowTimer, setOnShowTimer] = useState([]);

  useEffect(() => {
    let onShowTimerArr = [];
    if (!config.timer) return;
    config.timer.forEach((value) => {
      if (value.scope === 'all') {
        onShowTimerArr.push(value);
      } else if (value) {
        let scope = value.scope.split('-');
        let page = 1;
        present.pages.forEach((item, i) => {
          if (item.id === bookPages.showingPageId) {
            page = i + 1;
          }
        });
        if (
          (scope.length === 1 && ~~scope[0] === page) ||
          (~~scope[0] <= page && ~~scope[1] >= page)
        ) {
          onShowTimerArr.push(value);
        }
      }
    });

    setOnShowTimer(onShowTimerArr);
  }, [config.timer, bookPages.showingPageId]);

  const setTimerPosition = (x, y, config) => {
    actEditTimer({ ...config, x, y }, config.id);
  };

  const [editConfig, setEditConfig] = useState(undefined);
  const [editVisible, setEditVisible] = useState(false);

  return (
    <div
      id="workspace"
      className={styles.outerContainer}
      style={showThumb ? {} : { width: '100vw' }}
      onMouseDown={() => {
        actCancelSelectElement();
      }}
    >
      <ScaleRuler
        portraitLayout={isVertical ? portraitLayout : landscapeLayout}
        scale={transformStyle.scale}
        show={!ruler.flag}
      />
      <div
        id="workspaceCont"
        style={{
          transform: `${transformStyle.style}`,
          transformOrigin: '0% 0%',
          zIndex: bookPages.selectGroupId ? 998 : 'auto',
          ...portraitSize,
        }}
      >
        <div
          id="workspaceBox"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <div
            className="rndWorkSpaceBackground"
            id="CurrentWorkSpaceBackground"
            style={globalStyle}
          >
            {!shudeItem && <div className="shude" style={shudeStyle}></div>}
            {shudeItem && <ColorBackGround item={shudeItem}></ColorBackGround>}
          </div>
          <div
            className="rndWorkSpace"
            id="CurrentWorkSpace"
            style={defaultStyle}
          >
            <div style={defaultImageStyle}>
              <ScaleGrid
                portraitLayout={isVertical ? portraitLayout : landscapeLayout}
                scale={transformStyle.scale}
                show={!grid.flag}
              />
              {/* <div className="shude" style={shudeStyle}></div> */}
              {paginate &&
              JSON.stringify(paginate) !== '{}' &&
              paginate.paginatShow ? (
                <div
                  className={styles.paginatHeader}
                  style={{
                    top: paginate.margin.top,
                  }}
                >
                  <span
                    className="paginatcenter"
                    style={{
                      marginLeft: paginate.margin.left,
                      marginRight: paginate.margin.right,
                      textAlign: paginate.position.align,
                      fontSize: paginate.fontSize,
                      color: paginate.color,
                      fontFamily: paginate.fontFamily,
                      fontWeight: paginate.isBold ? 'bold' : 'normal',
                      fontStyle: paginate.isItalic ? 'italic' : 'normal',
                    }}
                  >
                    {paginate.position.header ? pageContent : ''}
                  </span>
                </div>
              ) : (
                ''
              )}

              <div style={{ position: 'relative', height: '100%' }}>
                {renderElements(
                  elements,
                  setFocus,
                  actEditQuestion,
                  bookPages.selectGroupId,
                  actSetElementPosition,
                  selectElement,
                  bookPages.present.config.isVertical,
                  actSetGroupAni,
                  actSetGroupTri,
                  bookPages.selectElementId,
                  currentPage
                )}

                <div
                  className="group-grid-line"
                  style={{
                    width,
                    height,
                    display: bookPages.selectGroupId ? 'block' : 'none',
                  }}
                ></div>
              </div>

              <div>
                {onShowTimer.map((config) => (
                  <NewRnd
                    key={config.id}
                    hideHandle={true}
                    size={{
                      width: config.size * 2 + 18,
                      height: config.size + 2,
                    }}
                    show={true}
                    position={{
                      x: config.x,
                      y: config.y,
                    }}
                    rotate={0}
                    onDragStop={(position) => {
                      setTimerPosition(position.x, position.y, config);
                    }}
                    style={{ border: '1px #8e8e8e solid', zIndex: 99 }}
                    setFocus={setFocus}
                  >
                    <div
                      className="previewCircle"
                      style={{
                        width: config.size,
                        height: config.size,
                        marginRight: 16,
                      }}
                    >
                      <div
                        className="previewCircleBg"
                        style={{
                          borderColor: config.bgColor,
                          borderWidth: config.bgSize,
                          width:
                            config.fgSize > config.bgSize
                              ? config.size - config.fgSize + config.bgSize
                              : config.size,
                          height:
                            config.fgSize > config.bgSize
                              ? config.size - config.fgSize + config.bgSize
                              : config.size,
                        }}
                      ></div>
                      <div
                        className="previewCircleFgWrapper"
                        style={{
                          width:
                            config.fgSize >= config.bgSize
                              ? config.size / 2
                              : (config.size + config.fgSize - config.bgSize) /
                                2,
                          right:
                            config.fgSize >= config.bgSize
                              ? 0
                              : config.size / 2 -
                                (config.size + config.fgSize - config.bgSize) /
                                  2,
                        }}
                      >
                        <div
                          className="previewCircleFg"
                          style={{
                            borderColor: config.fgColor,
                            borderWidth: config.fgSize,
                            width:
                              config.fgSize >= config.bgSize
                                ? config.size
                                : config.size + config.fgSize - config.bgSize,
                            height:
                              config.fgSize >= config.bgSize
                                ? config.size
                                : config.size + config.fgSize - config.bgSize,
                          }}
                        ></div>
                      </div>
                      <div className="previewText">
                        <h4 style={{ color: config.fontColor }}>Minute</h4>
                        <span
                          style={{
                            fontSize: config.fontSize,
                            color: config.fontColor,
                          }}
                        >
                          0
                        </span>
                      </div>
                    </div>

                    <div
                      className="previewCircle"
                      style={{
                        width: config.size,
                        height: config.size,
                      }}
                    >
                      <div
                        className="previewCircleBg"
                        style={{
                          borderColor: config.bgColor,
                          borderWidth: config.bgSize,
                          width:
                            config.fgSize > config.bgSize
                              ? config.size - config.fgSize + config.bgSize
                              : config.size,
                          height:
                            config.fgSize > config.bgSize
                              ? config.size - config.fgSize + config.bgSize
                              : config.size,
                        }}
                      ></div>
                      <div
                        className="previewCircleFgWrapper"
                        style={{
                          width:
                            config.fgSize >= config.bgSize
                              ? config.size / 2
                              : (config.size + config.fgSize - config.bgSize) /
                                2,
                          right:
                            config.fgSize >= config.bgSize
                              ? 0
                              : config.size / 2 -
                                (config.size + config.fgSize - config.bgSize) /
                                  2,
                        }}
                      >
                        <div
                          className="previewCircleFg"
                          style={{
                            borderColor: config.fgColor,
                            borderWidth: config.fgSize,
                            width:
                              config.fgSize >= config.bgSize
                                ? config.size
                                : config.size + config.fgSize - config.bgSize,
                            height:
                              config.fgSize >= config.bgSize
                                ? config.size
                                : config.size + config.fgSize - config.bgSize,
                          }}
                        ></div>
                      </div>
                      <div className="previewText">
                        <h4 style={{ color: config.fontColor }}>Second</h4>
                        <span
                          style={{
                            fontSize: config.fontSize,
                            color: config.fontColor,
                          }}
                        >
                          0
                        </span>
                      </div>
                    </div>

                    <div
                      className="edit-timer"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setEditConfig(config);
                        setEditVisible(true);
                      }}
                    >
                      <Icon type="edit" />
                    </div>
                    <div
                      className="delete-timer"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        deleteTimer(config.id);
                      }}
                    >
                      <Icon type="delete" />
                    </div>
                  </NewRnd>
                ))}
              </div>

              {paginate &&
              JSON.stringify(paginate) !== '{}' &&
              paginate.paginatShow ? (
                <div
                  className={styles.paginatBottom}
                  style={{
                    bottom: paginate.margin.bottom,
                  }}
                >
                  <span
                    className="paginatcenter"
                    style={{
                      marginLeft: paginate.margin.left,
                      marginRight: paginate.margin.right,
                      textAlign: paginate.position.align,
                      fontFamily: paginate.fontFamily,
                      fontSize: paginate.fontSize,
                      color: paginate.color,
                      fontWeight: paginate.isBold ? 'bold' : 'normal',
                      fontStyle: paginate.isItalic ? 'italic' : 'normal',
                    }}
                  >
                    {paginate.position.bottom ? pageContent : ''}
                    {/* {paginate.position.bottom.replace('<<1>>', currentPageIndex + 1)} */}
                  </span>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
      <TemplateCardList></TemplateCardList>
      <TimerPanel visible={false} editConfig={editConfig} cancelAdd={setEditConfig}></TimerPanel>
      <ElementStyle showThumb={showThumb} />
      <GroupStyle showThumb={showThumb} />
      <SlideBar setFocus={setFocus} />

      {/* <div
        className="move-group-cover"
      > */}
        <div className="esc-tip" 
        style={{ display: bookPages.selectGroupId ? 'block' : 'none' }}>
          press <span>ESC</span> to quit
        </div>
      {/* </div> */}
    </div>
  );
};

const mapStateToProps = ({
  trans,
  bookPages,
  zoomLevel,
  ruler,
  grid,
}) => {
  let currentId = bookPages.showingPageId;
  let currentPage = bookPages.present.pages.find((item) => {
    return item.id === currentId;
  });
  return {
    bookPages: bookPages,
    zoomLevel: zoomLevel,
    trans: trans,
    id: currentPage.id,
    elements: currentPage.elements,
    templateCards: currentPage.templateCards,
    ruler: ruler,
    grid: grid,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setIsVertical: () => {
    dispatch(actIsVertical(true));
  },
  actSetPageThumb: (pageId, focus, pages) => {
    return () => {
      const workSpaceDom = document.getElementById('CurrentWorkSpace');
      domtoimage
        .toPng(workSpaceDom, {
          scale: 0.15,
          // bgcolor: 'rgba(0, 0, 0, 0)',
          style: {
            // background: 'rgba(0, 0, 0, 0)'
          },
        })
        .then((dataUrl) => {
          if (lastDataUrl !== dataUrl) {
            console.log('缩略图变化');
            dispatch(actSetPageThumb(dataUrl, pageId));
            lastDataUrl = dataUrl;
          }
        });
    };
  },
  actSetPdfThumb: (pageId, focus, pages) => {
    return () => {
      pages.forEach((item) => {
        // 找到图片
        const select = `li[data-key="${item.id}"] img`;
        if (item && item.config && item.config.color) {
          document.querySelector(select).style.background =
            item.config.color.color;
        }
      });
      const workSpaceDom = document.getElementById('CurrentWorkSpace');
      domtoimage
        .toJpeg(workSpaceDom, {
          scale: 0.8,
        })
        .then((dataUrl) => {
          if (lastDataUrl !== dataUrl) {
            dispatch(actSetPdfThumb(dataUrl, pageId));
            lastDataUrl = dataUrl;
          }
        });
    };
  },
  actSetGlobalBackgroundImage: () => {
    const backgroundDom = document.getElementById('CurrentWorkSpaceBackground');
    domtoimage
      .toJpeg(backgroundDom, {
        scale: 0.19,
        bgcolor: '#fff',
        quality: 0.8,
      })
      .then((dataUrl) => {
        if (lastGlobalBackgoundUrl !== dataUrl) {
          dispatch(actSetGlobalBackgroundImage(dataUrl));
          lastGlobalBackgoundUrl = dataUrl;
        }
      });
  },
  actionSetElementSize: (size, id) => {
    dispatch(actSetElementSize(size, id));
  },
  actSetElementPos: (pos, id) => {
    dispatch(actSetElementPos(pos, id));
  },
  actEditQuestion: (question, elementId) => {
    dispatch(actEditChoiceQuestion(question, elementId));
  },
  copyElement: (key) => {
    dispatch(copyElement(key));
  },
  deleteElement: () => {
    dispatch(deleteElement({}));
  },
  actSavePage: (bookPages, bookname, bookCode) => {
    const { present } = bookPages;
    const { userId } = JSON.parse(
      localStorage.getItem('token')
    ).loginResult.userInfoDto;
    const id =
      localStorage.getItem('book') &&
      JSON.parse(localStorage.getItem('book')).id;
    let bookid = nanoid(24);
    let data = {
      id: id ? id : bookid,
      bookName: bookname ? bookname : '',
      userId: userId,
      pages: present.pages,
      config: present.config,
      paginate: present.paginate,
      bookCode: bookCode
    };
    if (!id) {
      let data = {
        id: bookid,
        bookName: bookname,
      };
      localStorage.setItem('book', JSON.stringify(data));
    }
    dispatch({
      type: 'saveBooksAsync',
      payload: data,
    });
  },
  actEditTimer: (content, id) => {
    dispatch(actEditTimer(content, id));
  },
  deleteTimer: (id) => {
    dispatch(actDeleteTimer(id));
  },
  selectElement: (id) => {
    dispatch(actSelectElement(id));
  },
  actCancelSelectElement: () => {
    dispatch(actSelectElement(""));
  },
  actSetElementPosition: (position) => {
    dispatch(actSetElementPosition(position));
  },
  actSetGroupAni: (ani, id) => {
    dispatch(actSetGroupAni(ani, id));
  },
  actSetGroupTri: (ani, id) => {
    dispatch(actSetGroupTri(ani, id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkSpace);
