import React, { useState } from 'react';
import domtoimage from 'dom-to-image-more';
import { connect } from 'react-redux';
import styles from './ElementsMenu.module.css';
// import ComposeTemplateForm from './ComposeTemplateForm/ComposeTemplateForm';
import ElementTemplateForm from './ElementTemplateForm/ElementTemplateForm';
import {
  actAddElement,
  copyElement,
  deleteElement,
  actElementPaneShow,
  actElementPaneHide,
  actAddTemplateList,
  actShowTemplateList,
  actShowComposeTemplateList,
  actAddComposeTemplateList,
  actSetPageBackground
} from '../../store/bookPages/actions';
import { actToggleSlideBar } from '../../store/slideBar/slider';
import { ElementTypes } from '../../constants';
import IconButton from '../MenuItems/IconButton';
import Dialog from '../Dialog/Dialog';
import MyLeaflet from '../MyLeaflet/MyLeaflet';
import api from '../../api/bookApi';
import Elements_ComposeTemplate from './Elements_ComposeTemplate.png';
import Elements_Delete from './Elements_Delete.png';
import PageTemplate_SaveTemplate from './PageTemplate_SaveTemplate.png';
import Elements_TemplatesCard from './Elements_TemplatesCard.png';
import Elements_TextBox from './Elements_TextBox.png';
import { Icon, message } from 'antd';
import Home_PhotoGallery from '../HomeMenu/Home_PhotoGallery.png';
import PhotoGallery from '../HomeMenu/PhotoGallery/ModalList';
import MusicModalList from '../AudioMenu/components/ModalList';
import Pages_uoloadVideo from '../PageMenu/uploadVideo.png';
import Audio_AllMusic from '../AudioMenu/Audio_AllMusic.png';
import UploadVideo from '../PageMenu/UploadVideo/UploadVideo';

const ElementsMenu = ({
  trans,
  bookPages,
  addElement,
  copyElement,
  deleteElement,
  getElementTemplates,
  saveAsTemplate,
  getComposeTemplates,
  addElement1,
  setPageBg
}) => {
  const [state, setState] = useState({
    visibleList: false,
    uploadAudioShow: false,
    uploadVideoShow: false,
    visibleMusic: false
  });
  let { visibleList, visibleMusic } = state;

  const showModalUploadVideo = () => {
    setState({
      uploadVideoShow: true
    });
  };

  const cancelModalUploadVideo = () => {
    setState({
      uploadVideoShow: false
    });
  };

  const showModalList = () => {
    setState({
      visibleList: true
    });
  };
  const showMusicModal = () => {
    setState({
      visibleMusic: true
    });
  };

  const cancalModalList = () => {
    setState({
      visibleList: false
    });
  };
  const cancalMusicModalList = () => {
    setState({
      visibleMusic: false
    });
  };

  return (
    <div className={styles.eletmentsMenuPane}>
      <IconButton
        text={trans.ElementsMenu.textbox}
        onClickCallback={addElement(ElementTypes.textBox)}
      >
        <img src={Elements_TextBox} style={{ width: '36px', height: 'auto' }} />
      </IconButton>
      <IconButton
        text={trans.ElementsMenu.photoGallery}
        onClickCallback={showModalList}
      >
        <img
          src={Home_PhotoGallery}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton>
      <IconButton
        text={trans.ElementsMenu.allMusic}
        onClickCallback={showMusicModal}
      >
        <img src={Audio_AllMusic} style={{ width: '36px', height: 'auto' }} />
      </IconButton>
      <IconButton
        text={trans.PageMenu.uploadVideo}
        onClickCallback={showModalUploadVideo}
      >
        <img
          src={Pages_uoloadVideo}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton>
      <IconButton text="copy" onClickCallback={copyElement('CtrlC')}>
        <Icon
          type="copy"
          theme={bookPages.selectElementId ? 'twoTone' : 'outlined'}
          style={{ fontSize: 32, color: "#f2f2f2" }}
        />
      </IconButton>
      <IconButton text="paste" onClickCallback={copyElement('CtrlV')}>
        <Icon
          type="diff"
          theme={bookPages.onPasteId ? 'twoTone' : 'outlined'}
          style={{ fontSize: 32, color: "#f2f2f2" }}
        />
      </IconButton>
      <IconButton
        text={trans.ElementsMenu.delete}
        onClickCallback={deleteElement()}
      >
        <img src={Elements_Delete} style={{ width: '36px', height: 'auto' }} />
      </IconButton>
      <IconButton
        text={trans.ElementsMenu.templatesCard}
        onClickCallback={getElementTemplates(bookPages, 1)}
      >
        <img
          src={Elements_TemplatesCard}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton>
      <IconButton
        text={trans.ElementsMenu.saveAsTemplate}
        onClickCallback={() => saveAsTemplate(trans, bookPages)}
      >
        <img
          src={PageTemplate_SaveTemplate}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton>
      <IconButton
        text={trans.ElementsMenu.composeTemplates}
        onClickCallback={getComposeTemplates(bookPages, 1)}
      >
        <img
          src={Elements_ComposeTemplate}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton>
      <PhotoGallery
        trans={trans}
        onCancal={cancalModalList}
        visible={visibleList}
        isEdit={false}
        addElement={addElement1}
        setPageBg={setPageBg}
      />
      <MusicModalList
        trans={trans}
        onCancal={cancalMusicModalList}
        visible={visibleMusic}
        addElement={addElement1}
      />
      <UploadVideo
        trans={trans}
        handleCancel={cancelModalUploadVideo}
        visible={state.uploadVideoShow}
        addElement={addElement1}
      />
    </div>
  );
};

