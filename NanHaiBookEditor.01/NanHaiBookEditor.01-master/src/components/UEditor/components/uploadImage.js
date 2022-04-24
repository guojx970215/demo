import React, { useState, useEffect } from 'react';
import ModalList from '../../HomeMenu/PhotoGallery/ModalList';
import {
  Modal,
  Input,
  InputNumber,
  Checkbox,
  Button,
  Icon,
  Upload,
  message
} from 'antd';
import Api from '../../../api/bookApi';

const uploadImage = ({ trans, visible, onCancel, onOk }) => {
  const [pic, setPic] = useState({
    addPicUrl: undefined,
    addPicUrlWidth: 0,
    addPicUrlHeight: 0,
    addPicScaleOn: false,
    addPicUrlBorder: 0,
    addPicUrlMargin: 0,
    addPicScale: 1
  });

  const upload = e => {
    let data = new FormData();
    data.append('file', e.target.files[0]);
    // data.append('userId', Api.getUserId());
    // data.append('mediaCategory', 3);
    fetch('/api/file/upload', {
      method: 'POST',
      body: data,
      headers: {
        credentials: 'same-origin'
      }
    })
      .then(res => res.json())
      .then(upres => {
        setPicValue({ addPicUrl: upres.result.url });
      });
  };

  const setPicValue = value => {
    let newPic = { ...pic, ...value };
    setPic(newPic);
  };

  const [galleryVisible, setGalleryVisible] = useState(false);

  useEffect(() => {
    let image = new Image();
    image.src = pic.addPicUrl;

    image.onload = () => {
      setPicValue({
        addPicUrlWidth: image.width,
        addPicUrlHeight: image.height,
        addPicScale: image.height / image.width
      });
    };
  }, [pic.addPicUrl]);

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="上传图片"
      onOk={() => {
        onOk(pic);
        onCancel();
      }}
    >
      <ModalList
        isEdit={true}
        trans={trans}
        visible={galleryVisible}
        onCancal={() => setGalleryVisible(false)}
        selectImg={src => setPicValue({ addPicUrl: src })}
      ></ModalList>

      <div className="setPicInput">
        <Button
          type="primary"
          ghost
          style={{ marginRight: 16 }}
          onClick={() => setGalleryVisible(true)}
        >
          <Icon type="plus" /> Select From Gallery
        </Button>

        <Button
          type="primary"
          onClick={() => document.getElementById('image-uploader').click()}
        >
          <Icon type="upload" /> {trans.UEditor.upload}
        </Button>
        <input
          type="file"
          style={{ display: 'none' }}
          onChange={upload}
          id="image-uploader"
        />
      </div>

      <div className="setPicInput">
        <span>{trans.modalList.picAddress}:</span>
        <Input value={pic.addPicUrl} disabled style={{ width: '100%' }} />
      </div>
      <div className="setPicInput">
        <span>{trans.modalList.width}:</span>
        <InputNumber
          value={pic.addPicUrlWidth}
          style={{ width: 100, marginRight: 32 }}
          onChange={value => {
            if (pic.addPicScaleOn) {
              setPicValue({
                addPicUrlWidth: value,
                addPicUrlHeight: Math.ceil(value * pic.addPicScale)
              });
            } else {
              setPicValue({
                addPicUrlWidth: value
              });
            }
          }}
        />
        <span>{trans.modalList.height}:</span>
        <InputNumber
          value={pic.addPicUrlHeight}
          style={{ width: 100, marginRight: 32 }}
          onChange={value => {
            if (pic.addPicScaleOn) {
              setPicValue({
                addPicUrlWidth: Math.ceil(value / pic.addPicScale),
                addPicUrlHeight: value
              });
            } else {
              setPicValue({
                addPicUrlHeight: value
              });
            }
          }}
        />
        <Checkbox
          checked={pic.addPicScaleOn}
          onChange={e => {
            setPicValue({ addPicScaleOn: e.target.checked });
          }}
        >
          {trans.modalList.gudingbili}
        </Checkbox>
      </div>
      <div className="setPicInput">
        <span>{trans.modalList.border}:</span>
        <InputNumber
          value={pic.addPicUrlBorder}
          style={{ width: 100, marginRight: 32 }}
          onChange={value => {
            setPicValue({ addPicUrlBorder: value });
          }}
        />
        <span>{trans.modalList.padding}:</span>
        <InputNumber
          value={pic.addPicUrlMargin}
          style={{ width: 100, marginRight: 32 }}
          onChange={value => {
            setPicValue({ addPicUrlMargin: value });
          }}
        />
      </div>
    </Modal>
  );
};

export default uploadImage;
