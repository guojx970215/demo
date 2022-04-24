import React, { useState } from 'react';
import { connect } from 'react-redux';
import styles from './PageTemplateMenu.module.css';
import PageIcon from '../../icons/PageIcon';
import IconButton from '../MenuItems/IconButton';
import api from '../../api/bookApi';
import { message } from 'antd';
import {
  actShowPageTemplateList,
  actAddPageTemplateList,
  actShowTemplateList
} from '../../store/bookPages/actions';


import ThemePanel from '../ThemePanel/ThemePanel';

import { showPanel } from '../../store/userColor/userColor';
import Dialog from '../Dialog/Dialog';
import PageTemplateForm from './PageTemplateForm/PageTemplateForm';
import Toast from '../Toast/index';
import { actRemoveImage } from '../../store/bookPages/actions';
import { actSetDialog } from '../../store/imageList/imageList';
import PageTemplate_Background from './PageTemplate_Background.png'
import PageTemplate_PageTemplate from './PageTemplate_PageTemplate.png'
import PageTemplate_SaveTemplate from './PageTemplate_SaveTemplate.png'
import PageTemplate_ThemeColor from './PageTemplate_ThemeColor.png'

const MainMenu = ({
  trans,
  bookPages,
  actSetImage,
  actRemoveImage,
  actSetDialog,
  showPanel,
  getPageTemplates,
  saveAsTemplate
}) => {
  const { present } = bookPages;
  let currentId = bookPages.showingPageId;
  let currentPage = present.pages.find(item => {
    return item.id === currentId;
  });
  let removeBackgroundButton =
    currentPage.config && currentPage.config.image ? true : false;
  return (
    <div className={styles.pageMenuPane}>
      {/*<div>
        <ThemePanel
          isAll={false}
          text={trans.HomeMenu.ThemeTxt}
          onClickCallback={showPanel}
          left={true}
        />
      </div>
      <div>
        <IconButton
          text={trans.PageMenu.background}
          onClickCallback={() => {
            actSetImage(false);
          }}
        >
          <img src={PageTemplate_Background} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
      </div>
      <div style={{ display: removeBackgroundButton ? 'block' : 'none' }}>
        <IconButton
          text={trans.PageMenu.backgroundRemove}
          onClickCallback={() => {
            actRemoveImage(false);
          }}
        >
          <img src={PageTemplate_Background} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
      </div>
      <div>
        <IconButton
          text={trans.PageMenu.pageTemplates}
          onClickCallback={getPageTemplates(bookPages, 1)}
        >
          <img src={PageTemplate_PageTemplate} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
      </div>
      <div>
        <IconButton
          text={trans.PageMenu.saveAsTemplate}
          onClickCallback={() => saveAsTemplate(bookPages)}
        >
          <img src={PageTemplate_SaveTemplate} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
        </div>*/}
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
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
            tags: tags.split(' '),
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
      closeDialog: () => { }
    });
  }
});

const mapStateToProps = ({ trans, bookPages }) => ({
  trans,
  bookPages
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainMenu);
