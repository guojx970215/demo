import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './ElementStyle.css';
import {
  InputNumber,
  Icon,
  Select,
  Divider,
  Popover,
  Input,
  Radio,
  Button,
  Tooltip,
  message,
} from 'antd';
import { SketchPicker } from 'react-color';

import {
  actChangeElementBackground,
  actChangeElementConfig,
  actSetElementContent,
  actSetElementAni,
  actSetElementTrigger,
} from '../../store/bookPages/actions';
import {
  actSetCopyStyle,
  actSetCopyAni,
  actSetCopyTri,
} from '../../store/ui/ui';
import EditSvg from '../RndContainer/EditSvg';
const $ = window.$;

const ElementStyle = (props) => {
  const [config, setConfig] = useState({});
  const [scale, setScale] = useState(false);
  const [background, setBackground] = useState(null);
  const [chooseBgVisible, setChooseBgVisible] = useState(false);
  const [borderVisible, setBorderVisible] = useState(false);
  const [shadowVisible, setShadowVisible] = useState(false);
  const [shadowGen, setShadowGen] = useState({});
  const [shadowColor, setShadowColor] = useState(false);
  const [textAlign, setTextAlign] = useState(null);

  const [eidtSvgVisible, setEidtSvgVisible] = useState(false);

  const getBgColor = (bg) => {
    if (!bg) return false;
    const tmp = $('<div style="background:' + bg + '"></div>');
    let bgColor = tmp.css('background-color');
    return bgColor === 'transparent' ? false : bgColor;
  };

  const element = useRef();

  useEffect(() => {
    const bookPages = props.bookPages;

    if (
      !bookPages.selectElementId ||
      bookPages.selectElementId.includes('group:')
    ) {
      setConfig({});
      setBackground(null);
      setScale(false);
      setTextAlign(null);
      return;
    }

    let currentPage = bookPages.present.pages.find(
      (value) => value.id === bookPages.showingPageId
    );

    if (currentPage.elements && currentPage.elements.length) {
      let currentElement = currentPage.elements.find(
        (v) => v.id === bookPages.selectElementId
      );
      if (currentElement) {
        element.current = currentElement;

        if (currentElement.type === 'TextBox') {
          // 如果为文本框显示对齐设置
          const divDom = document.createElement('div');
          divDom.innerHTML = currentElement.content[0].value;

          const styleWrappperDom = divDom.getElementsByClassName(
            'text-style-wrapper'
          );
          if (styleWrappperDom[0]) {
            if (styleWrappperDom[0].style.textAlign) {
              setTextAlign(styleWrappperDom[0].style.textAlign);
            } else {
              setTextAlign('left');
            }
          } else {
            setTextAlign('left');
          }
        }
        setConfig(currentElement.config);

        setBackground(currentElement.content[0].background);
        let shadow = currentElement.config.shadow
          ? currentElement.config.shadow.split(' ')
          : '';
        setShadowGen(
          shadow
            ? {
                h: shadow[0].replace('px', ''),
                v: shadow[1].replace('px', ''),
                blur: shadow[2].replace('px', ''),
                spread: shadow[3].replace('px', ''),
                color: shadow[4],
                inset: shadow[5] || 'outset',
              }
            : {
                h: 0,
                v: 0,
                blur: 0,
                spread: 0,
                color: 'rgba(0,0,0,0.3)',
                inset: 'outset',
              }
        );
      } else {
        setConfig({});
        setBackground(null);
        setScale(false);
        setTextAlign(null);
      }
    } else {
      setConfig({});
      setBackground(null);
      setScale(false);
      setTextAlign(null);
    }
  }, [
    props.bookPages.selectElementId,
    props.bookPages.showingPageId,
    props.bookPages.present,
  ]);

  useEffect(() => {
    if (!config.x && config.x !== 0) {
      setBorderVisible(false);
      setShadowColor(false);
      setChooseBgVisible(false);
    }
  }, [config]);

  const changeShadow = (shadowConfig) => {
    setShadowGen(shadowConfig);

    let shadow = `${shadowConfig.h}px ${shadowConfig.v}px ${
      shadowConfig.blur
    }px ${shadowConfig.spread}px ${shadowConfig.color}${
      shadowConfig.inset === 'inset' ? ' inset' : ''
    }`;

    props.actChangeElementConfig({ ...config, shadow });
  };

  const setElementTextAlign = (value) => {
    setTextAlign(value);

    const bookPages = props.bookPages;

    let currentPage = bookPages.present.pages.find(
      (value) => value.id === bookPages.showingPageId
    );

    if (currentPage.elements && currentPage.elements.length) {
      let currentElement = currentPage.elements.find(
        (v) => v.id === bookPages.selectElementId
      );

      if (currentElement && currentElement.type === 'TextBox') {
        let newContent = [...currentElement.content];

        const divDom = document.createElement('div');
        divDom.innerHTML = currentElement.content[0].value.replace(
          /text-align:.*?[;"']/g,
          ''
        );

        const styleWrappperDom = divDom.getElementsByClassName(
          'text-style-wrapper'
        );

        if (styleWrappperDom[0]) {
          styleWrappperDom[0].style.textAlign = value;
          newContent[0].value = divDom.innerHTML;
        } else {
          divDom.setAttribute('class', 'text-style-wrapper');
          divDom.style.textAlign = value;
          newContent[0].value = divDom.outerHTML;
        }

        props.actSetElementContent(newContent, currentElement.id);
      }
    }
  };

  const copyAni = () => {
    const config = element.current.config || {};

    props.actSetCopyAni({
      rotateDeg: config.rotateDeg,
      aniClassName: config.aniClassName,
      aniTimes: config.anitimes,
      aniDelay: config.anidelay,
      aniDuration: config.duration,
      aniLoop: config.aniloop,
      showState: config.showState,
      hideDelay: config.hideDelay,
      aniAudioName: config.aniAudioName,
      aniAudioUrl: config.aniAudioUrl,
    });

    props.actSetCopyTri({
      trigger: config.trigger,
      triggerAniTimes: config.triggerAniTimes,
      triggerAniDelay: config.triggerAniDelay,
      triggerAniLoop: config.triggerAniLoop,
      triggerAniName: config.triggerAniName,
      triggerAniDuration: config.triggerAniDuration,
      triggerAudio: config.triggerAudio,
      triggerMusicName: config.triggerMusicName,
      triggerMusicTimes: config.triggerMusicTimes,
      triggerMusicLoop: config.triggerMusicLoop,
      triggerElId: config.triggerElId,
      triggerHideElId: config.triggerHideElId,
      triggerHideAni: config.triggerHideAni,
      triggerHideDelay: config.triggerHideDelay,
      bringToFront: config.bringToFront,
      bringToBack: config.bringToBack,
      originalId: element.current.id,
      originalGroupId: element.current.config?.groupName,
      showingPageId: props.bookPages.showingPageId,
    });

    message.success('Copy animation successed!');
  };

  const pasteAni = () => {
    if (props.ui.copyAni) {
      const elementId = element.current.id;
      props.actSetElementAni({ ...props.ui.copyAni }, elementId);

      const config = { ...props.ui.copyTri };
      delete config.showingPageId;
      delete config.originalId;
      delete config.originalGroupId;
      
      const originalId = props.ui.copyTri.originalId;
      const isSamePage =
        props.ui.copyTri.showingPageId === props.bookPages.showingPageId;

      // 被触发元素是self，复制后也是self。
      // 被触发元素和目标不是同一个page不复制。
      if (originalId === config.triggerElId) {
        config.triggerElId = elementId;
      } else if (!isSamePage) {
        delete config.triggerElId;
      }

      if (originalId === config.triggerHideElId) {
        config.triggerHideElId = elementId;
      } else if (!isSamePage) {
        delete config.triggerHideElId;
      }

      props.actSetElementTrigger(config, elementId);
      message.success('Paste animation successed!');
    }
  };

  return (
    <div
      className="element-style-panel"
      style={props.showThumb ? {} : { transform: 'translateX(0)' }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      {element.current && element.current.type === 'ImageBox' && (
        <EditSvg
          trans={props.trans}
          content={element.current}
          visible={eidtSvgVisible}
          onCancel={() => setEidtSvgVisible(false)}
          onOk={(content, elementId) =>
            props.actSetElementContent(content, elementId)
          }
        />
      )}
      <div
        style={{
          display:
            config.x !== null && config.x !== undefined ? 'block' : 'none',
        }}
      >
        <span>x:</span>

        <InputNumber
          precision={0}
          style={{ width: 60 }}
          value={config.x}
          onChange={(value) => {
            value = value || 0;
            let newConfig = { ...config, x: parseInt(value) };
            setConfig(newConfig);
            props.actChangeElementConfig(newConfig);
          }}
        />

        <span>y:</span>

        <InputNumber
          precision={0}
          style={{ width: 60 }}
          value={config.y}
          onChange={(value) => {
            value = value || 0;
            let newConfig = { ...config, y: parseInt(value) };
            setConfig(newConfig);
            props.actChangeElementConfig(newConfig);
          }}
        />

        <span>w:</span>

        <InputNumber
          precision={0}
          style={{ width: 60 }}
          value={config.width}
          onChange={(value) => {
            value = value || 1;
            let width = parseInt(value);
            let height = config.height;
            if (scale) {
              height = (config.height / config.width) * width;
              height = Math.round(height);
            }
            let newConfig = { ...config, width, height };
            setConfig(newConfig);
            props.actChangeElementConfig(newConfig);
          }}
        />

        <div
          className={
            scale
              ? 'element-scale-container active-scale'
              : 'element-scale-container'
          }
          onClick={() => setScale(!scale)}
        >
          <Icon type="link" />
        </div>

        <span>h:</span>

        <InputNumber
          precision={0}
          style={{ width: 60 }}
          value={config.height}
          onChange={(value) => {
            value = value || 1;
            let height = parseInt(value);
            let width = config.width;
            if (scale) {
              width = (config.width / config.height) * height;
              width = Math.round(width);
            }
            let newConfig = { ...config, height, width };

            setConfig(newConfig);
            props.actChangeElementConfig(newConfig);
          }}
        />

        <Divider type="vertical" />

        <Popover
          overlayClassName="element-choose-color"
          trigger="click"
          visible={chooseBgVisible}
          onVisibleChange={(value) => setChooseBgVisible(value)}
          content={
            <div>
              <SketchPicker
                color={getBgColor(background) || 'rgba(255,255,255,1)'}
                onChange={(color) => {
                  const rgba = color.rgb;
                  const rgbaStr = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;

                  let newBackground = rgbaStr;

                  if (background) {
                    const tmp = $(
                      '<div style="background:' + background + '"></div>'
                    );
                    tmp.css('background-color', rgbaStr);

                    newBackground = tmp.css('background');
                  }
                  setBackground(newBackground);

                  props.actChangeElementBackground(newBackground);
                }}
              />
              <Button
                type="danger"
                ghost={true}
                onClick={() => {
                  const tmp = $(
                    '<div style="background:' + background + '"></div>'
                  );
                  tmp.css('background-color', 'transparent');

                  let newBackground = tmp.css('background');

                  props.actChangeElementBackground(newBackground);
                  setBackground(newBackground);
                }}
                style={{ width: '100%', marginTop: 8 }}
              >
                Clear
              </Button>
            </div>
          }
        >
          <Tooltip title="Set background color" placement="top">
            <div
              className="element-backgroud-color"
              onClick={() => setChooseBgVisible(true)}
            >
              <div
                className="color-cube"
                style={{ backgroundColor: getBgColor(background) || '#ffffff' }}
              ></div>
              <Icon type="caret-down" className="color-cube-arrow" />
            </div>
          </Tooltip>
        </Popover>

        <Popover
          overlayClassName="element-choose-color"
          trigger="click"
          visible={shadowVisible}
          onVisibleChange={(value) => setShadowVisible(value)}
          content={
            <div className="shadow-input-box">
              {/* <span style={{ display: 'inline-block', width: 65 }}>code</span>
              <Input
                style={{ width: 'calc(100% - 65px)' }}
                value={config.shadow}
                onChange={value => {
                  setConfig({ ...config, shadow: value.target.value });
                  props.actChangeElementConfig({
                    ...config,
                    shadow: value.target.value
                  });
                }}
                placeholder="h-shadow v-shadow blur spread color inset;"
              />
              <Divider orientation="left">Generate Code</Divider> */}

              <div style={{ marginBottom: 8 }}>
                <span style={{ display: 'inline-block', width: 65 }}>
                  h-shadow
                </span>
                <InputNumber
                  style={{ width: 'calc(100% - 65px)' }}
                  value={shadowGen.h}
                  onChange={(value) => changeShadow({ ...shadowGen, h: value })}
                />
              </div>

              <div style={{ marginBottom: 8 }}>
                <span style={{ display: 'inline-block', width: 65 }}>
                  v-shadow
                </span>
                <InputNumber
                  style={{ width: 'calc(100% - 65px)' }}
                  value={shadowGen.v}
                  onChange={(value) => changeShadow({ ...shadowGen, v: value })}
                />
              </div>

              <div style={{ marginBottom: 8 }}>
                <span style={{ display: 'inline-block', width: 65 }}>blur</span>
                <InputNumber
                  style={{ width: 'calc(100% - 65px)' }}
                  value={shadowGen.blur}
                  onChange={(value) =>
                    changeShadow({ ...shadowGen, blur: value })
                  }
                />
              </div>

              <div style={{ marginBottom: 8 }}>
                <span style={{ display: 'inline-block', width: 65 }}>
                  spread
                </span>
                <InputNumber
                  style={{ width: 'calc(100% - 65px)' }}
                  value={shadowGen.spread}
                  onChange={(value) =>
                    changeShadow({ ...shadowGen, spread: value })
                  }
                />
              </div>

              <div style={{ marginBottom: 8 }}>
                <Popover
                  overlayClassName="element-choose-color"
                  trigger="click"
                  visible={shadowColor}
                  onVisibleChange={(value) => setShadowColor(value)}
                  content={
                    <SketchPicker
                      color={shadowGen.color}
                      onChange={(color) => {
                        const rgba = color.rgb;
                        const rgbaStr = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
                        changeShadow({ ...shadowGen, color: rgbaStr });
                      }}
                    />
                  }
                >
                  <span style={{ display: 'inline-block', width: 65 }}>
                    color
                  </span>
                  <span
                    className="shadowGen-color-box"
                    style={{
                      backgroundColor: shadowGen.color,
                      width: 'calc(100% - 65px)',
                    }}
                  >
                    {shadowGen.color}
                  </span>
                </Popover>
              </div>

              <div style={{ marginBottom: 8 }}>
                <Radio.Group
                  buttonStyle="solid"
                  value={shadowGen.inset}
                  style={{ marginLeft: 65 }}
                  onChange={(e) =>
                    changeShadow({ ...shadowGen, inset: e.target.value })
                  }
                >
                  <Radio.Button value="outset">outset</Radio.Button>
                  <Radio.Button value="inset">inset</Radio.Button>
                </Radio.Group>
              </div>

              <Button
                type="danger"
                ghost={true}
                onClick={() => {
                  let shadow = null;
                  props.actChangeElementConfig({ ...config, shadow });
                }}
                style={{ width: '100%', marginTop: 8 }}
              >
                Clear
              </Button>
            </div>
          }
          placement="bottom"
        >
          <div
            className="element-shadow"
            onClick={() => setShadowVisible(true)}
          >
            <div
              className="color-cube"
              style={config.shadow ? { boxShadow: config.shadow } : {}}
            ></div>
            <Icon type="caret-down" className="color-cube-arrow" />
          </div>
        </Popover>

        <Divider type="vertical" />

        <span style={{ marginLeft: 0 }}>边宽:</span>

        <InputNumber
          precision={0}
          style={{ width: 60 }}
          value={config.border ? parseInt(config.border.split(' ')[0]) : 0}
          onChange={(value) => {
            value = parseInt(value) || 0;

            let border;
            if (config.border) {
              let borderArray = config.border.split(' ');
              borderArray[0] = value + 'px';
              border = borderArray.join(' ');
            } else {
              border = `${value}px rgba(0,0,0,1) solid`;
            }
            setConfig({ ...config, border });
            props.actChangeElementConfig({ ...config, border });
          }}
        />

        <span>样式:</span>

        <Select
          style={{ width: 80 }}
          value={config.border ? config.border.split(' ')[2] : 'solid'}
          onChange={(value) => {
            let border;
            if (config.border) {
              let borderArray = config.border.split(' ');
              borderArray[2] = value;
              border = borderArray.join(' ');
            } else {
              border = `0px rgba(0,0,0,1) ${value}`;
            }
            setConfig({ ...config, border });
            props.actChangeElementConfig({ ...config, border });
          }}
        >
          <Select.Option value="solid">solid</Select.Option>
          <Select.Option value="dashed">dashed</Select.Option>
          <Select.Option value="dotted">dotted</Select.Option>
          <Select.Option value="double">double</Select.Option>
        </Select>

        <Popover
          overlayClassName="element-choose-color"
          trigger="click"
          visible={borderVisible}
          onVisibleChange={(value) => setBorderVisible(value)}
          content={
            <div>
              <SketchPicker
                color={
                  config.border ? config.border.split(' ')[1] : 'rgba(0,0,0,1)'
                }
                onChange={(color) => {
                  const rgba = color.rgb;
                  const rgbaStr = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
                  let border = `0px ${rgbaStr} solid`;
                  if (config.border) {
                    let borderArray = config.border.split(' ');
                    borderArray[1] = rgbaStr;
                    border = borderArray.join(' ');
                  }
                  setConfig({ ...config, border });
                  props.actChangeElementConfig({ ...config, border });
                }}
              />
              <Button
                type="danger"
                ghost={true}
                onClick={() => {
                  props.actChangeElementConfig({ ...config, border: null });
                  setConfig({ ...config, border: null });
                }}
                style={{ width: '100%', marginTop: 8 }}
              >
                Clear
              </Button>
            </div>
          }
        >
          <div className="element-backgroud-color" style={{ marginLeft: 16 }}>
            <div
              className="color-cube"
              style={{
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: config.border
                  ? config.border.split(' ')[1]
                  : '#000000',
              }}
            ></div>
            <Icon type="caret-down" className="color-cube-arrow" />
          </div>
        </Popover>

        <span>圆角:</span>

        <InputNumber
          precision={0}
          style={{ width: 60 }}
          value={config.borderRadius}
          onChange={(value) => {
            value = parseInt(value) || 0;
            let newConfig = { ...config, borderRadius: value };
            setConfig(newConfig);
            props.actChangeElementConfig(newConfig);
          }}
        />

        <Divider type="vertical" />

        <span style={{ marginLeft: 0 }}>边距:</span>

        <InputNumber
          precision={0}
          style={{ width: 60 }}
          value={config.padding}
          onChange={(value) => {
            value = parseInt(value) || 0;
            let newConfig = { ...config, padding: value };
            setConfig(newConfig);
            props.actChangeElementConfig(newConfig);
          }}
        />
        <Divider type="vertical" />

        {element.current && element.current.type === 'TextBox' && (
          <span
            className={`element-text-align${
              textAlign === 'left' ? ' element-text-align-selected' : ''
            }`}
            onClick={() => setElementTextAlign('left')}
            style={{ display: textAlign ? 'inline-block' : 'none' }}
          >
            <Icon type="align-left" />
          </span>
        )}

        {element.current && element.current.type === 'TextBox' && (
          <span
            className={`element-text-align${
              textAlign === 'center' ? ' element-text-align-selected' : ''
            }`}
            onClick={() => setElementTextAlign('center')}
            style={{ display: textAlign ? 'inline-block' : 'none' }}
          >
            <Icon type="align-center" />
          </span>
        )}

        {element.current && element.current.type === 'TextBox' && (
          <span
            className={`element-text-align${
              textAlign === 'right' ? ' element-text-align-selected' : ''
            }`}
            onClick={() => setElementTextAlign('right')}
            style={{ display: textAlign ? 'inline-block' : 'none' }}
          >
            <Icon type="align-right" />
          </span>
        )}

        <Divider type="vertical" />

        <Icon
          type="copy"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            props.actSetCopyStyle({
              background,
              border: config.border,
              shadow: config.shadow,
              borderRadius: config.borderRadius,
              padding: config.padding,
            });

            message.success('Copy style successed!');
          }}
        />

        <Icon
          type="diff"
          style={{
            cursor: props.ui.copyStyle ? 'pointer' : 'not-allowed',
            marginLeft: 8,
            color: props.ui.copyStyle ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.3)',
          }}
          onClick={() => {
            if (props.ui.copyStyle) {
              let pasteStyle = { ...props.ui.copyStyle };
              props.actChangeElementBackground(pasteStyle.background);
              setBackground(pasteStyle.background);
              delete pasteStyle.background;

              props.actChangeElementConfig({ ...config, ...pasteStyle });
              message.success('Paste style successed!');
            }
          }}
        />

        {element.current && element.current.type === 'ImageBox' && (
          <Icon
            type="picture"
            style={{
              cursor: 'pointer',
              marginLeft: 8,
              color: 'rgba(0,0,0,0.65)',
            }}
            onClick={() => setEidtSvgVisible(true)}
          />
        )}

        <Divider type="vertical" />

        <span>ani: </span>

        <Icon type="copy" style={{ cursor: 'pointer' }} onClick={copyAni} />

        <Icon
          type="diff"
          style={{
            cursor: props.ui.copyAni ? 'pointer' : 'not-allowed',
            marginLeft: 8,
            color: props.ui.copyAni ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.3)',
          }}
          onClick={pasteAni}
        />
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actChangeElementBackground: (background) => {
    dispatch(actChangeElementBackground(background));
  },
  actChangeElementConfig: (element) => {
    dispatch(actChangeElementConfig(element));
  },
  actSetCopyStyle: (style) => {
    dispatch(actSetCopyStyle(style));
  },
  actSetElementContent: (content, id) => {
    dispatch(actSetElementContent(content, id));
  },
  actSetCopyAni: (ani) => {
    dispatch(actSetCopyAni(ani));
  },
  actSetCopyTri: (tri) => {
    dispatch(actSetCopyTri(tri));
  },
  actSetElementAni: (ani, id) => {
    dispatch(actSetElementAni(ani, id));
  },
  actSetElementTrigger: (ani, id) => {
    dispatch(actSetElementTrigger(ani, id));
  },
});

const mapStateToProps = ({ trans, bookPages, ui }) => ({
  trans,
  bookPages,
  ui,
});

export default connect(mapStateToProps, mapDispatchToProps)(ElementStyle);
