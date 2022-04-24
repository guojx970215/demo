import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './PageMenu.module.css';
import domtoimage from 'dom-to-image-more';
import IconButton from '../MenuItems/IconButton';
import CheckBox from '../MenuItems/CheckBox';
import {
  actAddPage,
  actCopyPage,
  actIsVertical,
  actShowPageTemplateList,
  actAddPageTemplateList,
  actShowTemplateList,
  actAddElement
} from '../../store/bookPages/actions';
import { rulerChange } from '../../store/ruler/ruler';
import { gridChange } from '../../store/grid/grid';
import { showMusicDialog, showMusicPanel } from '../../store/music/music';
import { Icon } from 'antd';

import { PageLayouts } from '../../constants';

import MusicPanel from '../Music/MusicPanel';
import UploadAudio from './UploadAudio/UploadAudio';
import Pages_AddMusic from './Pages_AddMusic.png';
import Pages_CopyPage from './Pages_CopyPage.png';
import Pages_Grid from './Pages_Grid.png';
import Pages_Horizon from './Pages_Horizon.png';
import Pages_NewPage from './Pages_NewPage.png';
import Pages_Ruler from './Pages_Ruler.png';
import Pages_uoloadVideo from './uploadVideo.png';
import Pages_uoloadAudio from './uploadAudio.png';
import Audio_BackgroundMusic from './Audio_BackgroundMusic.png';

import api from '../../api/bookApi';
import { message } from 'antd';
import ThemePanel from '../ThemePanel/ThemePanel';
import FontControl from '../FontControl/FontControl';
import styles2 from './PageTemplateMenu.module.css';
import { showPanel } from '../../store/userColor/userColor';
import Dialog from '../Dialog/Dialog';
import PageTemplateForm from './PageTemplateForm/PageTemplateForm';
import { actRemoveImage } from '../../store/bookPages/actions';
import { actSetDialog } from '../../store/imageList/imageList';
import PageTemplate_Background from './PageTemplate_Background.png';
import PageTemplate_PageTemplate from './PageTemplate_PageTemplate.png';
import PageTemplate_SaveTemplate from './PageTemplate_SaveTemplate.png';
import PageTemplate_ThemeColor from './PageTemplate_ThemeColor.png';

const MainMenu = ({
  trans,
  actAddPage,
  actCopyPage,
  actIsVertical,
  bookPages,
  ruler,
  rulerChange,
  grid,
  gridChange,
  showMusicPanel,
  showMusicDialog,
  actSetMusic,
  actSetImage,
  actRemoveImage,
  actSetDialog,
  showPanel,
  getPageTemplates,
  saveAsTemplate,
  saveGroupTemplate,
  addElement
}) => {
  const { present } = bookPages;
  const { config } = present || {};
  const { isVertical } = config || {};
  // let currentId = bookPages.showingPageId;
  // let currentPage = present.pages.find(item => {
  //   return item.id === currentId;
  // });
  // let removeBackgroundButton =
  //   currentPage.config && currentPage.config.image ? true : false;

  const [removeBackgroundButton, setRemoveBackgroundButton] = useState(false);

  useEffect(() => {
    let currentPage = present.pages.find(item => {
      return item.id === bookPages.showingPageId;
    });
    if (currentPage) {
      setRemoveBackgroundButton(currentPage.config && currentPage.config.image ? true : false);
    }
  }, [bookPages.showingPageId]);
  return (
    <div className={styles.pageMenuPane}>
      <IconButton text={trans.PageMenu.newPage} onClickCallback={actAddPage}>
        <img src={Pages_NewPage} style={{ width: '36px', height: 'auto' }} />
      </IconButton>
      <IconButton text={trans.PageMenu.copyPage} onClickCallback={actCopyPage}>
        <img src={Pages_CopyPage} style={{ width: '36px', height: 'auto' }} />
      </IconButton>
      {/*<IconButton
        text={isVertical ? trans.PageMenu.vertical : trans.PageMenu.horizontal}
        onClickCallback={() => {
          actIsVertical(!isVertical);
        }}
      >
        <img src={Pages_Horizon} style={{ width: '36px', height: 'auto' }} />
      </IconButton>*/}
      {/*<CheckBox
        text={trans.PageMenu.ruler}
        checked={ruler.flag}
        onClickCallback={rulerChange}
      >
        <img src={Pages_Ruler} style={{ width: '36px', height: 'auto' }} />
      </CheckBox>
      <CheckBox
        text={trans.PageMenu.grid}
        checked={grid.flag}
        onClickCallback={gridChange}
      >
        <img src={Pages_Grid} style={{ width: '36px', height: 'auto' }} />
      </CheckBox>
      */}

      {/* <div>
        <IconButton
          text={trans.PageMenu.music}
          onClickCallback={() => {
            actSetMusic(true);
          }}
        >
          <img src={Pages_AddMusic} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
      </div> */}
      <div>
        {/* <MusicPanel
          text={trans.PageMenu.music_manage}
          onClickCallback={showMusicPanel}
        /> */}

        {/* <IconButton text={trans.PageMenu.music} onClickCallback={showMusicPanel}>
        <img
          src={Pages_AddMusic}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton> */}
      </div>
      {/*<div>
        <IconButton
          text={trans.PageMenu.music}
          onClickCallback={() => {
            actSetMusic(true);
          }}
        >
          <img src={Audio_BackgroundMusic} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
      </div>*/}
      <div>
        <ThemePanel
          isAll={false}
          text={trans.PageMenu.ThemeTxt}
          onClickCallback={showPanel}
          left={true}
        />
      </div>
      <div>
        <IconButton
          text={trans.PageMenu.background}
          onClickCallback={() => {
            setRemoveBackgroundButton(true);
            actSetImage(false);
          }}
        >
          <img
            src={PageTemplate_Background}
            style={{ width: '36px', height: 'auto' }}
          />
        </IconButton>
      </div>
      <div>
        <FontControl isAll={false} text={trans.PageMenu.FontTxt} />
      </div>
      <div style={{ display: removeBackgroundButton ? 'block' : 'none' }}>
        <IconButton
          text={trans.PageMenu.backgroundRemove}
          onClickCallback={() => {
            setRemoveBackgroundButton(false);
            actRemoveImage(false);
          }}
        >
          <img
            src={PageTemplate_Background}
            style={{ width: '36px', height: 'auto' }}
          />
        </IconButton>
      </div>
      <div>
        <IconButton
          text={trans.PageMenu.pageTemplates}
          onClickCallback={getPageTemplates(bookPages, 1)}
        >
          <img
            src={PageTemplate_PageTemplate}
            style={{ width: '36px', height: 'auto' }}
          />
        </IconButton>
      </div>
      <div>
        <IconButton
          text={trans.PageMenu.saveAsTemplate}
          onClickCallback={() => saveAsTemplate(bookPages)}
        >
          <img
            src={PageTemplate_SaveTemplate}
            style={{ width: '36px', height: 'auto' }}
          />
        </IconButton>
      </div>
      <div>
        <IconButton
          text={trans.PageMenu.saveGroupTemplate}
          onClickCallback={() => saveGroupTemplate(bookPages)}
        >
           <Icon 
             type="box-plot" 
             theme={bookPages.selectElementId && bookPages.selectElementId.includes('group:')  ? 'twoTone' : 'outlined'}
             style={{ fontSize: 32, color: "#f2f2f2" }}
          />
        </IconButton>
      </div>
    </div>
  );
};

