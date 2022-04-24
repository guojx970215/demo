import React, { useState, useEffect } from "react";
import { Icon, Tag, Select, Modal, message } from 'antd';
import { connect } from "react-redux";
import styles from "./TemplateCard.module.css";
import htmlReactParser from 'html-react-parser';
import {
  actAddElement, actAddTemplateToPage, actAddTemplateList, actAddComposeElement, actAddPageElement, actAddComposeTemplateList, actAddPageTemplateList, actShowTemplateList, actShowPageTemplateList
} from "../../store/bookPages/actions";
import { ElementTypes } from '../../constants';
import api from "../../api/bookApi"
import topImg from './top.png'
const { CheckableTag } = Tag;
const { Option } = Select;
const TemplateCardList = ({
  type = "templates",
  trans,
  bookPages,
  applyTemplate,
  applyTemplateToPage,
  getElementTemplates,
  hideElementTemplate,
  applyComposeTemplate,
  applyPageTemplate,
  tempClick
}) => {

  const showTemplate = bookPages.showTemplate || bookPages.showAudio || bookPages.showComposeTemplate || bookPages.showPageTemplate

  const [tag, setTag] = useState('全部');
  const [tags, setTags] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('name');

  let templateItems;

  useEffect(() => {
    getTags()
  }, [showTemplate])

  const deleteEleTemplate = (id)=>{
    Modal.confirm({
      title:'delete',
      content:'confirm to delete?',
      onOk:async ()=>{
        await api.deleteElementTemplatDetail(id)
        message.success('delete success')
        getElementTemplates(1, searchName, bookPages, searchType)
      }
    })
  }
  const deletePageTemplate = (id)=>{
    Modal.confirm({
      title:'delete',
      content:'confirm to delete?',
      onOk:async ()=>{
        await api.deletePageTemplatDetail(id)
        message.success('delete success')
        getElementTemplates(1, searchName, bookPages, searchType)
      }
    })
  }

  const setTop = (id) => {
    if (bookPages.showPageTemplate) {
      let pageTemplates = bookPages.pageTemplates
      let page = pageTemplates.find((ele) => ele.isTop)
      if (page) {
        api.pageTemplateSetTop(page.id, false).then((res) => {
          // console.log('setTop showPageTemplate', res)
          if (res.state) {
            api.pageTemplateSetTop(id, true).then((res) => {
              // console.log('setTop showPageTemplate', res)
              if (res.state) {
                getElementTemplates(1, '', bookPages, searchType)
              }
            })
          }
        })
      } else {
        api.pageTemplateSetTop(id, true).then((res) => {
          // console.log('setTop showPageTemplate', res)
          if (res.state) {
            getElementTemplates(1, '', bookPages, searchType)
          }
        })
      }
    } else if (bookPages.showTemplate) {
      let templates = bookPages.templates
      let template = templates.find((ele) => ele.isTop)
      if (template) {
        api.elementTemplateSetTop(template.id, false).then((res) => {
          api.elementTemplateSetTop(id, true).then((res) => {
            getElementTemplates(1, '', bookPages, searchType)
          })
        })
      } else {
        api.elementTemplateSetTop(id, true).then((res) => {
          getElementTemplates(1, '', bookPages, searchType)
        })
      }
    }
  }

  // console.log('bookPages.templates', bookPages.templates)
  if (bookPages.showTemplate && bookPages.templates) {
    // 元素模板
    templateItems = bookPages.templates.map((temp, index) => (
      <li
        key={temp.id}
        className={styles.listItem}
        data-key={temp.id}
        data-id={temp.id}
        onClick={() => {
          api.getElementTemplatDetail(temp.id).then(
            res => {
              console.log('getElementTemplatDetail', res)
              applyTemplateToPage(res)
            }
          );
        }}>
        {
          (temp.templateName || temp.name) &&
          <span style={{
            position: 'absolute',
            top: 10,
            left: 10,
            fontSize: 12,
            color: '#fff',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: 2,
            borderRadius: 2
          }}>{temp.templateName || temp.name}</span>
        }
        <img style={{width: '100%', maxHeight: '100%'}} src={temp.templateImg} />
        <img className={styles.cardTop} src={topImg} onClick={(e) => {
          e.stopPropagation();
          setTop(temp.id)
        }} />
        <Icon style={{
          position: 'absolute',
          bottom: 10,
          right: 10
        }} type="close" onClick={(e)=>{
          e.stopPropagation();
          deleteEleTemplate(temp.id)
        }}/>
      </li>
    ))
  }
  if (bookPages.showComposeTemplate && bookPages.composeTemplates) {
    templateItems = bookPages.composeTemplates.map((temp, index) => (
      <li
        key={temp.id}
        className={styles.listItem}
        data-key={temp.id}
        data-id={temp.id}
        onClick={() => applyComposeTemplate(temp)}>
        {
          (temp.templateName || temp.name) &&
          <span style={{
            position: 'absolute',
            top: 10,
            left: 10,
            fontSize: 12,
            color: '#fff',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: 2,
            borderRadius: 2
          }}>{temp.templateName || temp.name}</span>
        }
        <img style={{ width: '100%', height: '100%' }} src={temp.thumb} />
      </li>
    ));
  }
  if (bookPages.showPageTemplate && bookPages.pageTemplates) {
    templateItems = bookPages.pageTemplates.map((temp, index) => (
      <li
        key={temp.id}
        className={styles.listItem}
        data-key={temp.id}
        data-id={temp.id}
        onClick={() => applyPageTemplate(temp)}>
        {
          (temp.templateName || temp.name) &&
          <span style={{
            position: 'absolute',
            top: 10,
            left: 10,
            fontSize: 12,
            color: '#fff',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: 2,
            borderRadius: 2
          }}>{temp.templateName || temp.name}</span>
        }
        <img style={{ width: '100%', height: '100%' }} src={temp.thumb} />
        <img className={styles.cardTop} src={topImg} onClick={(e) => {
          e.stopPropagation();
          setTop(temp.id)
        }} />
        <Icon style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10
                }} type="close" onClick={(e)=>{
                  e.stopPropagation();
                  deletePageTemplate(temp.id)
                }}/>
      </li>
    ));
  }

  if (bookPages.showAudio && bookPages.audios) {
    templateItems = bookPages.audios.map((temp, index) => (
      <li
        key={temp.id}
        className={styles.listItem}
        data-key={temp.id}
        data-id={temp.id}
        onClick={() => applyPageTemplate(temp)}>
          {
            (temp.templateName || temp.name) &&
            <span style={{
              position: 'absolute',
              top: 10,
              left: 10,
              fontSize: 12,
              color: '#fff',
              background: 'rgba(0, 0, 0, 0.5)',
              padding: 2,
              borderRadius: 2
            }}>{temp.templateName || temp.name}</span>
          }
        <img style={{ width: '100%', height: '100%' }} src={temp.thumb} />
        <img className={styles.cardTop} src={topImg} onClick={(e) => tempClick(bookPages.pageTemplates, temp.id, e)} />
      </li>
    ));
  }

  const getTags = () => {
    if (bookPages.showTemplate) {
      api.getElementTags().then((res) => {
        // console.log('getTags', res)
        setTags(res)
      })
    }
    if (bookPages.showPageTemplate) {
      api.getPageTemplateTags().then((res) => {
        // console.log('getTags', res)
        setTags(res)
      })
    }
  }

  const onSearchInput = (e) => {
    e.persist()
    let inputValue = e.target.value
    setSearchName(inputValue)
  }
  const onSearchTagHandler = (e) => {
    getElementTemplates(1, searchName, bookPages, 'name')
  }
  const tagChange = (tag) => {
    setTag(tag)
    tag = tag === '全部' ? '' : tag
    getElementTemplates(1, tag, bookPages, 'tag')
  }

  return (
    <div className={showTemplate ? `${styles.elementsWrapper} ${styles.elementsWrapperOpen}` : styles.elementsWrapper}>
      <div className={styles.inputGroup}>
        <input type="text" 
          onKeyUp={onSearchInput} className={styles.searchInput} placeholder="search name" aria-describedby="sizing-addon1"></input>
        <span style={{
            flex: '0 0 60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            backgroundColor: '#3290fc',
            borderRadius: '0 15px 15px 0',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          onClick={onSearchTagHandler}>
            search
        </span>
        <div className={styles.closeIcon}>
          <Icon type="close"
            style={{
              color: '#fff',
              fontSize: '16px',
              marginLeft: '10px'
            }}
            onClick={() => {
              hideElementTemplate(bookPages)
            }} />
        </div>
      </div>
      <div className={styles.tags}>
        标签：
        <CheckableTag
          checked={tag === '全部'}
          onChange={() => tagChange('全部')}
        >
          全部
        </CheckableTag>
        {tags.map(item => {
          return (
            <CheckableTag
              key={item}
              checked={tag === item}
              onChange={() => tagChange(item)}
            >
              {item}
            </CheckableTag>
          );
        })}
      </div>
      <ul className={styles.list}
        style={{
          // height: 'calc(100% - 40px)'
        }}>
        {templateItems}
      </ul>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  tempClick: (array, id, e) => {
    e.stopPropagation();
    let pageTemplatesSort = [];
    if (localStorage.getItem('pageTemplatesSort')) {
      pageTemplatesSort = JSON.parse(localStorage.getItem('pageTemplatesSort'));
      pageTemplatesSort.forEach((item, index) => {
        if (item == id) {
          pageTemplatesSort.splice(index, 1);
        }
      });
      pageTemplatesSort.unshift(id)
    } else {
      array.forEach(v => {
        if (v.id == id) {
          pageTemplatesSort.unshift(v.id)
        } else {
          pageTemplatesSort.push(v.id)
        }
      })
    }
    dispatch(actAddPageTemplateList(array));
    // localStorage.setItem('pageTemplatesSort', JSON.stringify(pageTemplatesSort));
  },
  applyTemplate: template => {
    dispatch(actAddElement(ElementTypes.templateCard, template))
  },
  applyTemplateToPage: template => {
    dispatch(actAddTemplateToPage(template))
  },
  applyComposeTemplate: template => {
    dispatch(actAddComposeElement(ElementTypes.composeTemplates, template))
  },
  applyPageTemplate: template => {
    dispatch(actAddPageElement(ElementTypes.pageTemplates, template))
  },
  getElementTemplates: async (page = 1, search = '', bookPages, searchType) => {
    if (bookPages.showTemplate) {
      api.getElementTemplates(search, searchType).then(res => {
        console.log('获取元素模板', res)
        dispatch(actAddTemplateList(res));
      });
    }
    if (bookPages.showPageTemplate) {
      api.getPageTemplates(page, search, searchType).then(res => {
        if (res.state) {
          console.log('获取元素模板', res)
          dispatch(actShowTemplateList());
          dispatch(actAddPageTemplateList(res.result.items));
          dispatch(actShowPageTemplateList());
          dispatch(actShowPageTemplateList());
        }
      })
    }
    if (bookPages.showComposeTemplate) {
      api.getComposeElementTemplates(page, search).then(res => {
        dispatch(actAddComposeTemplateList(res.data.templates));
      })
    }

  },
  hideElementTemplate: (bookPages) => {
    if (bookPages.showTemplate) {
      dispatch(actShowTemplateList());
    } else if (bookPages.showPageTemplate) {
      dispatch(actShowPageTemplateList());
    }
  }
});

const mapStateToProps = ({ trans, bookPages }) => ({
  trans,
  bookPages
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateCardList);
