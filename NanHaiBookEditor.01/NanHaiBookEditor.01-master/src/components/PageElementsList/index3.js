import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Modal, message, Input, Upload } from 'antd';
import { Sortable, MultiDrag } from 'sortablejs';
import { ReactSortable } from "react-sortablejs";
import styles from './PageElements.module.css';
import './PageElementsList.css';
// Sortable.mount(new MultiDrag());
const { Dragger } = Upload;

import {
  actSortElement,
  actToggleElement,
  actHighlightElement,
  actUnhighlightElement,
  actElementPaneHide,
  actAddElementsGroup,
  actDeleteElementsGroup,
  actSetElementsGroup,
  actSelectElement,
  actSetSelectGroup,
  actAddElement,
  actRenameElement,
  actRenameGroup,
} from '../../store/bookPages/actions';

import { actHideSlideBar, actShowSlideBar } from '../../store/slideBar/slider';

const ElementName = (props) => {
  const { id, name, cb, isGroup } = props;
  const [onChange, setOnChange] = useState(false);
  const [tempName, setTempName] = useState(name);
  const inputDom = useRef(null);

  const confirmChange = () => {
    cb(id, tempName);
    setOnChange(false);
  };

  const changeName = () => {
    setOnChange(true);
  };

  useLayoutEffect(() => {
    if (onChange) {
      inputDom.current.focus();
    }
  }, [onChange]);

  return onChange ? (
    <Input
      value={tempName}
      onChange={(value) => setTempName(value.target.value)}
      size="small"
      onBlur={confirmChange}
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          confirmChange();
        }
      }}
      ref={inputDom}
      className="name-input"
    />
  ) : isGroup ? (
    <div className="group-name ignore-elements" onDoubleClick={changeName}>
      {tempName}
    </div>
  ) : (
    <span className={styles.text} onDoubleClick={changeName}>
      {tempName}
    </span>
  );
};

const GroupElements = (props) => {
  const { setFocus } = props;
  const [fold, setFold] = useState(false);
  const [show, setShow] = useState(true);
  const groupDom = useRef(null);
  useEffect(() => {
    let newSortable = undefined;
    let groupName = props.groupName;
    if (document.getElementById('ep-group-' + groupName)) {
      newSortable = Sortable.create(document.getElementById('ep-group-' + groupName), {
        group: 'nested',
        filter: '.group-name',
        animation: 200,
        fallbackOnBody: true,
        onStart: () => {
          setFocus(true);
        },
        onEnd: () => {
          setFocus(false);
        },
        onAdd: (e) => {
          // 获取新顺序
          const ids = [];
          if (e.item.className.includes('group-container')) {
            const childrens = e.item.getElementsByClassName('ele-list');
            for (let i = 0; i < childrens.length; i++) {
              ids.push(childrens[i].getAttribute('data-idx'));
            }
          } else {
            ids.push(e.item.getAttribute('data-idx'))
          }

          const eles = document.querySelectorAll('#simpleList .ele-list');
          let newIdx = [];
          for (let i = 0; i < eles.length; i++) {
            newIdx.push(eles[i].getAttribute('data-idx'));
          }

          e.to.removeChild(e.item);
          e.from.appendChild(e.item);

          props.getNewIndex({
            name: groupName,
            id: ids,
            newIdx,
          });
        },
        onUpdate: (e) => {
          props.getNewIndex();
        },
      });
    }
    return () => {
      if (newSortable) {
        console.log("分组被卸载");
        newSortable.destroy();
      }
    };
  }, []);

  useEffect(() => {
    props.actSetElementsGroup(props.groupName, show);
  }, [show]);

  return (
    <div
      className={`group-container list-group-item${fold ? ' group-fold' : ''}`}
      id={`ep-group-${props.groupName}`}
      ref={groupDom}
      style={{
        backgroundColor:
          props.selectElementId &&
          props.selectElementId.replace('group:', '') === props.groupName
            ? '#e6f7ff'
            : '#ffffff',
      }}
      onMouseUp={() => {
        props.actSelectElement('group:' + props.groupName);
      }}
    >
      <Icon
        className="fold-group"
        type={fold ? 'caret-right' : 'caret-down'}
        onClick={() => setFold(!fold)}
      />
      <Icon
        type={show ? 'eye' : 'eye-invisible'}
        className="toggle-group"
        onClick={() => setShow(!show)}
      />
      <Icon
        type="drag"
        className="move-group"
        onClick={() => props.actSetSelectGroup(props.groupName)}
      />
      <Icon
        type="minus"
        className="delete-group"
        onClick={() => props.deleteGroup()}
      />

      <ElementName
        id={props.groupName}
        name={props.groupName}
        isGroup={true}
        cb={props.actRenameGroup}
      />
      {props.children}
    </div>
  );
};

