import React from "react";
import {connect} from "react-redux";
import {Icon} from 'antd';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import styles from "./PageElements.module.css";

import {
    actSortElement,
    actToggleElement,
    actHighlightElement,
    actUnhighlightElement,
    actElementPaneHide
} from "../../store/bookPages/actions";

import { actHideSlideBar, actShowSlideBar } from "../../store/slideBar/slider";

class PageElementsList extends React.Component {

    render() {

        const {
            trans,
            bookPages,
            toggleElement,
            sortElement,
            highlightElement,
            unhighlightElement,
            hideElementPane
        } = this.props;

        const currentPage = bookPages.present.pages.find(item => item.id === bookPages.showingPageId);
        const SortableItem = SortableElement(({value}) => (
            <div>
                {value}
            </div>
        ));

        const SortableList = SortableContainer(({items}) => {

            return (
                <div>
                    <div style={{textAlign: 'right', padding: 5}}>
                        <Icon type="close" onClick={() => {
                            hideElementPane();
                        }}/>
                    </div>
                    <div className={styles.list}>
                        {items.map((element, index) => {
                            let elementClassName = `${styles.listItem}`;
                            return (
                                <SortableItem key={`item-${index}`} index={index}
                                              value={
                                                  <div
                                                      key={element.id}
                                                      className={elementClassName}
                                                      data-key={element.id}
                                                      data-id={element.id}
                                                  >
                                                      <Icon type={element.show ? 'eye' : 'eye-invisible'}
                                                            style={{marginRight: 5}}
                                                            onClick={() => toggleElement(element.id)}/>
                                                      <Icon type="border"
                                                            className={element.highlight ? styles.borderIconHighlight : ''}
                                                            onMouseEnter={()=>{
                                                                highlightElement(element.id);
                                                            }}
                                                            onMouseLeave={()=>{
                                                                unhighlightElement(element.id);
                                                            }}
                                                      />
                                                      <span className={styles.text}>{element.type} </span>
                                                  </div>
                                              }>
                                </SortableItem>
                            )
                        })}
                    </div>
                </div>
            );
        });

        const onSortEnd = ({oldIndex, newIndex}) => {
            //currentPage.elements = arrayMove(currentPage.elements, oldIndex, newIndex);
            sortElement(oldIndex, newIndex);
        };

        return (
            <div
                className={currentPage.showElementPane ? `${styles.elementsWrapper} ${styles.elementsWrapperOpen}` : `${styles.elementsWrapper} ${styles.elementsWrapperClose}`}>
                <SortableList items={currentPage.elements}
                              onSortEnd={onSortEnd}
                              distance={5}
                              useDragHandle></SortableList>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    toggleElement: elementId => {
        dispatch(actToggleElement(elementId));
    },
    sortElement: (oldIndex, newIndex) => {
        dispatch(actSortElement(oldIndex, newIndex))
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
    hideSlideBar:()=>{
        dispatch(actHideSlideBar())
    },
    showSlideBar:()=>{
        dispatch(actShowSlideBar())
    },
});

const mapStateToProps = ({trans, bookPages}) => ({
    trans,
    bookPages
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PageElementsList);
