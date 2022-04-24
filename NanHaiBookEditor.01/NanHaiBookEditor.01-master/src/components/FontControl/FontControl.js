import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  actSetAllPagesFont,
  actSetPageFont,
  actSetPageStyle,
  actSetAllPagesStyle
} from '../../store/bookPages/actions';
import './FontControl.css';

import {
  Button,
  Select,
  Checkbox,
  InputNumber,
  Radio,
  Icon,
  Divider,
  Popover,
  Collapse,
  Tabs,
  Row,
  Col
} from 'antd';
const { Panel } = Collapse;
const { TabPane } = Tabs;
import { ChromePicker, SketchPicker } from 'react-color';
const { Option, OptGroup } = Select;
const FontControl = props => {
  const { isAll, bookPages, text } = props;

  const [conStyle, setConStyle] = useState({
    backgroundColor: null,
    padding: 0,
    borderRadius: 0,
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,1)',
    shadow: null
  });
  const [shadow, setShadow] = useState({
    h: 0,
    v: 0,
    blur: 0,
    spread: 0,
    color: 'rgba(0,0,0,0.3)',
    inset: 'outset'
  });
  useEffect(() => {
    if (shadow.h || shadow.v || shadow.blur || shadow.spread) {
      setConStyle({
        ...conStyle,
        shadow: `${shadow.h}px ${shadow.v}px ${shadow.blur}px ${
          shadow.spread
        }px ${shadow.color}${shadow.inset === 'outset' ? '' : ' inset'}`
      });
    } else {
      setConStyle({ ...conStyle, shadow: null });
    }
  }, [shadow]);
  const [chooseBgVisible, setChooseBgVisible] = useState(false);
  const [chooseBorderVisible, setChooseBorderVisible] = useState(false);
  const [shadowColor, setShadowColor] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const [fontStyle, setFontStyle] = useState({});

  useEffect(() => {
    if (isAll) {
      if (!bookPages.present.config) {
        setFontStyle({
          fontSize: 14,
          fontFamily: "'HYKaiTiJ W00 Regular'",
          color: '#000000',
          textAlign: 'left'
        });
        setConStyle({
          backgroundColor: null,
          padding: 0,
          borderRadius: 0,
          borderWidth: 0,
          borderStyle: 'solid',
          borderColor: 'rgba(0,0,0,1)',
          shadow: null
        });
        changeShadow();
        return;
      }

      setFontStyle({
        fontSize: bookPages.present.config.fontSize || 14,
        fontFamily:
          bookPages.present.config.fontFamily || "'HYKaiTiJ W00 Regular'",
        color: bookPages.present.config.fontColor || '#000000',
        textAlign: bookPages.present.config.textAlign || 'left'
      });
      let border = bookPages.present.config.border
        ? bookPages.present.config.border.split(' ')
        : ['0px', '#000000', 'solid'];

      setConStyle({
        backgroundColor: bookPages.present.config.backgroundColor,
        padding: bookPages.present.config.padding || 0,
        borderRadius: bookPages.present.config.borderRadius || 0,
        borderWidth: Number(border[0].replace('px', '')),
        borderStyle: border[2],
        borderColor: border[1],
        shadow: bookPages.present.config.shadow
      });

      changeShadow(bookPages.present.config.shadow);
    } else {
      let currentPage = bookPages.present.pages.find(item => {
        return item.id === bookPages.showingPageId;
      });

      if (!currentPage || !currentPage.config) {
        setFontStyle({
          fontSize: 14,
          fontFamily: "'HYKaiTiJ W00 Regular'",
          color: '#000000',
          textAlign: 'left'
        });
        setConStyle({
          backgroundColor: null,
          padding: 0,
          borderRadius: 0,
          borderWidth: 0,
          borderStyle: 'solid',
          borderColor: 'rgba(0,0,0,1)',
          shadow: null
        });
        changeShadow();
        return;
      }
      setFontStyle({
        fontSize: currentPage.config.fontSize || 14,
        fontFamily: currentPage.config.fontFamily || "'HYKaiTiJ W00 Regular'",
        color: currentPage.config.fontColor || '#000000',
        textAlign: currentPage.config.textAlign || 'left'
      });

      let border = currentPage.config.border
        ? currentPage.config.border.split(' ')
        : ['0px', '#000000', 'solid'];

      setConStyle({
        backgroundColor: currentPage.config.backgroundColor,
        padding: currentPage.config.padding || 0,
        borderRadius: currentPage.config.borderRadius || 0,
        borderWidth: Number(border[0].replace('px', '')),
        borderStyle: border[2],
        borderColor: border[1],
        shadow: currentPage.config.shadow
      });

      changeShadow(currentPage.config.shadow);
    }
  }, [isAll, showPanel]);

  const changeShadow = shadow => {
    shadow = shadow ? shadow.split(' ') : null;
    setShadow(
      shadow
        ? {
            h: shadow[0].replace('px', ''),
            v: shadow[1].replace('px', ''),
            blur: shadow[2].replace('px', ''),
            spread: shadow[3].replace('px', ''),
            color: shadow[4],
            inset: shadow[5] || 'outset'
          }
        : {
            h: 0,
            v: 0,
            blur: 0,
            spread: 0,
            color: 'rgba(0,0,0,0.3)',
            inset: 'outset'
          }
    );
  };
  const confirmFontStyle = () => {
    if (isAll) {
      props.setAllFont(fontStyle);
    } else {
      props.setPageFont(fontStyle);
    }
  };

  const resetFontStyle = () => {
    let newFontStyle = {
      fontSize: 14,
      fontFamily: "'HYKaiTiJ W00 Regular'",
      color: '#000000',
      textAlign: 'left'
    };
    setFontStyle(newFontStyle);
    if (isAll) {
      props.setAllFont(newFontStyle);
    } else {
      props.setPageFont(newFontStyle);
    }
  };

  const confirmPageStyle = () => {
    let pageStyle = {
      backgroundColor: conStyle.backgroundColor,
      padding: conStyle.padding,
      borderRadius: conStyle.borderRadius,
      border: `${conStyle.borderWidth}px ${conStyle.borderColor} ${conStyle.borderStyle}`,
      shadow: conStyle.shadow
    };
    if (isAll) {
      props.setAllStyle(pageStyle);
    } else {
      props.setPageStyle(pageStyle);
    }
  };

  const resetPageStyle = () => {
    setConStyle({
      backgroundColor: null,
      padding: 0,
      borderRadius: 0,
      borderWidth: 0,
      borderStyle: 'solid',
      borderColor: 'rgba(0,0,0,1)',
      shadow: null
    });
    if (isAll) {
      props.setAllStyle({
        backgroundColor: null,
        padding: null,
        borderRadius: null,
        border: null,
        shadow: null
      });
    } else {
      props.setPageStyle({
        backgroundColor: null,
        padding: null,
        borderRadius: null,
        border: null,
        shadow: null
      });
    }
  };

  return (
    <div className="stdMenuItemOuter">
      <div className="stdMenuItem">
        <div
          className="stdMenuItemButton"
          onClick={() => {
            setShowPanel(!showPanel);
          }}
        >
          <span className="stdMenuIcon ThemeIcon">
            <span
              className="ThemeIconChild"
              style={{
                backgroundColor: '#2851c1',
                color: '#FFF',
                lineHeight: '36px'
              }}
            >
              <Icon type="font-size" />
            </span>
          </span>
          <span style={{ position: 'relative', top: '5px' }}>{text}</span>
        </div>
      </div>

      <div
        style={{ display: showPanel ? 'block' : 'none' }}
        className="font-control-container"
      >
        <div
          className="cancleFontControl"
          onClick={() => {
            setShowPanel(false);
          }}
        >
          <Icon type="close" />
        </div>

        <Tabs defaultActiveKey="1">
          <TabPane tab="text" key="1">
            <Row gutter={8}>
              <Col span={12}>
                {' '}
                <div className="font-control-list">
                  <span>{props.trans.FontControl.font}</span>
                  <Select
                    value={fontStyle.fontFamily}
                    onChange={value =>
                      setFontStyle({ ...fontStyle, fontFamily: value })
                    }
                    style={{ width: 136 }}
                  >
                    <Option value="'HYKaiTiJ W00 Regular'">
                      <span style={{ fontFamily: "'HYKaiTiJ W00 Regular'" }}>
                        {props.trans.FontControl.default}
                      </span>
                    </Option>
                  </Select>
                </div>
                <div className="font-control-list">
                  <span>{props.trans.FontControl.color}</span>
                  <Popover
                    overlayClassName="element-choose-color"
                    trigger="click"
                    visible={pickerVisible}
                    onVisibleChange={value => setPickerVisible(value)}
                    content={
                      <div>
                         <SketchPicker
                          color={
                            fontStyle.color || 'rgba(255,255,255,1)'
                          }
                          onChange={color => {
                            const rgba = color.rgb;
                            const rgbaStr = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;                           
                            setFontStyle({ ...fontStyle, color: rgbaStr });
                          }}
                        />
                      </div>
                    }
                  >
                    <Button
                      style={{
                        width: 136,
                        color: fontStyle.color || 'rgba(0,0,0,1)'
                      }}
                      onClick={() => setPickerVisible(true)}
                    >
                      {fontStyle.color || props.trans.FontControl.colorHolder}
                    </Button>
                  </Popover>
                </div>
              </Col>

              <Col span={12}>
                <div className="font-control-list">
                  <span>{props.trans.FontControl.size}</span>
                  <InputNumber
                    style={{ width: 114 }}
                    min={0}
                    max={128}
                    value={fontStyle.fontSize}
                    onChange={value =>
                      setFontStyle({ ...fontStyle, fontSize: value })
                    }
                  />
                  <strong style={{ marginLeft: 6 }}>px</strong>
                </div>
                <div className="font-control-list">
                  <span>{props.trans.FontControl.align}</span>
                  <Radio.Group
                    value={fontStyle.textAlign}
                    onChange={e =>
                      setFontStyle({ ...fontStyle, textAlign: e.target.value })
                    }
                  >
                    <Radio.Button value="left">
                      <Icon type="align-left" />
                    </Radio.Button>
                    <Radio.Button value="center">
                      <Icon type="align-center" />
                    </Radio.Button>
                    <Radio.Button value="right">
                      <Icon type="align-right" />
                    </Radio.Button>
                  </Radio.Group>
                </div>
              </Col>
            </Row>

            <Button
              style={{
                marginTop: 16,
                width: 'calc(50% - 8px)',
                marginRight: 16
              }}
              type="danger"
              ghost
              onClick={resetFontStyle}
            >
              {props.trans.FontControl.reset}
            </Button>

            <Button
              style={{ marginTop: 16, width: 'calc(50% - 8px)' }}
              type="primary"
              onClick={confirmFontStyle}
            >
              {props.trans.FontControl.confirm}
            </Button>
          </TabPane>

          <TabPane tab="container" key="2">
            <div
              className="style-example"
              style={{
                borderWidth: conStyle.borderWidth,
                borderColor: conStyle.borderColor,
                borderStyle: conStyle.borderStyle,
                background: conStyle.backgroundColor,
                padding: conStyle.padding,
                borderRadius: conStyle.borderRadius,
                boxShadow: conStyle.shadow || 'none'
              }}
            ></div>
            <Row gutter={8}>
              <Col span={12}>
                <div className="font-control-list">
                  <span>bg</span>
                  <Popover
                    overlayClassName="element-choose-color"
                    trigger="click"
                    visible={chooseBgVisible}
                    onVisibleChange={value => setChooseBgVisible(value)}
                    content={
                      <div>
                        <SketchPicker
                          color={
                            conStyle.backgroundColor || 'rgba(255,255,255,1)'
                          }
                          onChange={color => {
                            const rgba = color.rgb;
                            const rgbaStr = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
                            setConStyle({
                              ...conStyle,
                              backgroundColor: rgbaStr
                            });
                          }}
                        />
                        <Button
                          type="danger"
                          ghost={true}
                          onClick={() => {
                            setConStyle({
                              ...conStyle,
                              backgroundColor: null
                            });
                          }}
                          style={{ width: '100%', marginTop: 8 }}
                        >
                          Clear
                        </Button>
                      </div>
                    }
                  >
                    <Button
                      style={{
                        width: 136,
                        color: conStyle.backgroundColor || '#8e8e8e'
                      }}
                      onClick={() => setChooseBgVisible(true)}
                    >
                      {conStyle.backgroundColor ||
                        props.trans.FontControl.colorHolder}
                    </Button>
                  </Popover>
                </div>
                <div className="font-control-list">
                  <span>边宽</span>
                  <InputNumber
                    style={{ width: 114 }}
                    min={0}
                    max={128}
                    value={conStyle.borderWidth}
                    onChange={value => {
                      setConStyle({ ...conStyle, borderWidth: value });
                    }}
                  />
                  <strong style={{ marginLeft: 6 }}>px</strong>
                </div>

                <div className="font-control-list">
                  <span>样式</span>
                  <Select
                    value={conStyle.borderStyle}
                    onChange={value =>
                      setConStyle({ ...conStyle, borderStyle: value })
                    }
                    style={{ width: 136 }}
                  >
                    <Select.Option value="solid">solid</Select.Option>
                    <Select.Option value="dashed">dashed</Select.Option>
                    <Select.Option value="dotted">dotted</Select.Option>
                    <Select.Option value="double">double</Select.Option>
                  </Select>
                </div>

                <div className="font-control-list">
                  <span>{props.trans.FontControl.color}</span>
                  <Popover
                    overlayClassName="element-choose-color"
                    trigger="click"
                    visible={chooseBorderVisible}
                    onVisibleChange={value => setChooseBorderVisible(value)}
                    content={
                      <div>
                        <SketchPicker
                          color={conStyle.borderColor || 'rgba(0,0,0,1)'}
                          onChange={color => {
                            const rgba = color.rgb;
                            const rgbaStr = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;

                            setConStyle({ ...conStyle, borderColor: rgbaStr });
                          }}
                        />
                      </div>
                    }
                  >
                    <Button
                      style={{
                        width: 136,
                        color: conStyle.borderColor || 'rgba(0,0,0,1)'
                      }}
                      onClick={() => setChooseBorderVisible(true)}
                    >
                      {conStyle.borderColor ||
                        props.trans.FontControl.colorHolder}
                    </Button>
                  </Popover>
                </div>

                <div className="font-control-list">
                  <span>圆角</span>
                  <InputNumber
                    style={{ width: 114 }}
                    min={0}
                    max={128}
                    value={conStyle.borderRadius}
                    onChange={value => {
                      setConStyle({ ...conStyle, borderRadius: value });
                    }}
                  />
                  <strong style={{ marginLeft: 6 }}>px</strong>
                </div>

                <div className="font-control-list">
                  <span>边距</span>
                  <InputNumber
                    style={{ width: 114 }}
                    min={0}
                    max={128}
                    value={conStyle.padding}
                    onChange={value => {
                      setConStyle({ ...conStyle, padding: value });
                    }}
                  />
                  <strong style={{ marginLeft: 6 }}>px</strong>
                </div>
              </Col>
              <Col span={12}>
                <div className="font-control-list">
                  <span>h-shadow</span>
                  <InputNumber
                    style={{ width: 136 }}
                    value={shadow.h}
                    onChange={value => setShadow({ ...shadow, h: value })}
                  />
                </div>

                <div className="font-control-list">
                  <span>v-shadow</span>
                  <InputNumber
                    style={{ width: 136 }}
                    value={shadow.v}
                    onChange={value => setShadow({ ...shadow, v: value })}
                  />
                </div>

                <div className="font-control-list">
                  <span>blur</span>
                  <InputNumber
                    style={{ width: 136 }}
                    value={shadow.blur}
                    onChange={value => setShadow({ ...shadow, blur: value })}
                  />
                </div>

                <div className="font-control-list">
                  <span>spread</span>
                  <InputNumber
                    style={{ width: 136 }}
                    value={shadow.spread}
                    onChange={value => setShadow({ ...shadow, spread: value })}
                  />
                </div>

                <div className="font-control-list">
                  <span>color</span>
                  <Popover
                    overlayClassName="element-choose-color"
                    trigger="click"
                    visible={shadowColor}
                    onVisibleChange={value => setShadowColor(value)}
                    content={
                      <SketchPicker
                        color={shadow.color}
                        onChange={color => {
                          const rgba = color.rgb;
                          const rgbaStr = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
                          setShadow({ ...shadow, color: rgbaStr });
                        }}
                      />
                    }
                  >
                    <Button
                      style={{
                        width: 136,
                        color: setShadow.color || '#8e8e8e'
                      }}
                      onClick={() => setShadowColor(true)}
                    >
                      {shadow.color || props.trans.FontControl.colorHolder}
                    </Button>
                  </Popover>
                </div>

                <div style={{ marginTop: 16 }}>
                  <Radio.Group
                    buttonStyle="solid"
                    value={shadow.inset}
                    style={{ marginLeft: 70 }}
                    onChange={e =>
                      setShadow({ ...shadow, inset: e.target.value })
                    }
                  >
                    <Radio.Button value="outset">outset</Radio.Button>
                    <Radio.Button value="inset">inset</Radio.Button>
                  </Radio.Group>
                </div>
              </Col>
            </Row>
            <Button
              style={{
                marginTop: 16,
                width: 'calc(50% - 8px)',
                marginRight: 16
              }}
              type="danger"
              ghost
              onClick={resetPageStyle}
            >
              {props.trans.FontControl.reset}
            </Button>
            <Button
              style={{ marginTop: 16, width: 'calc(50% - 8px)' }}
              type="primary"
              onClick={confirmPageStyle}
            >
              {props.trans.FontControl.confirm}
            </Button>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
const mapStateToProps = ({ trans, bookPages }) => ({
  trans,
  bookPages
});

const mapDispatchToProps = dispatch => ({
  setAllFont: fontStyle => {
    dispatch(actSetAllPagesFont(fontStyle));
  },

  setPageFont: fontStyle => {
    dispatch(actSetPageFont(fontStyle));
  },

  setAllStyle: pageStyle => {
    dispatch(actSetAllPagesStyle(pageStyle));
  },

  setPageStyle: pageStyle => {
    dispatch(actSetPageStyle(pageStyle));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FontControl);
