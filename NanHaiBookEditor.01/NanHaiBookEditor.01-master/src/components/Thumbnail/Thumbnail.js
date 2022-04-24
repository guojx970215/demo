import React, { useState } from 'react';
import { connect } from 'react-redux';
import styles from './Thumbnail.module.css';
import PropTypes from 'prop-types';
import Dialog from '../Dialog/Dialog';
import nanoid from 'nanoid';
import ColorBackGround from '../ColorPic/ColorBackGround';
import {
  actSetShowingPage,
  actRemovePage,
  actSortThumbnail,
  actAddPage,
  actCopyPage
} from '../../store/bookPages/actions';
import api from '../../api/bookApi';
import PageTemplateForm from '../PageTemplateMenu/PageTemplateForm/PageTemplateForm';
import { ReactSortable } from 'react-sortablejs';
import { message } from 'antd';

const Thumbnail = ({
  bookPages,
  selectPage,
  removePage,
  refreshPage,
  addPage,
  sortThumbnail,
  ui,
  actAddPage,
  actCopyPage,
  saveAsTemplate
}) => {
  const pages = bookPages.present.pages;

  const thumbItems = pages.map((page, index) => {
    let userSetStyle = {};

    let shudeStyle = {
      opacity: 0
    };
    // 背景色
    if (page.config && page.config.color) {
      page.config.color.type == 0
        ? (userSetStyle.backgroundColor = page.config.color.color)
        : (userSetStyle.background = `${page.config.color.color}`);
    }

    let shudeItem = null
    // 背景图
    if (page.config && page.config.image) {
      shudeStyle = {
        backgroundImage: `url(${page.config.image.url}`,
        backgroundRepeat: page.config.image.backgroundRepeat,
        backgroundSize: page.config.image.backgroundSize,
        opacity: 1 - page.config.image.opacity / 100
      };
      if (page.config.image.url === 'none') {
        shudeItem = page.config.image.picSet
      }
    }

    if (
      bookPages.present.config.isVertical === true ||
      localStorage.getItem('isVertical') === 'true'
    ) {
      userSetStyle.minHeight = '230px';
    }
    return (
      <li
        key={page.id}
        className={styles.ListItem}
        data-key={page.id}
        data-id={page.id}
        onClick={() => {
          selectPage(page.id);
        }}
      >
        <div
          style={userSetStyle}
          className={
            page.id === bookPages.showingPageId
              ? styles.itemPane + ' ' + styles.ThumbImgselected
              : styles.itemPane
          }
        >
          {!shudeItem && <div className={styles.shude} style={shudeStyle}></div>}
          {shudeItem && <ColorBackGround item={shudeItem} style={{
            position:'absolute'
          }}></ColorBackGround>}
          <img src={page.thumb} className={styles.ThumbImg} />
          <span className={styles.pageNo}>
            {index + 1}/{pages.length}
          </span>
          {pages.length > 1 ? (
            <i
              style={{
                display:
                  page.id === bookPages.showingPageId ? 'inline-block' : 'none'
              }}
              onClick={e => removePage(e, page.id)}
              className={styles.removePage}
            ></i>
          ) : (
              ''
            )}
          <i
            style={{
              display:
                page.id === bookPages.showingPageId ? 'inline-block' : 'none'
            }}
            onClick={e => saveAsTemplate(bookPages)}
            className={styles.collectPage}
          ></i>
          <i
            style={{
              display:
                page.id === bookPages.showingPageId ? 'inline-block' : 'none'
            }}
            onClick={e => actCopyPage(e, page.id)}
            className={styles.refreshPage}
          ></i>
          <i
            style={{
              display:
                page.id === bookPages.showingPageId ? 'inline-block' : 'none'
            }}
            onClick={e => refreshPage(e, index)}
            className={styles.addPage}
          ></i>
        </div>
      </li>
    );
  });

  return (
    <div className={styles.ThumbnailPane}>
      <ReactSortable
        tag="ul"
        className={styles.thumbList}
        list={pages}
        setList={(order, sortable, evt) => {
          sortThumbnail(order, sortable, evt);
        }}
      >
        {/* {thumbItems} */}
      </ReactSortable>
      {/* <ReactSortable 
        tag="ul"
        className={styles.thumbList}
        onChange={(order, sortable, evt) => {
          sortThumbnail(order, sortable, evt);
        }}
      >
        {thumbItems}
      </ReactSortable > */}
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  selectPage: pageId => {
    dispatch(actSetShowingPage(pageId));
  },
  removePage: (e, pageId) => {
    dispatch(actRemovePage(pageId));
    e.stopPropagation();
  },
  refreshPage: (e, index) => {
    dispatch(actAddPage({index}));
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
          if (curentPage.elements.length) {
            curentPage.elements.forEach(v => {
              delete v.id;
            });
          }
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
  },
  actAddPage: (e, pageId) => {
    dispatch(actAddPage({}));
  },
  actCopyPage: (e, pageId) => {
    dispatch(actCopyPage({}));
  },
  sortThumbnail: (newList, sortable, evt) => {
    dispatch(actSortThumbnail(newList));
    // dispatch(actSortThumbnail(evt.newIndex, evt.oldIndex));
  }
});

const mapStateToProps = ({ trans, bookPages, ui }) => ({
  trans,
  bookPages,
  ui
});
Thumbnail.propTypes = {
  bookPages: PropTypes.object,
  selectPage: PropTypes.func,
  removePage: PropTypes.func,
  sortThumbnail: PropTypes.func,
  ui: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(Thumbnail);
