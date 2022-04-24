import React, { useState, useEffect } from 'react';
import { Button, Modal, InputNumber, Checkbox } from 'antd';
import './InsertImage.css';

const InsertImage = ({
  imageSrc,
  visible,
  onCancel,
  onOk,
  trans,
  defaultSize,
  hideDefault,
  dict
}) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(undefined);
  const [scaleLock, setScaleLock] = useState(false);
  const [defaultValue, setDefaultValue] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSize({ width: 0, height: 0 });
      setScale(undefined);
      setScaleLock(false);
      setDefaultValue(false);
    } else {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setScale((img.width / img.height).toFixed(2));

        if (
          (defaultSize.width === '100%' || defaultSize.height === '100%') &&
          !dict
        ) {
          setDefaultValue(true);
          setSize({
            width: img.width,
            height: img.height
          });
        } else {
          if (dict) {
            let picW = img.width;
            let picH = img.height;
            if (picW > 500) {
              picW = 500;
              picH = img.width * (img.width / img.height).toFixed(2);
            }
            if (picH > 500) {
              picH = 500;
            }
            setSize({
              width: defaultSize.width ? defaultSize.width.toString().replace('px', '') : picW,
              height: defaultSize.height ? defaultSize.height.toString().replace('px', '') : picH
            });
          } else {
            setSize({
              width:
                defaultSize.width.toString().replace('px', '') || img.width,
              height:
                defaultSize.height.toString().replace('px', '') || img.height
            });
          }
        }
      };
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      title={trans.AddQuestionForm.setPic}
      onCancel={() => onCancel()}
      onOk={() => {
        onCancel();
        if (hideDefault || !defaultValue) {
          onOk({ width: size.width + 'px', height: size.height + 'px' });
        } else {
          onOk({ width: '100%', height: 'auto' });
        }
      }}
      width={300}
    >
      <div
        className="insertImageList"
        style={{ display: hideDefault ? 'none' : 'block' }}
      >
        <Checkbox
          checked={defaultValue}
          onChange={e => setDefaultValue(e.target.checked)}
        >
          {trans.AddQuestionForm.defaultSize}
        </Checkbox>
      </div>

      <div className="insertImageList">
        <Checkbox
          checked={scaleLock}
          onChange={e => {
            setScaleLock(e.target.checked);
          }}
          disabled={defaultValue}
        >
          {trans.AddQuestionForm.lockScale}
        </Checkbox>
      </div>

      <div className="insertImageList">
        <span>{trans.AddQuestionForm.width}：</span>
        <InputNumber
          value={size.width}
          min={0}
          max={dict ? 500 : 10000}
          onChange={value => {
            if (scaleLock) {
              setSize({ width: value, height: Math.ceil(value / scale) });
            } else {
              setSize({ width: value, height: size.height });
            }
          }}
          disabled={defaultValue}
        />
      </div>

      <div className="insertImageList">
        <span>{trans.AddQuestionForm.height}：</span>
        <InputNumber
          value={size.height}
          min={0}
          max={dict ? 500 : 10000}
          onChange={value => {
            if (scaleLock) {
              setSize({ width: Math.ceil(value * scale), height: value });
            } else {
              setSize({ width: size.width, height: value });
            }
          }}
          disabled={defaultValue}
        />
      </div>
    </Modal>
  );
};

export default InsertImage;