const mapStateToProps = ({ trans, bookPages, slider }) => ({
  trans,
  bookPages,
  slider
});

const mapDispatchToProps = dispatch => ({
  setPageBg: image => {
    dispatch(actSetPageBackground(image));
  },
  addElement: type => {
    return e => {
      dispatch(actAddElement(type));
    };
  },
  addElement1: (type, content) => {
    dispatch(actAddElement(type, content));
  },
  copyElement: key => {
    return () => {
      dispatch(copyElement(key));
    };
  },
  deleteElement: () => {
    return () => {
      dispatch(deleteElement({}));
    };
  },
  elementPaneToggle: slider => {
    return () => {
      if (slider.show) {
        dispatch(actElementPaneShow());
      } else {
        dispatch(actElementPaneHide());
      }
      // dispatch(actElementPaneToggle({slider}));
      dispatch(actToggleSlideBar());
    };
  },
  getElementTemplates: (bookPages, page = 1, search = '') => {
    return () => {
      if (bookPages.showTemplate) {
        dispatch(actShowTemplateList());
      } else {
        api.getElementTemplates(search).then(res => {
          console.log('获取元素模板', res);
          bookPages.showComposeTemplate &&
            dispatch(actShowComposeTemplateList()); //关闭组合模板
          dispatch(actAddTemplateList(res));
          dispatch(actShowTemplateList());
        });
      }
    };
  },
  getComposeTemplates: (bookPages, page = 1, search = '') => {
    return () => {
      if (bookPages.showComposeTemplate) {
        dispatch(actShowComposeTemplateList());
      } else {
        api.getComposeElementTemplates(page, search).then(res => {
          bookPages.showTemplate && dispatch(actShowTemplateList()); // 关闭普通模板
          dispatch(actAddComposeTemplateList(res.data.templates));
          dispatch(actShowComposeTemplateList());
        });
      }
    };
  },
  openMapDialog: () => {
    return () => {
      Dialog.open({
        childrens: [MyLeaflet],
        props: {
          onSaveMap: dataUrl => {
            //
            dispatch(actAddElement(ElementTypes.leafletMap, dataUrl));
            Dialog.close();
          },
          closeDialog: () => {
            Dialog.close();
          }
        },
        closeDialog: () => {
          console.log('关闭了dialog');
        }
      });
    };
  },
  // 保存为元素模板
  saveAsTemplate: (trans, bookPages) => {
    Dialog.open({
      childrens: [ElementTemplateForm],
      props: {
        lang: trans.id === 'en' ? 'en' : 'zh-cn',
        trans,
        onSave: data => {
          const { templateName, tags } = data;
          let templateImg = '';
          const { present, showingPageId } = bookPages;
          let curentPage = present.pages.find(ele => ele.id === showingPageId);
          if (curentPage.showElementPane) {
            let elements = curentPage.elements.filter(ele => {
              return ele.highlight;
            });
            
            if (elements.length > 0) {
              Dialog.close();
              return;
            }
            return;
          }
          let element = curentPage.elements.find(ele => ele.config.select);
          if (!element) {
            message.info('请选择要保存的元素');
            return false;
          }
          // console.log('保存为元素模板', element, document.getElementById(element.id));
          const templateElement = document.getElementById(element.id);
          domtoimage
            .toPng(templateElement, {
              scale: 0.6
            })
            .then(dataUrl => {
              // console.log('domtoimagedomtoimagedomtoimage', dataUrl);
              templateImg = dataUrl;
              let params = {
                ...element,
                templateName,
                tags: tags,
                templateImg: templateImg,
                userId: api.getUserId()
              };
              // console.log('curentPage', curentPage);
              api.saveAsElementTemplate(params).then(
                res => {
                  message.success('保存成功');
                },
                error => {
                  message.error('保存失败');
                }
              );
            });
          Dialog.close();
        },
        closeDialog: () => {
          Dialog.close();
        }
      },
      closeDialog: () => {}
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ElementsMenu);