const PageElementsList = (props) => {
  const { setFocus } = props;
  const [addGroupVisible, setAddGroupVisible] = useState(false);
  const [groupName, setGroupName] = useState(undefined);
  const [groupedElements, setGroupedElements] = useState([]);

  const elements = useRef();
  let currentPage = props.bookPages.present.pages.find(
    (item) => item.id === props.bookPages.showingPageId
  );

  elements.current = currentPage && currentPage.elements || [];

  const onConfirm = () => {
    if (!groupName) {
      message.error('请输入组名！', 3);
      return;
    }

    const pages = props.bookPages.present.pages;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      for (let n = 0; n < page.elements.length; n++) {
        if (page.elements[n].config.groupName === groupName) {
          message.error('组名已经存在了！', 3);
          return;
        }
      }
    }

    props.addElementsGroup(props.bookPages.selectElementId, groupName);
    setAddGroupVisible(false);
    setGroupName(undefined);
  };

  // dom加载后
  useEffect(() => {
    let SimpleSort = Sortable.create(document.getElementById('simpleList'), {
      group: 'nested',
      animation: 200,
      fallbackOnBody: true,
      scroll: true,
      onStart: () => {
        setFocus(true);
      },
      onEnd: () => {
        setFocus(false);
      },
      onUpdate: (e) => {
        getNewIndex();
      },
      onAdd: (e) => {
        // 获取新顺序
        const eles = document.querySelectorAll('#simpleList .ele-list');
        let newIdx = [];
        for (let i = 0; i < eles.length; i++) {
          newIdx.push(eles[i].getAttribute('data-idx'));
        }

        e.to.removeChild(e.item);
        e.from.appendChild(e.item);

        getNewIndex({
          name: '',
          id: [e.item.getAttribute('data-idx')],
          newIdx,
        });
      },
    });

    return () => {
      SimpleSort.destroy();
    };
  }, []);

  const escEvent = (event) => {
    if (event.keyCode === 27) {
      document.removeEventListener('keydown', escEvent);
      props.actSetSelectGroup(undefined);
    }
  };
  const moveGroupElements = (groupName) => {
    props.actSetSelectGroup(groupName);
    document.addEventListener('keydown', escEvent, false);
  };

  const getNewIndex = (changed) => {
    let newElements = [];

    if (changed) {
      const eles = changed.newIdx;

      for (let i = 0; i < eles.length; i++) {
        let newElement = elements.current.find(
          (element) => element.id === eles[i]
        );

        if (changed.id.includes(newElement.id)) {
          newElement.config.groupName = changed.name;
        }

        newElements.push(newElement);
      }
    } else {
      const eles = document.querySelectorAll('#simpleList .ele-list');

      for (let i = 0; i < eles.length; i++) {
        let newElement = elements.current.find(
          (element) => element.id === eles[i].getAttribute('data-idx')
        );
        newElements.push(newElement);
      }
    }

    props.sortElement(newElements);
  };

  // 整理分组数组
  const groupElements = () => {
    let newElements = [];
    let tempGroupArr = [];
    if (elements.current) {
      elements.current.forEach((value, index) => {
        if (value.config.groupName) {
          if (
            tempGroupArr.length !== 0 &&
            tempGroupArr[0].groupName !== value.config.groupName
          ) {
            // 和之前不同分组
            newElements.push([...tempGroupArr]);
            tempGroupArr = [];
          }
          tempGroupArr.push({
            id: value.id,
            type: value.type,
            name: value.config ? value.config.name : '',
            groupName: value.config ? value.config.groupName : '',
            oldIdx: index,
            show: value.show,
          }); // oldIdx 对应整理前的index

          if (index === elements.current.length - 1) {
            newElements.push([...tempGroupArr]);
          }
        } else {
          // 判断临时组是否为空
          if (tempGroupArr.length !== 0) {
            newElements.push([...tempGroupArr]);
            tempGroupArr = [];
          }
          newElements.push({
            id: value.id,
            type: value.type,
            name: value.config ? value.config.name : '',
            groupName: value.config ? value.config.groupName : '',
            oldIdx: index,
            show: value.show,
          });
        }
      });
    }

    return newElements;
  };

  useEffect(() => {
    // 整理分组数组
    let newElements = groupElements();

    setGroupedElements(newElements);
  }, [elements.current]);

  //
  const [failedImgs, setFailedImgs] = useState([]);

  function stopPropagation (e) {
    e.stopPropagation();
  }

  const addImgElement = (url) => {
    let image = new Image();
    image.src = url;

    let content = {};

    const borderWidth = 0,
      imgOpacity = 0,
      borderColor = '#000000',
      borderStyle = 'solid',
      borderRadius = 0,
      rotateY = false,
      rotateX = false;

    image.onload = () => {
      if (ifSvgImg(url)) {
        this.getSvgHtml(url).then((html) => {
          html = html.replace('<svg', '<svg preserveAspectRatio="none"');
          content = {
            config: {
              border:
                borderWidth > 0
                  ? borderWidth + 'px ' + borderColor + ' ' + borderStyle
                  : '0 solid rgba(0,0,0,1)',
              borderRadius: borderRadius,
            },
            content:
              `<div style='
          transform:${rotateX ? 'rotateX(180deg)' : ''} ${
                rotateY ? 'rotateY(180deg)' : ''
              } ${!rotateX && !rotateY ? 'none' : ''};opacity:${
                (100 - imgOpacity) / 100
              };' class="new-svg-div">
          <div class='svgContainer' style='height:100%;width:100%;'>` +
              html +
              `</div></div>`,
            width: image.width >= 300 ? 300 : image.width,
            height:
              image.width >= 300
                ? Math.ceil((300 * image.height) / image.width)
                : image.height,
          };
        });
      } else {
        content = {
          config: {
            border:
              borderWidth > 0
                ? borderWidth + 'px ' + borderColor + ' ' + borderStyle
                : '0 solid rgba(0,0,0,1)',
            borderRadius: borderRadius,
          },
          content: `<div style='position:relative;width:100%;height:100%; transform:${
            rotateX ? 'rotateX(180deg)' : ''
          } ${rotateY ? 'rotateY(180deg)' : ''} ${
            !rotateX && !rotateY ? 'none' : ''
          };' >
          <img  src='${url}' style='display: block; width: 100%; height: 100%; pointer-events: none;opacity:${
            (100 - imgOpacity) / 100
          };' /></div>`,
          width: image.width >= 300 ? 300 : image.width,
          height:
            image.width >= 300
              ? Math.ceil((300 * image.height) / image.width)
              : image.height,
        };
      }

      props.addElement(content);
    };
  };

  return (
    <div
      className={
        currentPage && currentPage.showElementPane
          ? `${styles.elementsWrapper} ${styles.elementsWrapperOpen} element-tab`
          : `${styles.elementsWrapper} ${styles.elementsWrapperClose} element-tab`
      }
      onMouseDown={stopPropagation}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ padding: 6 }}>
          <Dragger
            name="file"
            multiple={true}
            action="/api/media/image"
            headers={{
              credentials: 'same-origin',
            }}
            data={{
              userId: JSON.parse(window.localStorage.getItem('token'))
                .loginResult.userInfoDto.userId,
            }}
            onChange={(info) => {
              const { status, response } = info.file;

              if (status === 'done') {
                info.fileList = info.fileList.filter(
                  (file) => file.uid !== info.file.uid
                );
                addImgElement(response.result);
              } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }

              // always setState
              setFailedImgs([...info.fileList]);
            }}
            fileList={failedImgs}
          >
            <p>Click or drag image to add to workspace</p>
          </Dragger>
        </div>
        <Button
          type="link"
          onClick={() => {
            if (!props.bookPages.selectElementId) {
              message.error('请先选择元素来建立分组！', 3);
              return;
            }
            setAddGroupVisible(true);
          }}
          style={{ padding: '0 8px' }}
        >
          <Icon type="folder" />
          Add
        </Button>
      </div>

      <div
        id="simpleList"
        className="list-group"
        style={{
          borderTop: '1px solid #ccd5db',
          minHeight: 'calc(100% - 150px)',
          padding: '4px 0 16px 0',
          background: '#fff'
        }}
      >
        {groupedElements.map((element, index) => {
          if (element.id) {
            return (
              <div
                key={element.id}
                onMouseUp={() => props.actSelectElement(element.id)}
                className={`${styles.listItem} ele-list list-group-item`}
                data-idx={element.id}
                style={{
                  backgroundColor:
                    props.bookPages.selectElementId === element.id
                      ? '#e6f7ff'
                      : '#ffffff',
                  cursor: 'grab',
                }}
              >
                <Icon
                  type={
                    elements.current[element.oldIdx] &&
                    elements.current[element.oldIdx].show
                      ? 'eye'
                      : 'eye-invisible'
                  }
                  style={{ marginRight: 5 }}
                  onMouseUp={(e) => {
                    e.stopPropagation();
                    props.toggleElement(element.id);
                  }}
                />

                <ElementName
                  id={element.id}
                  name={element.name || element.type}
                  cb={props.actRenameElement}
                />
              </div>
            );
          } else {
            return (
              <GroupElements
                key={element[0].groupName}
                groupName={element[0].groupName}
                deleteGroup={() =>
                  props.deleteElementsGroup(element[0].groupName)
                }
                getNewIndex={getNewIndex}
                actSetElementsGroup={props.actSetElementsGroup}
                actSetSelectGroup={() =>
                  moveGroupElements(element[0].groupName)
                }
                actSelectElement={props.actSelectElement}
                selectElementId={props.bookPages.selectElementId}
                actRenameGroup={props.actRenameGroup}
                setFocus={setFocus}
              >
                {element.map((ele) => (
                  <div
                    className={`${styles.listItem} ele-list list-group-item`}
                    key={`element-panel-${ele.id}`}
                    data-idx={ele.id}
                    style={{
                      backgroundColor:
                        props.bookPages.selectElementId === ele.id
                          ? '#e6f7ff'
                          : '#ffffff',
                      cursor: 'grab',
                    }}
                    onMouseUp={(e) => {
                      if (props.bookPages.selectGroupId === ele.groupName) {
                        e.stopPropagation();

                        props.actSelectElement(ele.id);
                      }
                    }}
                  >
                    <Icon
                      type={
                        elements.current[ele.oldIdx] &&
                        elements.current[ele.oldIdx].show
                          ? 'eye'
                          : 'eye-invisible'
                      }
                      style={{ marginRight: 5 }}
                      onMouseUp={(e) => {
                        e.stopPropagation();
                        props.toggleElement(ele.id);
                      }}
                    />

                    <ElementName
                      id={ele.id}
                      name={ele.name || ele.type}
                      cb={props.actRenameElement}
                    />
                  </div>
                ))}
              </GroupElements>
            );
          }
        })}
      </div>

      <Modal
        visible={addGroupVisible}
        onCancel={() => {
          setAddGroupVisible(false);
          setGroupName(undefined);
        }}
        onOk={() => onConfirm()}
        width="300px"
        title="add group"
      >
        <div>group name</div>
        <Input
          value={groupName}
          onChange={(value) => setGroupName(value.target.value)}
        />
      </Modal>
    </div>
  );
};

