'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var reactDom = require('react-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var dialogContent = document.createElement("div");
var body = document.body;
body.appendChild(dialogContent);
var openDialog = function openDialog() {
  console.log(reactDom.render( /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, "nihao"), dialogContent));
};

var schema$2 = {
  "name": "button",
  "compId": "Button",
  "description": "按钮组件",
  "pic": "https://img12.360buyimg.com/ddimg/jfs/t1/206278/28/8822/54487/615539f5E4f4cb5ab/49773bdc89799e5c.png",
  "config": [{
    "name": "bgcColor",
    "label": "按钮颜色",
    "type": "string",
    "format": "color"
  }, {
    "name": "btnText",
    "label": "按钮文案",
    "type": "string",
    "format": "text"
  }],
  "defaultConfig": {
    "btnText": "这是一个按钮",
    "bgcColor": "#333333"
  }
};

var Button = function Button(_ref) {
  var defaultConfig = _ref.defaultConfig;
  var bgcColor = defaultConfig.bgcColor,
      btnText = defaultConfig.btnText;
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "super-btn",
    style: {
      background: "".concat(bgcColor)
    }
  }, /*#__PURE__*/React__default["default"].createElement("button", {
    onClick: function onClick() {
      openDialog();
    }
  }, btnText));
};

Button.schema = schema$2;

var schema$1 = {
  "name": "dialog",
  "compId": "Dialog",
  "description": "弹窗组件",
  "pic": "https://img11.360buyimg.com/ddimg/jfs/t1/97204/11/18195/74905/61553bb8E9ba92a0d/8d59c5db08ccd759.png",
  "config": [{
    "name": "dialogText",
    "label": "请填写弹框文案",
    "type": "string",
    "format": "text"
  }],
  "defaultConfig": {
    "dialogText": "默认弹框文案"
  }
};

/**
 * 这里的弹框状态不再由使用它的父组件控制
 * 思考：复用还是不复用？
 * 场景存在不存在弹框嵌套的问题
 * !notice 预览态
 */

var Dialog = function Dialog() {
  /** 
   * 
   */
  var handleClose = function handleClose() {};

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "super-dialog"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "outside"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "inside"
  }, /*#__PURE__*/React__default["default"].createElement("div", null, "\u8FD9\u662F\u4E00\u4E2A\u5F39\u6846"), /*#__PURE__*/React__default["default"].createElement("button", {
    onClick: handleClose
  }, "\u5173\u95ED")));
};

Dialog.schema = schema$1;

var schema = {
  "name": "image",
  "compId": "Image",
  "description": "图片组件",
  "pic": "https://img11.360buyimg.com/ddimg/jfs/t1/88856/35/18313/1750299/6156d725E08d3adea/c3a6bd820350230c.png",
  "config": [{
    "name": "src",
    "label": "请填写图片地址",
    "type": "string",
    "format": "text"
  }],
  "defaultConfig": {
    "src": "https://img11.360buyimg.com/ddimg/jfs/t1/88856/35/18313/1750299/6156d725E08d3adea/c3a6bd820350230c.png"
  }
};

var Image = function Image() {
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "super-image"
  }, /*#__PURE__*/React__default["default"].createElement("img", {
    src: "https://img11.360buyimg.com/ddimg/jfs/t1/88856/35/18313/1750299/6156d725E08d3adea/c3a6bd820350230c.png"
  }));
};

Image.schema = schema;

var getSchma = function getSchma(comp) {
  if (comp.schema) return comp.schema;
};

var schameMap = [getSchma(Button), getSchma(Dialog), getSchma(Image)];

exports.Button = Button;
exports.Dialog = Dialog;
exports.Image = Image;
exports.schameMap = schameMap;
