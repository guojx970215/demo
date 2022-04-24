import React, { useState, useEffect } from 'react';
import { Modal, Button, InputNumber, Switch } from 'antd';
import htmlReactParser from 'html-react-parser';
import './EditSvg.css';
import { ChromePicker } from 'react-color';

const editSvg = ({ visible, onOk, onCancel, content, trans }) => {
  const [isSvg, setIsSvg] = useState(false);
  const [color, setColor] = useState([]);
  const [newContent, setNewContent] = useState('');

  const [opacity, setOpacity] = useState(1);
  const changeOpacity = (value) => {
    setOpacity(value);
    const divDom = document.createElement('div');
    divDom.innerHTML = newContent;
    if (!isSvg) {
      const opacityDiv = divDom.getElementsByTagName('img')[0];
      opacityDiv.style.opacity = value;
    } else {
      const opacityDiv = divDom.getElementsByClassName('new-svg-div')[0];
      opacityDiv.style.opacity = value;
    }
    setNewContent(divDom.innerHTML);
  };

  const [rotateX, setRotateX] = useState(false);
  const [rotateY, setRotateY] = useState(false);

  useEffect(() => {
    const divDom = document.createElement('div');
    divDom.innerHTML = newContent || content.content[0].value;
    const transformStr = `${rotateX ? 'rotateX(180deg)' : ''} ${
      rotateY ? 'rotateY(180deg)' : ''
    } ${!rotateX && !rotateY ? 'none' : ''};`;

    if (!isSvg) {
      const rotateDom = divDom.firstElementChild;
      rotateDom.setAttribute(
        'style',
        `position:relative;width:100%;height:100%; transform:${
          rotateX ? 'rotateX(180deg)' : ''
        } ${rotateY ? 'rotateY(180deg)' : ''} ${
          !rotateX && !rotateY ? 'none' : ''
        };`
      );
    } else {
      const rotateDom = divDom.getElementsByClassName('new-svg-div')[0];

      rotateDom.setAttribute(
        'style',
        `transform:${rotateX ? 'rotateX(180deg)' : ''} ${
          rotateY ? 'rotateY(180deg)' : ''
        } ${!rotateX && !rotateY ? 'none' : ''}; opacity: ${opacity};`
      );
    }
    setNewContent(divDom.innerHTML);
  }, [rotateY, rotateX]);

  useEffect(() => {
    if (visible) {
      setNewContent(content.content[0].value);
      const div = document.createElement('div');
      div.innerHTML = content.content[0].value;

      if (div.innerHTML.includes('rotateX(180deg)')) {
        setRotateX(true);
      }

      if (div.innerHTML.includes('rotateY(180deg)')) {
        setRotateY(true);
      }

      if (!div.getElementsByTagName('svg')[0]) {
        setIsSvg(false);
        let newOpacity = parseFloat(
          div.getElementsByTagName('img')[0].style.opacity
        );
        setOpacity(newOpacity);
        return;
      }

      setIsSvg(true);
      let newOpacity = parseFloat(
        div.getElementsByClassName('new-svg-div')[0].style.opacity
      );
      setOpacity(newOpacity);

      let text = div.getElementsByTagName('svg')[0].outerHTML;
      let hexs = text.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3}|[0-9a-fA-F]{8})/g); //

      let rgbs = text.match(
        // eslint-disable-next-line no-useless-escape
        /[rR][gG][Bb][Aa]?[\(]([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}[\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?[\s]*(0\.\d{1,2}|1|0)?[\)]{1}/g
      );
      let arr = [];
      hexs && (arr = arr.concat([...new Set(hexs)]));
      rgbs && (arr = arr.concat([...new Set(rgbs)]));
      let colors = [];
      arr.forEach((item, index) => {
        colors.push({
          id: index,
          color: item,
          newColor: item,
        });
      });
      setColor(colors);
    }
  }, [visible]);

  const [selectColor, setSelectColor] = useState(undefined);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [tempContent, setTempContent] = useState('');

  useEffect(() => {
    if (isSvg && selectColor) {
      const div = document.createElement('div');
      div.innerHTML = content.content[0].value;
      let text = div.getElementsByTagName('svg')[0].outerHTML;

      let newColors = color;

      newColors.forEach((value) => {
        let newColor = value.newColor;
        if (value.id === selectColor.id) {
          newColor = selectColor.color;
        }
        if (value.color !== newColor) {
          // 转换多个
          while (text.includes(value.color)) {
            text = text.replace(value.color, newColor);
          }
        }
      });

      div.getElementsByTagName('svg')[0].outerHTML = text;
      setTempContent(div.innerHTML);
    }
  }, [selectColor]);

  useEffect(() => {
    if (isSvg) {
      const div = document.createElement('div');
      div.innerHTML = content.content[0].value;
      let text = div.getElementsByTagName('svg')[0].outerHTML;
      color.forEach((value) => {
        if (value.color !== value.newColor) {
          // 转换多个
          while (text.includes(value.color)) {
            text = text.replace(value.color, value.newColor);
          }
        }
      });
      div.getElementsByTagName('svg')[0].outerHTML = text;
      setNewContent(div.innerHTML);
    }
  }, [color]);

  const chooseColor = (e, color) => {
    setPickerVisible(true);
    setSelectColor(color);
  };

  const confirmSelect = () => {
    let newColor = [...color];
    newColor.forEach((value, index) => {
      if (value.id === selectColor.id) {
        newColor[index].newColor = selectColor.color;
      }
    });
    setColor(newColor);
    cancelSelect();
  };

  const cancelSelect = () => {
    setPickerVisible(false);
    setSelectColor(undefined);
    setTempContent('');
  };

  const onClickOk = () => {
    let confirmContent = [...content.content];
    confirmContent[0].value = newContent;
    onOk(confirmContent, content.id);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={() => onClickOk()}
      title="set svg color"
    >
      <div style={{ width: 400, margin: '0 auto' }}>
        {tempContent
          ? <div dangerouslySetInnerHTML={{ __html: tempContent }}></div>
          : <div dangerouslySetInnerHTML={{ __html: newContent }}></div>}
      </div>

      {isSvg && (
        <div className="color-cubes">
          {color.map((value) => (
            <span
              key={value.id}
              style={{ backgroundColor: value.newColor }}
              onClick={(e) =>
                chooseColor(e, { id: value.id, color: value.newColor })
              }
            ></span>
          ))}
        </div>
      )}

      {isSvg && (
        <div
          className="picker-wrapper"
          style={{ display: pickerVisible ? 'block' : 'none' }}
        >
          <ChromePicker
            color={selectColor ? selectColor.color : 'rgba(255, 255, 255, 1)'}
            onChange={(color) => {
              const { r, g, b, a } = color.rgb;
              const rbgaStr = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

              setSelectColor({ id: selectColor.id, color: rbgaStr });
            }}
          />
          <Button
            type="primary"
            style={{ float: 'right', marginRight: 8, marginBottom: 8 }}
            onClick={() => confirmSelect()}
          >
            confirm
          </Button>
          <Button
            type="default"
            style={{ float: 'right', marginRight: 8, marginBottom: 8 }}
            onClick={() => cancelSelect()}
          >
            cancel
          </Button>
        </div>
      )}

      <span style={{ margin: 8 }}>set opacity</span>
      <InputNumber
        value={opacity}
        onChange={(value) => changeOpacity(value)}
        style={{ margin: 8 }}
        step={0.1}
        max={1}
        min={0}
      />

      <span style={{ margin: 8 }}>{trans.modalForm.rotateX}</span>
      <Switch checked={rotateX} onChange={(checked) => setRotateX(checked)} />

      <span style={{ margin: 8 }}>{trans.modalForm.rotateY}</span>
      <Switch checked={rotateY} onChange={(checked) => setRotateY(checked)} />
    </Modal>
  );
};

export default editSvg;
