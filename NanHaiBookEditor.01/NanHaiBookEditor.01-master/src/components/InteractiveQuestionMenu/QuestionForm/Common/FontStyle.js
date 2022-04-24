import React, { useState, useEffect } from 'react';
import { Icon, Select, InputNumber, Button, Tooltip, Tag } from 'antd';

import { SketchPicker } from 'react-color';

export const LintHeight = (props) => {
  const { value, onChange, trans } = props;

  return (
    <div className="question-style-list">
      <span><Icon type="line-height" /> {trans.FontControl.lineHeight} : </span>
      <Select value={value} onChange={onChange} style={{ width: 80 }}>
        <Select.Option value="1em">1</Select.Option>
        <Select.Option value="1.25em">1.25</Select.Option>
        <Select.Option value="1.5em">1.5</Select.Option>
        <Select.Option value="1.75em">1.75</Select.Option>
        <Select.Option value="2em">2</Select.Option>
        <Select.Option value="3em">3</Select.Option>
        <Select.Option value="4em">4</Select.Option>
      </Select>
    </div>
  );
};

export const FontSize = (props) => {
  const { value, onChange, trans } = props;

  return (
    <div className="question-style-list">
      <span><Icon type="font-size" /> {trans.FontControl.size} : </span>
      <InputNumber
        min={0}
        max={128}
        value={value}
        onChange={onChange}
        style={{ width: 80 }}
      />
    </div>
  );
};

export const ColorPicker = (props) => {
  const { value, onChange, visible, onCancel } = props;

  const setColor = (color) => {
    const rgba = color.rgb;
    const rgbaStr = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    onChange(rgbaStr);
  };

  useEffect(() => {
    if (visible) {
      window.addEventListener("click", onCancel, {once: true});
    }
  }, [visible])

  const stopCancel = e => {
    e.preventDefault(); 
    e.stopPropagation();
  }

  return (
    <div className="stem-color-picker" onClick={stopCancel} style={{ display: visible ? 'block' : 'none' }}>
      <SketchPicker color={value} onChange={setColor} />
    </div>
  );
};

export const FontColor = (props) => {
  const { value, onChange, trans } = props;
  const [pickerVisible, setPickerVisible] = useState(false);

  return (
    <div className="question-style-list">
      <div
        onClick={(e) => setPickerVisible(true)}
        style={{
          cursor: 'pointer',
          color: value,
        }}
      >
        <Icon type="font-colors" />
        <span>{trans.FontControl.color}</span>
      </div>
      
        <ColorPicker
          value={value}
          onChange={onChange}
          visible={pickerVisible}
          onCancel={(e) => setPickerVisible(false)}
        ></ColorPicker>
    </div>
  );
};

export const FontItalic = (props) => {
  const { value, onChange, trans } = props;

  return (
    <div className="question-style-list">
      <Tooltip title={trans.FontControl.italic}>
        <Tag.CheckableTag checked={value} onChange={onChange}>
          <Icon type="italic" />
        </Tag.CheckableTag>
      </Tooltip>
    </div>
  );
};

export const FontBold = (props) => {
  const { value, onChange, trans } = props;

  return (
    <div className="question-style-list">
      <Tooltip title={trans.FontControl.bold}>
        <Tag.CheckableTag checked={value} onChange={onChange}>
          <Icon type="bold" />
        </Tag.CheckableTag>
      </Tooltip>
    </div>
  );
};