const portraitSize = PageLayouts.portrait;
const landscapeSize = PageLayouts.landscape;

const mapDispatchToProps = dispatch => ({
  addElement: (type, content) => {
    dispatch(actAddElement(type, content));
  },
  actAddPage: () => {
    dispatch(actAddPage({}));
  },
  actCopyPage: () => {
    dispatch(actCopyPage());
  },
  actIsVertical: isVertical => {
    dispatch(actIsVertical(isVertical));
  },
  rulerChange: () => {
    dispatch(rulerChange());
  },
  gridChange: () => {
    dispatch(gridChange());
  },
  actSetMusic: setAll => {
    dispatch(showMusicDialog(setAll));
    dispatch({
      type: 'setMusic',
      payload: {
        mediaCategory: 2,
        page: 1,
        pageSize: 10
      }
    });
  },
  showMusicPanel: () => {
    dispatch(showMusicPanel());
  },
  actRemoveImage: removeAll => {
    dispatch(actRemoveImage(removeAll));
  },
  actSetImage: setAll => {
    dispatch(actSetDialog(setAll));
    dispatch({
      type: 'setImage',
      payload: {
        ext: '',
        page: 1,
        pageSize: 12,
        tag: ''
      }
    });
  },
  showPanel: () => {
    dispatch(showPanel());
  },
  getPageTemplates: (bookPages, page = 1, search = '') => {
    return () => {
      if (bookPages.showPageTemplate) {
        dispatch(actShowPageTemplateList());
      } else {
        api.getPageTemplates(page, search).then(res => {
          if (res.state) {
            bookPages.showTemplate && dispatch(actShowTemplateList());
            dispatch(actAddPageTemplateList(res.result.items));
            dispatch(actShowPageTemplateList());
          }
        });
      }
    };
  },
  saveAsTemplate: bookPages => {
    Dialog.open({
      childrens: [PageTemplateForm],
      props: {
        onSave: data => {
          const { templateName, tags } = data;
          let { showingPageId, present } = bookPages;
          let curentPage = present.pages.filter(page => {
            return page.id === showingPageId;
          })[0];
          let params = {
            ...curentPage,
            templateName,
            tags: tags,
            userId: api.getUserId()
          };
          console.log('curentPage', curentPage);
          api.saveAsPageTemplate(params).then(
            res => {
              message.success('保存成功');
            },
            error => {
              message.error('保存失败');
            }
          );
          Dialog.close();
        },
        closeDialog: () => {
          Dialog.close();
        }
      },
      closeDialog: () => {}
    });
  },
  saveGroupTemplate: bookPages => {
    if (!bookPages.selectElementId.includes("group:")) return;
    const groupName = bookPages.selectElementId.replace('group:', '');
    Dialog.open({
      childrens: [PageTemplateForm],
      props: {
        onSave: data => {
          const { templateName, tags } = data;
          let { showingPageId, present } = bookPages;
          let curentPage = present.pages.find(page => page.id === showingPageId);
          const elements = curentPage.elements.filter(
            element => element.config.groupName === groupName
          );

          const templateElements = document.getElementById(`group_${groupName}`);
          let templateImg = "";
          domtoimage
            .toPng(templateElements, {
              scale: 0.6
            })
            .then(dataUrl => {
              templateImg = dataUrl;
          
              let params = {
                id: bookPages.selectElementId,
                elements,
                config: {},
                thumb: templateImg,
                templateName,
                tags: tags.includes('group') ? tags : ['group', ...tags],
                userId: api.getUserId()
              };
              
              api.saveAsPageTemplate(params).then(
                res => {
                  message.success('保存分组成功');
                },
                error => {
                  message.error('保存分组失败');
                }
              );
              Dialog.close();
            });
        },
        closeDialog: () => {
          Dialog.close();
        }
      },
      closeDialog: () => {}
    });
  },
});

const mapStateToProps = ({ trans, bookPages, ruler, grid }) => ({
  trans,
  bookPages,
  ruler,
  grid
});

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
