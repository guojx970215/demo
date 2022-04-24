import React from 'react';
import './UEditor.css';
import ReactUeditor from 'ifanrx-react-ueditor-iframe';
import ueditorConfig from './ueditorConfig';
import Api from '../../api/bookApi';
import InsertLink from './components/InsertLink/InsertLink';
import galleryIcon from '../HomeMenu/Home_PhotoGallery.png';
import { connect, Provider } from 'react-redux';

import UploadAudio from './components/uploadAudio';
import UploadImage from './components/uploadImage';
import './components/Paragraph.css';
import {
  Button,
  Select,
  Menu,
  Checkbox,
  InputNumber,
  Icon,
  Modal,
  Input,
  Form,
  message,
  Spin,
  Radio
} from 'antd';
import Dict from './components/Dict';
import store from '../../store';

const { Option } = Select;
const $ = window.$;
const autionIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACBUlEQVRYR+1VwXHbMBC8qyBxBXI6cCqwUkEOFUSuIHYFliuwUoGVCrAdWOlA6UCuIOpgPashNRQIOtJkHH2ID2eIA25vD7vndublZ85vI4CRgZGBkxmIiI9mdm9mMzNbAHgYknJEzM3sA4C7oZiTAEREmNmTuwvEi5lNSH4GsK4liIiFu38nuQRwU4s5CkBTtRILwAvJWzPbuvszyS8AVhFxZWbXAH50E0XE0t2/kbwBsCxBVAFExKW7TxRMUhfPVTVJXT4HsI2IaQHg1t0fFQNAAPcrpbQhqVZc/BWAaHb3XASq6pkqbf+XAPQ/pQQz+9qy0omdufsTyQRAMfvVYyClpCSXLc1N5FpVF9QeMKA9tcrd/5D8CUCPdLc6/3vsDAGwnPP0rUFVY6BhYUVyAuBT0QYVsC7vfQ8AuzbknA/ubpjtFfYeANTCq5yzpNp9iJLq9n8wIKpXOWdJtguA5dvQZpUB9dDdd1pXEMnfRz5CyfW+1HyrrJoX9ADUZEhyY2YykkEZds79KmnuyPOiLGTIiNQ/GZCWTGkhTyep78OAEck/Zo1f7CXbUUtPgtUW1KTX6Fg2KpPR5fL1AyseONfODhnZtKz+aAAdQ1GVYkFDaOPuMqzBYdRITxZeTX4ygNbVmtkgujWONXKrqxliVqu8PXDUNHzLEf91bwQwMjAycHYGXgGLbI8w70amwwAAAABJRU5ErkJggg==';

const testIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABd0lEQVQ4T82SMUsDQ' +
  'RCFZ+64IlaxsEgpEQULGxsrLUTQLv4CsZCA3XnJ7AWJnKAkuyuk0CYKFpYimFKwsktlIVYKoo2WpotwYUcuEDkTNUnnFgszb+bj7c4' +
  'gdB2t9SoAzBhjMC5ZlsUAcJfP5y/j+W9FkSClzADAHCKOMvNblEPEFDO/A0BdCFH7ExCJSqk0ACwS0XEUa62zrVbrulAoPHU77nHwP' +
  'wBSyilmnvd9/yRyVC6XNxzHufE872HQJ+w7jnPkum77EyuVSioMw00iKvYFlEqlCdu2M0R0EC+WUnq2bV/kcrmXfmM8TCaTW9lsNow' +
  'XVqtVp9FoKCGE+ytAKbXAzCuWZV11W41iY8wyANSEEPWO/jVGZkat9T0ATP/UHMvdEtFsD0BKuY6Ip32aO/IaEZ21tzS6giAYSSQSz' +
  '4g4NgiAmV+bzWY6CIKPNkAptQsAO4M0x2qKRLTXAUQ7Pj4k4JGIJtsAKeU2Ii4NAQiNMSe+759/AhPYnxETEdJoAAAAAElFTkSuQmCC';

const splitText = (elements, tagName) => {
  if (elements.length > 0) {
    const element = elements[0];
    const rbs = element.querySelectorAll(tagName);
    const texts = [];
    for (let i = 0; i < rbs.length; i++) {
      texts.push(rbs[i].innerText);
    }
    return texts;
  }
  return false;
};

