import React from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Modal, message, Input, Tabs } from 'antd';
const { TabPane } = Tabs;
import { ReactSortable, Sortable, MultiDrag, Swap } from 'react-sortablejs';
import styles from './PageElements.module.css';
import './PageElementsList.css';

Sortable.mount(new MultiDrag(), new Swap());

import {
  actSortElement,
  actToggleElement,
  actHighlightElement,
  actUnhighlightElement,
  actElementPaneHide,
  actAddElementsGroup,
  actDeleteElementsGroup,
  actSetElementsGroup,
} from '../../store/bookPages/actions';

import { actHideSlideBar, actShowSlideBar } from '../../store/slideBar/slider';
import { config } from 'react-transition-group';

class PageElementsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addGroupVisible: false,
      groupName: undefined,
      selectGroup: undefined,
      timeOut: undefined,
      readyToChangeList: [],
    };
  }

  onSortEnd(newList) {
    this.props.sortElement(newList);
  }

  onConfirm = () => {
    if (!this.state.groupName) {
      message.error('请输入组名！', 3);
      return;
    }

    const pages = this.props.bookPages.present.pages;
    
    for (let i = 0; i < pages.length; i++) {
      let groupList = pages[i].config.groupList;
      if (groupList && groupList.includes(this.state.groupName)) {
        message.error('组名已存在！', 3);
        return;
      }
    }

    this.props.addElementsGroup(this.state.groupName);
    this.setState({ addGroupVisible: false, groupName: undefined });
  };

  changeGroup = (name, order) => {
    const currentPage = this.props.bookPages.present.pages.find(
      (item) => item.id === this.props.bookPages.showingPageId
    );

    let elements = currentPage.elements;

    let newGroup = {};

    if (order && order.length === 0) {
      order.elements.forEach((value) => {
        newGroup[value.id] = name;
      });

      elements.forEach((element) => {
        if (newGroup[element.id]) {
          element.config.groupName = newGroup[element.id];
        }
      });
    }
  };

  render() {
    const {
      trans,
      bookPages,
      toggleElement,
      sortElement,
      highlightElement,
      unhighlightElement,
      hideElementPane,
      addElementsGroup,
      deleteElementsGroup,
      setElementsGroup,
    } = this.props;

    const currentPage = this.props.bookPages.present.pages.find(
      (item) => item.id === this.props.bookPages.showingPageId
    );

    let elements = currentPage.elements;

    if (!currentPage.config.groupList) {
      currentPage.config.groupList = [];
    }

    return (
      <div
        className={
          currentPage.showElementPane
            ? `${styles.elementsWrapper} ${styles.elementsWrapperOpen} element-tab`
            : `${styles.elementsWrapper} ${styles.elementsWrapperClose} element-tab`
        }
      >
        <Tabs defaultActiveKey="1" animated={false}>
          <TabPane tab="z-index" key="1" animated={false}>
            <ReactSortable
              group="group"
              animation={200}
              easing={'cubic-bezier(1, 0, 0, 1)'}
              list={elements.filter((value) => !value.groupName)}
              style={{
                width: '100%',
                minHeight: '60px',
                marginTop: 8,
              }}
              setList={(order) => {
                this.onSortEnd(order);
              }}
              multiDrag
            >
              {elements
                .filter((value) => !value.groupName)
                .map((element, index) => (
                  <div style={{ cursor: 'grab' }} key={element.id}>
                    <div className={styles.listItem}>
                      <Icon
                        type={element.show ? 'eye' : 'eye-invisible'}
                        style={{ marginRight: 5 }}
                        onClick={() => toggleElement(element.id)}
                      />
                      <Icon
                        type="border"
                        className={
                          element.highlight ? styles.borderIconHighlight : ''
                        }
                        onMouseEnter={() => {
                          highlightElement(element.id);
                        }}
                        onMouseLeave={() => {
                          unhighlightElement(element.id);
                        }}
                      />
                      <span className={styles.text}>{element.type} </span>
                    </div>
                  </div>
                ))}
            </ReactSortable>
          </TabPane>

          <TabPane tab="group" key="2">
            <div style={{ textAlign: 'center' }}>
              <Button
                type="link"
                onClick={() => this.setState({ addGroupVisible: true })}
                style={{ padding: '0 8px' }}
              >
                <Icon type="folder" />
                Add
              </Button>
              <Button
                type="link"
                onClick={() => deleteElementsGroup(this.state.selectGroup)}
                style={{ padding: '0 8px' }}
              >
                <Icon type="delete" />
                Delete
              </Button>
              <Button
                type="link"
                onClick={() => this.setState({ addGroupVisible: true })}
                style={{ padding: '0 8px' }}
              >
                <Icon type="drag" />
                Move
              </Button>
            </div>
            {currentPage.config.groupList.map((value, index) => (
              <div
                className="group-container"
                key={value}
                style={{
                  borderTop: index === 0 ? '1px solid #ccd5db' : 'none',
                }}
                onMouseDown={() => {
                  this.setState({
                    selectGroup: value,
                  });
                }}
              >
                <div
                  className="group-name"
                  style={{
                    color:
                      value === this.state.selectGroup ? '#1890ff' : '#000',
                  }}
                >
                  <Icon type="caret-down" style={{ marginRight: 8 }} />
                  <Icon type="eye" style={{ marginRight: 8 }} />
                  {value}
                </div>

                <ReactSortable
                  group="group"
                  animation={200}
                  easing={'cubic-bezier(1, 0, 0, 1)'}
                  list={elements.filter(
                    (ele) => ele.config.groupName === value
                  )}
                  style={{
                    width: '100%',
                  }}
                  setList={(order) => {
                    if (order && order.length !== 0) {
                      setElementsGroup(value, order);
                    }
                  }}
                >
                  {elements
                    .filter((ele) => ele.config.groupName === value)
                    .map((element, index) => (
                      <div style={{ cursor: 'grab' }} key={element.id}>
                        <div className={styles.listItem}>
                          <Icon
                            type={element.show ? 'eye' : 'eye-invisible'}
                            style={{ marginRight: 5 }}
                            onClick={() => toggleElement(element.id)}
                          />
                          <Icon
                            type="border"
                            className={
                              element.highlight
                                ? styles.borderIconHighlight
                                : ''
                            }
                            onMouseEnter={() => {
                              highlightElement(element.id);
                            }}
                            onMouseLeave={() => {
                              unhighlightElement(element.id);
                            }}
                          />
                          <span className={styles.text}>{element.type} </span>
                        </div>
                      </div>
                    ))}
                </ReactSortable>
              </div>
            ))}
          </TabPane>
        </Tabs>

        <Modal
          visible={this.state.addGroupVisible}
          onCancel={() =>
            this.setState({ addGroupVisible: false, groupName: undefined })
          }
          onOk={this.onConfirm}
          width="300px"
          title="add group"
        >
          <div>group name</div>
          <Input
            value={this.state.groupName}
            onChange={(value) =>
              this.setState({ groupName: value.target.value })
            }
          />
        </Modal>
      </div>
    );
  }
}

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
  addElementsGroup: (name) => {
    dispatch(actAddElementsGroup(name));
  },
  deleteElementsGroup: (name) => {
    if (name) {
      dispatch(actDeleteElementsGroup(name));
    } else {
      message.error('请点击选中要删除的分组!', 3);
    }
  },
  setElementsGroup: (name, elements) => {
    dispatch(actSetElementsGroup({ name, elements }));
  },
});

const mapStateToProps = ({ trans, bookPages }) => ({
  trans,
  bookPages,
});

export default connect(mapStateToProps, mapDispatchToProps)(PageElementsList);
