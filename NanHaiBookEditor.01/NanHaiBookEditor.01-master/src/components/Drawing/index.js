import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import {
  Modal,
  Row,
  Col,
  InputNumber,
  Button,
  Icon,
  Checkbox,
  Slider,
} from 'antd';
import ModalList from '../HomeMenu/PhotoGallery/ModalList';
import { ElementTypes } from '../../constants';

const Drawing = (props) => {
  const initialState = useRef(false);
  const {
    visible,
    handleCancel,
    trans,
    addElement,
    content,
    element,
    actSetElementContent,
  } = props;
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [scaleLock, setScaleLock] = useState(false);
  const [imgUrl, setImgUrl] = useState('');

  const chosePic = (url) => {
    setImgUrl(url);
    setImageModalVisible(false);
  };

  const cancelImage = () => {
    setImgUrl('');
  };

  useEffect(() => {
    if (!imgUrl) return;
    const image = new Image();
    image.onload = () => {
      setScale(image.width / image.height);
      if (initialState.current) {
        initialState.current = false;
        return;
      }
      setW(image.width);
      setH(image.height);
    };
    image.src = imgUrl;
  }, [imgUrl]);

  const handleOk = () => {
    const imgStr = imgUrl
      ? ` <img src="${imgUrl}" class="drawing-box-img" 
      style="top: ${y}px; left: ${x}px; width: ${w}px; height: ${h}px; opacity: ${opacity}" />`
      : '';
    if (element) {
      element.content[0].value = `${imgStr}<iframe src="http://39.99.182.102//draw/index.html" frameborder="1" width="100%" height="100%"></iframe>`;
      actSetElementContent(element.content, element.id);
    } else {
      addElement(ElementTypes.drawingBox, imgStr)();
    }

    handleCancel();
  };

  useEffect(() => {
    if (!content) return;
    const image = content.replace(/<iframe .*?><\/iframe>/g, '');
    const divDom = document.createElement('div');
    divDom.innerHTML = image;
    const imgDom = divDom.getElementsByTagName('img')[0];

    if (imgDom) {
      initialState.current = true;
      setImgUrl(imgDom.getAttribute('src'));
      setX(~~imgDom.style.left.replace('px', ''));
      setY(~~imgDom.style.top.replace('px', ''));
      setW(~~imgDom.style.width.replace('px', ''));
      setH(~~imgDom.style.height.replace('px', ''));
      setOpacity(imgDom.style.opacity ? Number(imgDom.style.opacity) : 1);
    }
  }, [content]);

  return (
    <>
      <Modal
        visible={visible}
        title="画图板"
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Row>
          <Col span={12} className="drawing-input">
            <span>x:</span>
            <InputNumber value={x} onChange={(value) => setX(value)} />
          </Col>
          <Col span={12} className="drawing-input">
            <span>y:</span>
            <InputNumber value={y} onChange={(value) => setY(value)} />
          </Col>
          <Col span={24} className="drawing-input">
            <Checkbox
              checked={scaleLock}
              onChange={(e) => setScaleLock(e.target.checked)}
            >
              scale lock
            </Checkbox>
          </Col>
          <Col span={12} className="drawing-input">
            <span>width:</span>
            <InputNumber
              value={w}
              onChange={(value) => {
                setW(value);
                if (scaleLock) {
                  setH(~~(value / scale));
                }
              }}
            />
          </Col>
          <Col span={12} className="drawing-input">
            <span>height:</span>
            <InputNumber
              value={h}
              onChange={(value) => {
                setH(value);
                if (scaleLock) {
                  setW(~~(value * scale));
                }
              }}
            />
          </Col>

          <Col span={4} className="drawing-input">
            <span style={{lineHeight: "36px"}}>opacity:</span>
          </Col>
          <Col span={12} className="drawing-input">
            <Slider
              min={0}
              max={1}
              onChange={(value) => setOpacity(value)}
              value={opacity}
              step={0.1}
            />
          </Col>

          <Col span={4} className="drawing-input">
            <InputNumber
              min={0}
              max={1}
              style={{ marginLeft: 16 }}
              step={0.1}
              value={opacity}
              onChange={(value) => setOpacity(value)}
            />
          </Col>

          <Col span={12}>
            <Button onClick={() => setImageModalVisible(true)}>
              select pic
            </Button>
          </Col>

          {imgUrl && (
            <Col span={12} style={{ position: 'relative' }}>
              <img src={imgUrl} width="100%" />
              <div className="drawing-pic-delete" onClick={cancelImage}>
                <Icon type="close" />
              </div>
            </Col>
          )}
        </Row>
      </Modal>
      <ModalList
        visible={imageModalVisible}
        trans={trans}
        onCancal={() => setImageModalVisible(false)}
        onClick={(url) => chosePic(url)}
      ></ModalList>
    </>
  );
};

export default Drawing;