const splitHTML = content => {
  const div = document.createElement('div');
  div.innerHTML = content;
  const simp = div.getElementsByClassName('simp-p');
  const words = div.getElementsByClassName('words');
  let isRead = true,
    lineHeight = 1,
    letterSpacing = 0,
    vertical = false,
    textAlign = 'left';
  // 去掉text style wrapper，并获取值
  const textWrapper = div.getElementsByClassName('text-style-wrapper');
  if (textWrapper[0]) {
    if (textWrapper[0].style.lineHeight)
      lineHeight = textWrapper[0].style.lineHeight;
    if (textWrapper[0].style.letterSpacing)
      letterSpacing = Number(
        textWrapper[0].style.letterSpacing.replace('px', '')
      );
    if (textWrapper[0].style.writingMode)
      vertical =
        textWrapper[0].style.writingMode &&
        textWrapper[0].style.writingMode === 'vertical-lr';
    if (textWrapper[0].style.textAlign)
      textAlign = textWrapper[0].style.textAlign;

    for (let i = 0; i < textWrapper.length; i++) {
      // 去掉外层
      textWrapper[i].outerHTML = textWrapper[i].innerHTML;
    }
  }
  if (!words[0]) {
    isRead = false;
    if (simp[0]) {
      content = simp[0].innerHTML
        .replace(/<rt>(.*?)<\/rt>/g, '')
        .replace(/<ruby>/g, '')
        .replace(/<\/ruby>/g, '')
        .replace(/<rb>/g, '')
        .replace(/<\/rb>/g, '')
        .replace();
    }

    let simpContent = `${content}`;

    return {
      simpContent,
      isRead,
      pinyinTexts: [],
      simpTexts: [],
      tradTexts: [],
      lineHeight,
      letterSpacing,
      vertical,
      textAlign
    };
  } else {
    const div = document.createElement('div');
    div.innerHTML = content;
    const simp = div.getElementsByClassName('simp-p');
    const pinyinTexts = splitText(simp, 'rt') || [];
    const simpTexts = splitText(simp, 'rb') || [];
    const trad = div.getElementsByClassName('trad-p');
    const tradTexts = splitText(trad, 'rb') || [];
    let simpContent = simp[0].innerHTML
      .replace(/<rt>(.*?)<\/rt>/g, '')
      .replace(/<rb>/g, '')
      .replace(/<\/rb>/g, '')
      .replace(/<ruby>/g, '')
      .replace(/<\/ruby>/g, ''); // 去掉标签

    return {
      isRead,
      pinyinTexts,
      simpTexts,
      tradTexts,
      simpContent,
      lineHeight,
      letterSpacing,
      vertical,
      textAlign
    };
  }
};

class UEditor extends React.Component {
  constructor(props) {
    super(props);
    let { htmlContent } = this.props;
    htmlContent = htmlContent.replace(/inline-block/g, 'inline');
    let fontStyle = {};

    let currentPage = this.props.bookPages.present.pages.find(item => {
      return item.id === this.props.bookPages.showingPageId;
    });

    if (currentPage.config && currentPage.config.fontSize) {
      fontStyle.fontSize = currentPage.config.fontSize;
    }
    if (currentPage.config && currentPage.config.fontFamily) {
      fontStyle.fontFamily = currentPage.config.fontFamily;
    }
    if (currentPage.config && currentPage.config.fontColor) {
      fontStyle.fontColor = currentPage.config.fontColor;
    }

    const {
      simpContent,
      isRead,
      pinyinTexts,
      simpTexts,
      tradTexts,
      lineHeight,
      letterSpacing,
      vertical,
      textAlign
    } = splitHTML(htmlContent, fontStyle);

    this.state = {
      fontStyle,
      progress: -1,
      editorResult: '',
      inputValue: '',
      isRead,
      simpContent,
      pinyinTexts,
      simpTexts,
      tradTexts,
      lineHeight,
      vertical,
      textAlign,
      letterSpacing,
      ueditorInnerHTML: '',
      ueditorInnerText: '',
      editable: true,
      child: null,
      focusOnTable: false,
      fontStyleHtml: `<style>.words, p {${
        fontStyle.fontColor ? `color: ${fontStyle.fontColor}; ` : ''
      }${fontStyle.fontSize ? `font-size: ${fontStyle.fontSize}px; ` : ''}${
        fontStyle.fontFamily ? `font-family: ${fontStyle.fontFamily}; ` : ''
      }}</style>`
    };
  }