const getSvgHtml = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        if (text.indexOf('<svg') > -1) {
          text = text.substring(text.indexOf('<svg'), text.length);
        }
        resolve(text);
      });
  });
};

const ifSvgImg = (url) => {
  if (url && url.substring(url.length, url.lastIndexOf('.')) === '.svg') {
    return true;
  }
  return false;
};

const mapDispatchToProps = (dispatch) => ({
  toggleElement: (elementId) => {
    dispatch(actToggleElement(elementId));
  },
  sortElement: (newList) => {
    dispatch(actSortElement(newList));
  },
  highlightElement: (elementId) => {
    dispatch(actHighlightElement(elementId));
  },
  unhighlightElement: (elementId) => {
    dispatch(actUnhighlightElement(elementId));
  },
  hideElementPane: () => {
    dispatch(actElementPaneHide());
    dispatch(actShowSlideBar());
  },
  hideSlideBar: () => {
    dispatch(actHideSlideBar());
  },
  showSlideBar: () => {
    dispatch(actShowSlideBar());
  },
  addElement: (content) => {
    dispatch(actAddElement('ImageBox', content));
  },
  addElementsGroup: (id, name) => {
    dispatch(actAddElementsGroup({ id, name }));
  },
  deleteElementsGroup: (name) => {
    dispatch(actDeleteElementsGroup(name));
  },
  actSelectElement: (id) => {
    dispatch(actSelectElement(id));
  },
  actSetElementsGroup: (name, show) => {
    dispatch(actSetElementsGroup({ name, show }));
  },
  actSetSelectGroup: (name) => {
    dispatch(actSetSelectGroup(name));
  },
  actRenameElement: (id, name) => {
    dispatch(actRenameElement(id, name));
  },
  actRenameGroup: (id, name) => {
    dispatch(actRenameGroup(id, name));
  },
});

const mapStateToProps = ({ trans, bookPages }) => ({
  trans,
  bookPages,
});

export default connect(mapStateToProps, mapDispatchToProps)(PageElementsList);
