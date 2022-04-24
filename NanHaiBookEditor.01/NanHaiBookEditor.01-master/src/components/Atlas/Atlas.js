/* eslint-disable no-useless-escape */
import React, { createElement } from 'react';
import './Atlas.css';
import { Modal, Button, message } from 'antd';
import PhotoGallery from '../HomeMenu/PhotoGallery/ModalList';
import selectImageIcon from './selectImage.png';
import deleteImg from './deleteImg.png';
import replaceImg from './replaceImg.png';

class Atlas extends React.Component {
  state = {
    modalTitle: '图集',
    imageList: [],
    selectImageIndex: '',
    replaceImageIndex: '',
    PhotoGalleryShow: false,
    isReplace: false,
  };
  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this);
    }
  }
  init() {
    let imageList = [];
    if (this.props.element) {
      const div = document.createElement('div');
      div.innerHTML = this.props.element.content[0].value;
      div.querySelectorAll('.atlasImg').forEach((ele) => {
        imageList.push(ele.getAttribute('src'));
      });
    }
    this.setState({
      imageList: imageList,
    });
  }
  // 添加图片
  addImage = (index) => {
    this.setState({
      PhotoGalleryShow: true,
    });
  };
  addImageOk = (imgUrlList) => {
    let { imageList, isReplace, replaceImageIndex } = this.state;
    if (isReplace) {
      imageList.splice(replaceImageIndex, 1, imgUrlList[0]);
    } else {
      imageList = imageList.concat(imgUrlList);
    }
    this.setState({
      imageList: imageList,
      isReplace: false,
      replaceImageIndex: '',
    });
    this.cancalPhotoGallery();
  };
  // 删除图片
  deleteImg = (index) => {
    let { imageList } = this.state;
    imageList.splice(index, 1);
    this.setState({
      imageList: imageList,
    });
  };
  // 替换图片
  replaceImg = (index) => {
    this.setState({
      isReplace: true,
      replaceImageIndex: index,
      PhotoGalleryShow: true,
    });
  };
  cancalPhotoGallery = () => {
    this.setState({
      PhotoGalleryShow: false,
    });
  };
  selectImage = (index) => {
    this.setState({
      selectImageIndex: index,
    });
  };
  handleOk = (e) => {
    const { imageList } = this.state;
    const { addElement, isEdit, actReplaceTempParagraph, element } = this.props;
    if (imageList.length === 0) {
      message.info('请添加图片');
      return false;
    }
    let html = `
      <style>
        * {
          touch-action: pan-y;
        }
        @-webkit-keyframes animation {
          from {
            opacity: 0;
            -webkit-transform: scale(1.2) rotateX(45deg);
            transform: scale(1.2) rotateX(45deg);
          }

          to {}
        }
        @-webkit-keyframes animation2 {
          from {
            opacity: 0;
            -webkit-transform: scale(1.2) rotateX(45deg);
            transform: scale(1.2) rotateX(45deg);
          }

          to {}
        }
        .slider {
          -webkit-animation: animation ease 1s;
          animation-delay: .8s;
          animation-fill-mode: backwards;
          margin: 0 auto;
          height: 100%;
          width: 100%;
          perspective: 1000px;
          transition: ease-in-out .2s;
        }
        .slide img {
          text-align: center;
          width: 100%;
          height: 100%;
          -webkit-user-drag: none;
          user-drag: none;
          -moz-user-drag: none;
          border-radius: 2px;
        }
        .slide {
          width: 100%;
          height: 100%;
          -webkit-user-select: none;
          user-select: none;
          -moz-user-select: none;
          position: absolute;
          box-shadow: 0px 10px 30px 0px rgba(0, 0, 0, 0.3);
          background: #fcfcfc;
          -webkit-transform-style: preserve-3d;
          transform-style: preserve-3d;
          -moz-transform-style: preserve-3d;
          text-align: center;
          border: 12px white solid;
          box-sizing: border-box;
          border-radius: 5px;
        }
        .transition {
          -webkit-transition: cubic-bezier(0, 1.95, .49, .73) .4s;
          -moz-transition: cubic-bezier(0, 1.95, .49, .73) .4s;
          transition: cubic-bezier(0, 1.95, .49, .73) .4s;
        }
      </style>
      <div class="slider">
    `;

    imageList.map((ele) => {
      html =
        html +
        `
        <div class="slide">
          <img class="atlasImg" src="${ele}" />
        </div>
      `;
    });

    html = html + '</div>';
    if (isEdit) {
      actReplaceTempParagraph(element.content[0].value, html, element.id);
    } else {
      addElement('Atlas', {
        content: html,
      })();
    }
    this.handleCancel();
  };
  handleCancel = (e) => {
    this.setState({ imageList: [] });
    this.props.handleCancel();
  };

  render() {
    const {
      modalTitle,
      imageList,
      selectImageIndex,
      PhotoGalleryShow,
    } = this.state;
    const { visible, trans } = this.props;
    return (
      <Modal
        title={modalTitle}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div style={{ marginBottom: '15px' }}>
          <Button type="primary" onClick={() => this.addImage()}>
            add image
          </Button>
        </div>
        <ul className="imageList">
          {imageList.map((ele, index) => (
            <li
              key={index}
              className="imageItem"
              onMouseEnter={() => {
                this.setState({
                  selectImageIndex: index,
                });
              }}
              onMouseLeave={() => {
                this.setState({
                  selectImageIndex: '',
                });
              }}
              onClick={() => this.selectImage(index)}
            >
              <img src={ele} />
              {selectImageIndex === index ? (
                <div className="btnsBox">
                  <span
                    className="icon delete"
                    onClick={() => {
                      this.deleteImg(index);
                    }}
                  >
                    <img src={deleteImg} />
                  </span>
                  <span
                    className="icon replace"
                    onClick={() => {
                      this.replaceImg(index);
                    }}
                  >
                    <img src={replaceImg} />
                  </span>
                </div>
              ) : (
                ''
              )}
            </li>
          ))}
        </ul>
        <PhotoGallery
          trans={trans}
          onCancal={() => this.cancalPhotoGallery()}
          visible={PhotoGalleryShow}
          isAtlas={true}
          addImageOk={(imgUrl) => this.addImageOk(imgUrl)}
        />
      </Modal>
    );
  }
}

export default Atlas;