  clearTextAlign = () => {
    let taDivs = this.ueditorRef.body.querySelectorAll('[style]');
    for (let i = 0; i < taDivs.length; i++) {
      taDivs[i].style.textAlign = '';
    }
  };
  changeLineHeight = value => {
    this.ueditorRef.body.style.lineHeight = value.target.value;
  };
  changeLetterSpacing = value => {
    this.ueditorRef.body.style.letterSpacing = value + 'px';
  };
  changeTextAlign = value => {
    this.ueditorRef.body.innerHTML = this.ueditorRef.body.innerHTML.replace(
      /text-align:.*?[;"']/g,
      ''
    );
    console.log(value);
    this.ueditorRef.body.style.textAlign = value;
  };
  changeVertical = value => {
    this.ueditorRef.body.style.writingMode = value.target.checked
      ? 'vertical-lr'
      : '';
  };
  getUeditor = ref => {
    this.ueditorRef = ref;
  };
  addimgInEdtior = data => {
    // console.log(data);
    let inserthtml = '';
    if (/\.svg$/.test(data.addPicUrl)) {
      inserthtml = `<object data="${data.addPicUrl}" type="image/svg+xml"></object>`;
    } else {
      inserthtml = `<img src='${data.addPicUrl}' width='${data.addPicUrlWidth}' 
      width='${data.addPicUrlHeight}' style='border:${data.addPicUrlBorder}px #333 solid; margin: ${data.addPicUrlMargin}px; display: inline-block' />`;
    }
    this.ueditorRef.execCommand('inserthtml', inserthtml, true);
  };

  InsertLinkPlugin = ueditor => {
    const { trans } = this.props;
    return {
      menuText: 'link',
      cssRules: `background-position: -504px 0px;`,
      render: (visible, closeModal) => {
        let nodeHref = '';
        let selectTxt = '';
        let nodeTitle = '';
        let nodeTarget = false;

        if (ueditor.selection) {
          const range = ueditor.selection.getRange();
          range.select();
          selectTxt = ueditor.selection.getText();
          const startNode = ueditor.selection.getStart();
          nodeTitle = startNode.title ? startNode.title : '';
          nodeHref = startNode.href;
          nodeTarget = startNode.target === '_blank' ? true : false;
        }

        if (this.state.child) {
          this.state.child.init(selectTxt, nodeTitle, nodeHref, nodeTarget);
        }

        const handleOk = (content, linkUrl, title, isBlank) => {
          if (ueditor.selection) {
            const range = ueditor.selection.getRange();
            range.select();
            selectTxt = ueditor.selection.getText();

            const startNode = ueditor.selection.getStart();

            nodeTitle = startNode.title;
            if (!selectTxt && this.state.editable) {
              let html = '<a';
              if (isBlank) {
                html = html + ' target="_blank" ';
              } else {
                html = html + ' target="_self" ';
              }
              html = `${html} class="hyper-link-content" href="${linkUrl}" title="${title}">${content}</a>`;
              this.ueditorRef.execCommand('inserthtml', html, true);
            } else {
              console.log('InsertLinkPlugin', startNode.parentNode);
              if (
                (startNode.tagName == 'A' || startNode.tagName == 'a') &&
                startNode.className.indexOf('hyper-link') !== -1
              ) {
                if (!linkUrl) {
                  range.removeInlineStyle('a', { class: 'hyper-link-content' });
                } else {
                  startNode.title = title;
                  startNode.href = linkUrl;
                  startNode.target = isBlank ? '_blank' : '_self';
                  if (this.state.editable) {
                    startNode.innerHTML = content;
                  }
                }
              } else {
                range.applyInlineStyle('a', {
                  class: 'hyper-link-content',
                  title: title,
                  href: linkUrl,
                  target: isBlank ? '_blank' : '_self'
                });
              }
            }
          }
          closeModal();
        };

        const handleCancel = () => {
          closeModal();
        };

        return (
          <InsertLink
            onRef={ref => {
              this.setState({
                child: ref
              });
            }}
            trans={trans}
            selectTxt={selectTxt}
            nodeTitle={nodeTitle}
            nodeHref={nodeHref}
            nodeTarget={nodeTarget}
            handleCancel={handleCancel}
            visible={visible}
            handleOk={handleOk}
          ></InsertLink>
        );
      }
    };
  };

  lineHeight = ueditor => {
    const { trans } = this.props;
    return {
      menuText: trans.UEditor.txtTittle,
      cssRules:
        'background: url(../ueditor/themes/default/images/icons.png) !important;background-position: -725px -40px!important;',
      render: (visible, closeModal) => {
        return (
          <div
            className="lineHeightContainer"
            style={{ display: visible ? 'block' : 'none' }}
          >
            <div className="lineHeightList">
              <span>{trans.UEditor.lineHeight}</span>
              <Input
                defaultValue={this.state.lineHeight}
                style={{ width: 131 }}
                onChange={value => this.changeLineHeight(value)}
              />
            </div>
            <div className="lineHeightList">
              <span>{trans.UEditor.letterSpacing}</span>
              <InputNumber
                defaultValue={this.state.letterSpacing}
                style={{ width: 107, marginRight: 8 }}
                min={0}
                step={0.1}
                onChange={value => this.changeLetterSpacing(value)}
              />
              px
            </div>
            <div className="lineHeightList">
              <span>align</span>
              <Radio.Group
                defaultValue={this.state.textAlign}
                onChange={value => this.changeTextAlign(value.target.value)}
                buttonStyle="solid"
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
            <div className="lineHeightList">
              <span />
              <Checkbox
                defaultChecked={this.state.vertical}
                onChange={e => this.changeVertical(e)}
              >
                {trans.UEditor.vertical}
              </Checkbox>
            </div>
            <Button
              onClick={() => {
                closeModal();
              }}
              style={{ width: '100%' }}
            >
              {trans.UEditor.cancel}
            </Button>
          </div>
        );
      }
    };
  };

  dictPlugin = ueditor => {
    const { trans } = this.props;
    return {
      menuText: 'dict',
      cssRules:
        'background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUEAYAAADdGcFOAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAAA1NJREFUSMfNlk9IG1sUxr+T5s9I0hYCLkQkBFoM2oKBIIgUSVA3giUUIwUR7MKdIf5D07gRxJAEod0UTHcaF4YubKDURTFkU+mitU1ta8EODRi6KAhpcTIJzpy3CJqiL6h92tdvM9x7zpzzu9/MvVzgLxdVCkQ8EU/Ec/s2pznNaa8XGWSQuXr13DpbYIEll+MVXuGVhw8nbBO2CVsicSJgZCGyEFmwWjnKUY5+/oxudKNbp7swi5xwwlksKg7FoTjq6/3kJz99/XoQ1h57YQhDGGpqQgABBP4FrAc96IlGEUcc8RcvDlfaT/3UT6Tm1JyaM5vJRS5yNTVhH/vYv3sXYxjD2JUrx+olkURSr9e2a9u17XZ7abIMqDmar1ar1Wr1pUsVV9yABjS8fi0khaSQLH8S3uEd3lEUzYBmQDPw7t1edi+7l/V6dR26Dl2HzQYRIsR0ulLZSn01+E0VZ4ozxZnLl0EgUDxecuLJE3azm90vX5pqTbWm2g8f5Jgck2MGg2pRLaqlrw8hhBBiPm2f3wY8SexjH/uuXdMUNAVN4f79Sf+kf9L//j2BQKjs5B8DPBBJJJF08+YheC/3cu/29t8DWEd1VKeqhxMZZJDRnLrvhQOiE53ofPPmcKyFFtrr1/9/QBky5Ldv1aAaVIPBYGgrtBXacjjQila03rhx2jLa0yYelX5KP6Wf+vlTdspO2enxUA3VUI0sK11Kl9Ilinlz3pw3f/pkWjQtmhYtFhZYYCEWO2ufswM2ohGNt27JKTklpwCkkEIKYDAYAG3QBm3YbEbRKBrFQIDbuI3b3G4sYxnLglCxrhVWWHM5bGMbv2yhswN64IGnr680OHiWRQlKUOIM9QYxiMHv36vWqtaq1l69Ohq++E1SSbvYxe6XL5jDHObu3PGuele9qz9+HE072UEDDDB4vYqkSIr07Nl/5RI2hU1hM58fXhpeGl769u2k/OOALWhBS/ncUsJKWAk/f+7P+rP+rCj+CXN/1bHrVuk4qK+ndVqn9Y8fS//Uo0cooIDC06fnDaC6VJfqYpZGpVFpNJmcpmmaprJBFS+s4ZHwSHjk3j3MYhazPh8JJJBgNJ4XGDdzMzfLMtnJTvYHD8bnx+fH5x8/Pm8DLlz/AC/oWOq6712PAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA5LTA0VDIxOjU3OjI1KzA4OjAwpLpmcwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wOS0wNFQyMTo1NzoyNSswODowMNXn3s8AAABJdEVYdHN2ZzpiYXNlLXVyaQBmaWxlOi8vL2hvbWUvYWRtaW4vaWNvbi1mb250L3RtcC9pY29uX3J0YW01enZydXBnL3ppZGlhbi5zdmeYvGFMAAAAAElFTkSuQmCC) !important',
      render: (visible, closeModal) => {
        const handleCancel = () => {
          closeModal();
        };

        return (
          <Modal
            title="字典设置"
            destroyOnClose={true}
            visible={visible}
            onCancel={handleCancel}
            footer={null}
          >
            <Dict
              ueditor={ueditor}
              onOk={() => {
                closeModal();
              }}
              onClear={() => {
                closeModal();
              }}
            ></Dict>
          </Modal>
        );
      }
    };
  };

  updateEditorContent = content => {
    this.setState({ editorResult: content });
  };
  ueditorBodyInput = e => {
    if (this.state.editable === false) {
      let prevUeditorInnerHTML = this.state.ueditorInnerHTML;
      let prevUeditorInnerText = this.state.ueditorInnerText;
      let innerHTML = this.ueditorRef.body.innerHTML;
      let ueditorInnerText = this.ueditorRef
        .getContentTxt()
        .replace(/\s+/g, '');

      if (prevUeditorInnerHTML) {
        if (
          (e.data && e.data !== ' ') ||
          ueditorInnerText.length !== prevUeditorInnerText.length
        ) {
          this.ueditorRef.setContent('', false);
          this.ueditorRef.execCommand('inserthtml', prevUeditorInnerHTML, true);
        } else {
          this.setState({
            ueditorInnerHTML: innerHTML
          });
        }
      }
    }
  };
  ueditorOnReady = () => {
    if (this.state.fontStyle.fontColor) {
      this.ueditorRef.body.style.color = this.state.fontStyle.fontColor;
    }
    if (this.state.fontStyle.fontSize) {
      this.ueditorRef.body.style.fontSize =
        this.state.fontStyle.fontSize + 'px';
    }
    this.ueditorRef.body.style.fontFamily =
      "Arial, 'KaiTi', 'STKaiti', 'Noto Sans TC', sans-serif";
    if (this.state.lineHeight != 1) {
      this.ueditorRef.body.style.lineHeight = this.state.lineHeight;
    }
    if (this.state.letterSpacing !== 0) {
      this.ueditorRef.body.style.letterSpacing =
        this.state.letterSpacing + 'px';
    }
    if (this.state.vertical) {
      this.ueditorRef.body.style.writingMode = 'vertical-lr';
    }
    if (this.state.textAlign !== 'left') {
      this.ueditorRef.body.style.textAlign = this.state.textAlign;
    }
    // console.log('ueditor ueditorOnReady', this.state)
    // ueditor大小随可视区域宽度而变
    document.querySelector('.edui-editor').style.width = '100%';
    document.querySelector('.edui-editor-iframeholder').style.width = '100%';

    this.ueditorRef.execCommand('inserthtml', this.state.simpContent, true);
    this.ueditorRef.execCommand('background', {
      background: this.props.background
    });

    this.ueditorRef.addListener('selectionchange', () => {
      // 判断是否fouse表单
      let pathEles = this.ueditorRef.selection.getStartElementPath();
      pathEles = pathEles.map(value => value.tagName);
      if (pathEles.includes('TABLE')) {
        this.setState({ focusOnTable: true });
      } else {
        this.setState({ focusOnTable: false });
      }
    });
    // 上传的文本禁止编辑
    let editable = this.props.element.config.editable;
    this.setState({
      editable: editable
    });
    if (editable === false) {
      this.setState({
        ueditorInnerHTML: this.ueditorRef.body.innerHTML
      });
      // this.ueditorRef.setContent(
      //   this.ueditorRef.body.innerHTML.replace(/<style.*?>*<\/style>/gi, ''),
      //   false
      // );
      this.setState({
        ueditorInnerText: this.ueditorRef.getContentTxt().replace(/\s+/g, '')
      });
      this.ueditorRef.setContent('', false);
      this.ueditorRef.execCommand(
        'inserthtml',
        this.state.ueditorInnerHTML,
        true
      );
      this.ueditorRef.body.setAttribute('tabindex', 1);
      this.ueditorRef.body.addEventListener('input', this.ueditorBodyInput);
    }

    // 控制插入的音频状态
    let audioList = this.ueditorRef.body.querySelectorAll('.ueditorAudio');
    // console.log('ueditor componentDidMount this.props', audioList);
    for (let i = 0; i < audioList.length; i++) {
      let audio = audioList[i];
      let paused = audio.getAttribute('paused');
      if (paused === 'true') {
        audio.pause();
      } else {
        audio.play();
      }
    }
  };

  handleInputChange = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  uploadImage = e => {
    return new Promise(function(resolve, reject) {
      let data = new FormData();
      data.append('file', e.target.files[0]);
      data.append('userId', Api.getUserId());
      data.append('mediaCategory', 3);
      fetch('/api/media/image', {
        method: 'POST',
        body: data,
        headers: {
          credentials: 'same-origin'
        }
      })
        .then(res => res.json())
        .then(upres => {
          if (upres.state) {
            resolve(upres.result);
          }
        });
    });
  };

  uploadAudioPlugin = ueditor => {
    const { trans } = this.props;
    return {
      menuText: trans.UEditor.uploadAudio,
      cssRules: `background: url(${autionIcon}) !important;
      background-size: 20px 20px !important;`,
      render: (visible, closeModal) => {
        if (!this.state.focusOnTable) {
          if (visible) {
            message.warn('音频只能添加在表格中')
            setTimeout(() => closeModal(), 0);
          }
          visible = false;
        }

        const updateLinkList = linkList => {
          console.log('上传音频', linkList);
          let html = '';
          linkList.map(ele => {
            let link = ele.link;
            let config = ele.config;
            let dataExtra = {
              poster: config.poster,
              name: config.name,
              author: config.author
            };
            html = html + `<audio class="ueditorAudio" src="${link}"`;
            if (config.controls === 1) {
              html = html + ' controls ';
            }
            if (config.autoplay === 1) {
              html = html + ' autoplay ';
            }
            if (config.loop === 1) {
              html = html + ' loop ';
            }
            html =
              html +
              `data-extra=${JSON.stringify(
                dataExtra
              )} controlsList="nodownload"></audio>`;

            if (config.controls !== 1) {
              html = `<span class="music-pause" onclick="questionAudio(this)">${html}</span>`;
            }
          });
          this.ueditorRef.execCommand('inserthtml', html, true);
          closeModal();
        };
        const handleCancel = () => {
          closeModal();
        };
        return (
          <UploadAudio
            trans={trans}
            visible={visible}
            updateLinkList={updateLinkList}
            handleCancel={handleCancel}
          ></UploadAudio>
        );
      }
    };
  };

  photoGalleryPlugin = ueditor => {
    const { trans } = this.props;
    return {
      menuText: trans.UEditor.imageUpload,
      cssRules: `background: url(${galleryIcon}) !important; 
         background-size: 20px 20px !important;
         filter: grayscale(100%); `,
      render: (visible, closeModal) => {
        const trans = this.props.trans;
        if (!this.state.focusOnTable) {
          if (visible) {
            message.warn('图片只能添加在表格中')
            setTimeout(() => closeModal(), 0);
          }
          visible = false;
        }

        return (
          <UploadImage
            trans={trans}
            onCancel={closeModal}
            visible={visible}
            onOk={src => this.addimgInEdtior(src)}
          ></UploadImage>
        );
      }
    };
  };

  renderPinyin = contents => {
    contents = contents.replace(/<p>.*?<\/p>/g, '');
    let tradContents = contents;

    this.state.simpTexts.forEach((value, index) => {
      if (this.state.pinyinTexts[index].trim().length > 0 && value && value.length > 0 && value !== '-') {
        let reg = new RegExp(`(?!<rb>)${value}(?!</rb>)`);
        let newStr = `<ruby><rb>${value}</rb><rt>${this.state.pinyinTexts[index]}</rt></ruby>`;
        contents = contents.replace(reg, newStr);

        let triReg = new RegExp(`(?!<rb>)${value}(?!</rb>)`);
        let newTriStr = `<ruby><rb>${this.state.tradTexts[index]}</rb>
        <rt>${this.state.pinyinTexts[index]}</rt></ruby>`;
        tradContents = tradContents.replace(triReg, newTriStr);
      }
    });

    return {simp: contents,trad: tradContents};
  };

  saveUeditorContent = () => {
    // this.ueditorRef.getContent() 获取不到ruby
    // 为audio添加属性paused，表示该音频当前的播放状态
    this.setState({ rendering: true });
    let audioList = this.ueditorRef.body.querySelectorAll('audio');
    for (let i = 0; i < audioList.length; i++) {
      let audio = audioList[i];
      // console.log('保存之前获取audio并修改属性值', audio, audio.paused);
      audio.setAttribute('paused', audio.paused);
      audio.setAttribute('class', 'ueditorAudio');
      // console.log('audio 播放状态', audio, audio.paused, audio.ended)
    }
    
    // 修复空格无法显示的问题
    const setNodesSpace = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType === Node.TEXT_NODE) {
          nodes[i].textContent = nodes[i].textContent.replace(/[ ]/g, '\u00a0');
        } else if (nodes[i].childNodes.length > 0) {
          setNodesSpace(nodes[i].childNodes);
        }
      }
    };
    setNodesSpace(this.ueditorRef.body.childNodes);
    
    // 读取背景
    let background = window.getComputedStyle(this.ueditorRef.body).background;
    let editorHtml = this.ueditorRef.body.innerHTML;

    //移除 contenteditable 不可编辑防止报错
    editorHtml = editorHtml
      .replace(/&#8203;/g, '')
      .replace(/contenteditable="false"/g, '')
      .replace(/<style>(([\s\S])*?)<\/style>/g, '')
      .replace(/<br><\/br>/g, '')
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '');

    if (this.state.isRead) {
      const { simp, trad } = this.renderPinyin(editorHtml);

      const div = document.createElement('div');
      div.innerHTML = this.props.htmlContent;
      div.getElementsByClassName('simp-p')[0].innerHTML = simp;
      div.getElementsByClassName('trad-p')[0].innerHTML = trad;

      //editorHtml = this.renderTradStyle(editorHtml);
      div.innerHTML = div.innerHTML.replace(/<style>(.*?)<\/style>/g, '');
      div.innerHTML = div.innerHTML.replace(/<p>(.*?)<\/p>/g, '');

      this.setState({ rendering: false });

      const textWrapper = div.getElementsByClassName('text-style-wrapper');

      for (let i = 0; i < textWrapper.length; i++) {
        // 去掉外层
        textWrapper[i].outerHTML = textWrapper[i].innerHTML;
      }

      // 加入文字属性包裹层
      div.innerHTML = `<div class="text-style-wrapper" style="${
        this.ueditorRef.body.style.lineHeight
          ? `line-height: ${this.ueditorRef.body.style.lineHeight};`
          : ''
      }${
        this.ueditorRef.body.style.letterSpacing
          ? `letter-spacing: ${this.ueditorRef.body.style.letterSpacing};`
          : ''
      }${
        this.ueditorRef.body.style.writingMode
          ? `writing-Mode: ${this.ueditorRef.body.style.writingMode};`
          : ''
      }${
        this.ueditorRef.body.style.textAlign
          ? `text-align: ${this.ueditorRef.body.style.textAlign};`
          : ''
      }" >${div.innerHTML}</div>`;

      // 存入背景
      this.props.saveUeditorContent(div.innerHTML, background);
    } else {
      Api.getPinyinContent({ text: [editorHtml] }).then((result) => {
        if (result.state !== false) {
          let { simplified, traditional, pinyin } = result[0];

          let pinyinTexts = [];
          let tradTexts = [];
          let simpTexts = [];

          for (let i = 0; i < pinyin.length; i++) {
            if (pinyin[i] && !simpTexts.includes(simplified[i])) {
              pinyinTexts.push(pinyin[i]);
              tradTexts.push(traditional[i]);
              simpTexts.push(simplified[i]);
            }
          }

          let tradiInnerHtml = editorHtml;

          for (let i = 0; i < simpTexts.length; i++) {
            editorHtml = editorHtml.replace(
              new RegExp(simpTexts[i], 'g'),
              `<ruby><rb>${simpTexts[i]}</rb><rt>${pinyinTexts[i]}</rt></ruby>`
            );
            tradiInnerHtml = tradiInnerHtml.replace(
              new RegExp(simpTexts[i], 'g'),
              `<ruby><rb>${tradTexts[i]}</rb><rt>${pinyinTexts[i]}</rt></ruby>`
            );
          }

          let outputHtml = `<div class="text-style-wrapper" style="${
            this.ueditorRef.body.style.lineHeight
              ? `line-height: ${this.ueditorRef.body.style.lineHeight};`
              : ''
          }${
            this.ueditorRef.body.style.letterSpacing
              ? `letter-spacing: ${this.ueditorRef.body.style.letterSpacing};`
              : ''
          }${
            this.ueditorRef.body.style.writingMode
              ? `writing-Mode: ${this.ueditorRef.body.style.writingMode};`
              : ''
          }${
            this.ueditorRef.body.style.textAlign
              ? `text-align: ${this.ueditorRef.body.style.textAlign};`
              : ''
          }"><div class="text-block text-block-fi">
          <div class="text simp-p">${editorHtml}</div>
          <div class="text trad-p">${tradiInnerHtml}</div>
          </div></div>`;

          // 存入背景
          this.props.saveUeditorContent(outputHtml, background);

          this.setState({ rendering: false });
        } else {
          message.error('Network error, please retry!', 3);

          this.setState({ rendering: false });
        }
      });
    }
  };

  render() {
    let { progress, editorResult,focusOnTable } = this.state;
    let lang = this.props.lang;
    ueditorConfig.lang = lang;
    const { trans } = this.props;
    let plugins = [
      this.lineHeight,
      this.InsertLinkPlugin,
      // 'insertLink',
      // 'dictionary',
      this.dictPlugin,
      this.photoGalleryPlugin,
      this.uploadAudioPlugin
    ]
    return (
      <Provider store={store}>
        <div className="ueditor-wraper">
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
              textAlign: 'center',
              zIndex: 9999,
              backgroundColor: 'rgba(255,255,255,0.5)',
              padding: 'calc(35vh - 10px) 0',
              boxSizing: 'border-box',
              display: this.state.rendering ? 'block' : 'none'
            }}
          >
            <Spin />
          </div>
          {JSON.stringify(this.trans)}
          <ReactUeditor
            debug={true}
            // config={ueditorConfig}
            getRef={this.getUeditor}
            ueditorPath="/ueditor"
            plugins={plugins}
            onChange={this.updateEditorContent}
            onReady={this.ueditorOnReady}
            progress={progress}
            multipleImagesUpload={false}
            extendControls={
              [
                // {
                //   name: 'chinese',
                //   menuText: '汉字',
                //   title: '汉字注音',
                //   // 图标定义，遵循 ueditor 的格式
                //   cssRules:
                //     'background: url(' +
                //     testIcon +
                //     ') !important; background-size: 20px 20px !important;',
                //   zIndex: 1,
                //   alignStyle: 'middle',
                //   component: <input onChange={this.handleInputChange} />,
                //   onConfirm: () => {
                //     // console.log('this.ueditorRef.selection.getText()',this.ueditorRef.selection.getText())
                //     let range = this.ueditorRef.selection.getRange();
                //     let textContent = range.cloneContents().textContent;
                //     let inputValue = this.state.inputValue;
                //     const rtArr = [];
                //     const inputArr = inputValue.split(' ');
                //     let len = textContent.length;
                //     for (let i = 0; i < len; i++) {
                //       if (inputArr[i]) {
                //         rtArr.push(
                //           `${textContent.charAt(i)}<rt>${inputArr[i]}</rt>`
                //         );
                //       } else {
                //         rtArr.push(`${textContent.charAt(i)}`);
                //       }
                //     }
                //     let insertHtml = `<ruby>${rtArr.join('')}</ruby>`;
                //     //this.ueditorRef.setContent(insertHtml,true)
                //     this.ueditorRef.execCommand('inserthtml', insertHtml, true);
                //   }
                // },
              ]
            }
          />
          <div className="ueditor-footer">
            <div
              onClick={() => {
                this.ueditorRef.body.removeEventListener(
                  'input',
                  this.ueditorBodyInput
                );
                this.saveUeditorContent(editorResult);
              }}
              className="ueditor-button ueditor-confirm"
            >
              {trans.UEditor.confirm}
            </div>
            <div
              onClick={() => {
                this.ueditorRef.body.removeEventListener(
                  'input',
                  this.ueditorBodyInput
                );
                this.props.closeDialog();
              }}
              className="ueditor-button ueditor-cancel"
            >
              {trans.UEditor.cancel}
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}

export default UEditor;
