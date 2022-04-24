import nanoid from 'nanoid';
import arrayMove from 'array-move';
import rfdc from '../../util/rfdc';
import { actionNames } from './actions';
import { PageLayouts } from '../../constants';
import { EmptyThumb, ElementTypes } from '../../constants';
import { cps, spawn } from '@redux-saga/core/effects';

const clone = rfdc();

const setBookTradiSimp = (payload, state) => {
  state.present.config.simple = payload;
  return { ...state };
};

const setBookPinyin = (payload, state) => {
  state.present.config.pinyin = payload;
  return { ...state };
};

const setBookAudio = (payload, state) => {
  state.present.config.audio = payload;
  return { ...state };
};

const createNewPageObject = (idx, isVertical, state) => {
  console.log('createNewPageObject', isVertical);
  let thumb = isVertical ? EmptyThumb.landscape : EmptyThumb.portrait;
  let config = {};
  if (state && state.present.config) {
    config.fontColor = state.present.config.fontColor || '#000000';
    config.fontSize = state.present.config.fontSize || 14;
    config.fontFamily =
      state.present.config.fontFamily || "'HYKaiTiJ W00 Regular'";
    config.textAlign = state.present.config.textAlign || "'left";

    config.border = state.present.config.border;
    config.backgroundColor = state.present.config.backgroundColor;
    config.shadow = state.present.config.shadow;
    config.padding = state.present.config.padding;
    config.borderRadius = state.present.config.borderRadius;
    if (state && state.present.config.image) {
      config.image = state.present.config.image;
    }
    if (state && state.present.config.color) {
      config.color = state.present.config.color;
    }
  }
  return {
    id: nanoid(24),
    elements: [],
    showElementPane: false,
    index: idx,
    thumb: thumb,
    config:
      config.length === 0
        ? {
            fontColor: '#000000',
            fontSize: 14,
            fontFamily: "'HYKaiTiJ W00 Regular'",
          }
        : config,
  };
};
const createQuestionHtml = (question) => {
  const questionHtml = `<div style='display:flex;flex-direction: column;padding:10px'><div>${
    question.stem
  }</div><div style='display:flex;justify-content: space-between'>${question.optionsList.reduce(
    (i, j) => {
      return i + j;
    }
  )}</div></div>`;
  return questionHtml;
};
const createDrawingBoxHtml = (width, height, content) => {
  const drawingBoxHtml = `${content}<iframe src="http://39.99.182.102//draw/index.html" frameborder="1" width="${width}" height="${height}"></iframe>`;
  return drawingBoxHtml;
};
const createTypingBoxHtml = (width, height, content) => {
  const { maxLength, color = '#000', fontSize = 14, lineHeight = 14 } = content;
  const spanId = `typingBoxSpan${new Date().getTime()}`;
  const textAreaId = `textArea${new Date().getTime()}`;
  const typingBoxHtml = `
    <div style="height: ${height}">
    <div class="typingBoxBtns" style="width: ${width};padding: 10px 0;cursor: pointer;">
      <span onclick="saveFileTypingBox('${textAreaId}')" style="padding: 4px 15px;border-radius: 8px;font-size: 14px;color: #fff;background-color: #02a1e3;">Save</span>
      <span id="${spanId}"><span>0/${maxLength}</span></span>
    </div>
    <textarea
    id="${textAreaId}"
    style="color:${color};font-size:${fontSize}px;line-height:${lineHeight}px;border:0;border-radius:5px;background-color:rgba(241,241,241,.98);width: ${width};height:calc(100% - 60px);padding: 10px;resize: none;"
    placeholder="打字框" onkeyup="inputTextArae(${maxLength}, '${textAreaId}', '${spanId}')"></textarea>
    </div>
  `;
  return typingBoxHtml;
};
const createNewElementObject = (
  elementType,
  content = '',
  x = 10,
  y = 10,
  width = 400,
  height = 150,
  showType = 'html'
) => {
  let config;
  if (elementType === ElementTypes.imageBox) {
    width = content.width;
    height = content.height;
    config = content.config;
    content = content.content;
  }
  if (
    elementType === ElementTypes.videoBox ||
    elementType === ElementTypes.audioBox
  ) {
    width = content.width;
    height = content.height;
    content = content.content;
  }

  if (elementType === ElementTypes.nextButton) {
    width = 150;
    height = 40;
  }
  if (elementType === ElementTypes.colorFillGame) {
    width = 650;
    height = 637;
    content = content.content;
  }
  if (elementType === ElementTypes.atlas) {
    width = 240;
    height = 280;
    content = content.content;
  }

  let newElement = {
    id: nanoid(24),
    type: elementType,
    content: [{ type: showType, value: content }],
    show: true,
    config: {
      x: x,
      y: y,
      width: width,
      height: height,
      template: '',
    },
  };
  for (let i in ElementTypes) {
    if (elementType === ElementTypes[i]) {
      newElement.config.select = true;
    }
  }
  if (elementType === ElementTypes.questionGroup) {
    newElement.content[0].value = `<div class="questions-group">${newElement.content[0].value.replace(
      /VAR_ElementId/g,
      newElement.id
    )}`;
  }

  if (elementType === ElementTypes.newChoiceQuestion) {
    newElement.content[0].value = newElement.content[0].value.replace(
      /VAR_ElementId/g,
      newElement.id
    );
  }

  if (elementType === ElementTypes.choiceQuestion) {
    const questionhHml = createQuestionHtml(content);
    const newContent = [{ type: showType, value: questionhHml }];
    newElement = Object.assign(
      newElement,
      { content: newContent },
      { question: content }
    );
  }

  if (elementType === ElementTypes.drawingBox) {
    width = '100%';
    height = '100%';
    newElement.content[0]['value'] = createDrawingBoxHtml(
      width,
      height,
      content
    );
  }
  if (elementType === ElementTypes.typingBox) {
    width = '100%';
    height = '100%';
    newElement.content[0]['value'] = createTypingBoxHtml(
      width,
      height,
      content
    );
  }
  if (elementType === ElementTypes.imageBox) {
    newElement.config.border = config.border;
    newElement.config.borderRadius = config.borderRadius;
    newElement.config.shadow = config.shadow;
  }
  return newElement;
};

const initPage = createNewPageObject(0);

const initialState = {
  past: [],
  present: {
    id: nanoid(24),
    pages: [initPage],
    config: {
      isVertical: false,
      layout: 'portrait', // portrait or landscape
      backgroundMusic: [],
    },
  },
  future: [],
  showingPageId: initPage.id,
  templates: [],
  audios: [],
  questionSet: [],
  showPageTemplate: false,
  showTemplate: false,
  showAudio: false,
};

const findItemById = (itemList, id) => {
  return itemList ? itemList.find((item) => item.id === id) : {};
};
const addTemplateList = (state, templates = []) => {
  state.templates = templates;
  return {
    ...state,
  };
};
const addComposeTemplateList = (state, composeTemplates = []) => {
  state.composeTemplates =
    composeTemplates.length > 0 ? composeTemplates : state.composeTemplates;
  return {
    ...state,
  };
};

const addPageTemplateList = (state, pageTemplates = []) => {
  if (localStorage.getItem('pageTemplatesSort')) {
    let pageTemplatesSort = JSON.parse(
      localStorage.getItem('pageTemplatesSort')
    );
    if (pageTemplates.length) {
      pageTemplates.sort((prev, next) => {
        return (
          pageTemplatesSort.indexOf(prev.id) -
          pageTemplatesSort.indexOf(next.id)
        );
      });
    }
  }
  state.pageTemplates = pageTemplates;
  return {
    ...state,
  };
};

const showTemplateList = (state) => {
  state.showTemplate = !state.showTemplate;
  return {
    ...state,
  };
};
const showPageTemplateList = (state) => {
  state.showPageTemplate = !state.showPageTemplate;
  return {
    ...state,
  };
};
const showAudioList = (state) => {
  state.showAudio = !state.showAudio;
  return {
    ...state,
  };
};
const showComposeTemplateList = (state) => {
  state.showComposeTemplate = !state.showComposeTemplate;
  return {
    ...state,
  };
};

const toggleElementPane = (state, action) => {
  const { present, showingPageId } = state;
  present.pages.map((page) => {
    // if (page.id === showingPageId && page.elements.length > 0) {
    page.showElementPane = !action.slider.show;
    // }
  });

  return {
    ...state,
  };
};

const hideElementPane = (state) => {
  const { present, showingPageId } = state;
  present.pages.map((page) => {
    if (page.id === showingPageId && page.elements.length > 0) {
      page.showElementPane = false;
    }
  });
  return {
    ...state,
  };
};

const showElementPane = (state) => {
  const { present, showingPageId } = state;
  present.pages.map((page) => {
    if (page.id === showingPageId && page.elements.length > 0) {
      page.showElementPane = true;
    }
  });
  return {
    ...state,
  };
};

const setElementTextHtml = (
  state,
  textHtml,
  elementId,
  contentPos = 0,
  background
) => {
  const { present, showingPageId } = state;
  const currentPage = present.pages.find((item) => item.id === showingPageId);
  currentPage.elements.map((element) => {
    if (element.id === elementId) {
      let backgroundTem = element.content[contentPos].background;
      element.content = clone(element.content);
      if (element.type === 'TextBox') {
        element.content[contentPos] = {
          type: 'html',
          value: textHtml,
          background: backgroundTem,
        };
      } else {
        element.content[contentPos] = {
          type: 'html',
          value: textHtml,
          background: background,
        };
      }
    }
  });
  return {
    ...state,
  };
};

const toggleElement = (state, elementId) => {
  const { present, showingPageId } = state;
  const currentPage = present.pages.find((item) => item.id === showingPageId);
  currentPage.elements.map((element) => {
    if (element.id === elementId) {
      element.show = !element.show;
    }
  });
  return {
    ...state,
  };
};

// 元素面板排序
const sortElement = (state, newIndex) => {
  const { present, showingPageId } = state;
  const currentPage = present.pages.find((item) => item.id === showingPageId);

  currentPage.elements = clone(newIndex);

  return {
    ...state,
  };
};
// const sortElement = (state, oldIndex, newIndex) => {
//   const { present, showingPageId } = state;
//   const currentPage = present.pages.find(item => item.id === showingPageId);

//   currentPage.elements = arrayMove(currentPage.elements, oldIndex, newIndex);

//   return {
//     ...state
//   };
// };

const highlightElement = (state, elementId) => {
  const { present, showingPageId } = state;
  const currentPage = present.pages.find((item) => item.id === showingPageId);
  currentPage.elements.map((element) => {
    if (element.id === elementId) {
      element.highlight = true;
    }
  });
  return {
    ...state,
  };
};

const unhighlightElement = (state, elementId) => {
  const { present, showingPageId } = state;
  const currentPage = present.pages.find((item) => item.id === showingPageId);
  currentPage.elements.map((element) => {
    if (element.id === elementId) {
      element.highlight = false;
    }
  });
  return {
    ...state,
  };
};

const sortThumbnail = (newList, state) => {
  let { past, present } = state;
  const previous = clone(present);
  let newPast = past.slice(0);
  newPast.push(previous);
  const newPresent = clone(present);
  newPresent.pages = clone(newList);

  pageChange(newPresent.pages, (value, index) => {
    value.index = index;
  });

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
  };
};
// const sortThumbnail = (newIndex, oldIndex, state) => {
//   let { past, present } = state;
//   const previous = clone(present);
//   const newPast = past.slice(0);
//   newPast.push(previous);
//   const newPresent = clone(present);
//   const pagebak = clone(newPresent.pages[newIndex]);
//   newPresent.pages[newIndex] = newPresent.pages[oldIndex]; // 调换位置
//   newPresent.pages[oldIndex] = pagebak;
//   for (let i = 0; i < newPresent.pages.length; i++) {
//     newPresent.pages[i]['index'] = i;
//   }
//   return {
//     ...state,
//     past: newPast,
//     present: newPresent
//   };
// };
const addNewPage = (config, state) => {
  let { past, present, future } = state;
  const { index } = config;
  const previous = clone(present);
  let newPast = past.slice(0);
  newPast.push(previous);
  const newPresent = clone(present);
  const newPage = createNewPageObject(
    newPresent.pages.length,
    present.config.isVertical,
    state
  );
  newPresent.pages.splice(index + 1, 0, newPage);
  pageChange(newPresent.pages);

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: newPage.id,
  };
};

const copyPage = (state) => {
  let { past, present, future, showingPageId } = state;
  const previous = clone(present);
  let newPast = past.slice(0);
  newPast.push(previous);
  const newPresent = clone(present);
  let len = newPresent.pages.length;
  let newNanoid = nanoid(24);
  for (let index = 0; index < len; index++) {
    if (newPresent.pages[index].id == showingPageId) {
      console.log('拷贝匹配');
      const copyPage = clone(newPresent.pages[index]);
      copyPage.id = newNanoid;
      copyPage.elements.forEach((element) => {
        element.id = nanoid(24);
      });
      newPresent.pages.splice(index + 1, 0, copyPage);
      index++;
      break;
    }
  }

  pageChange(newPresent.pages, (value, index) => {
    value.index = index;
  });

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: newNanoid,
  };
};

const pageChange = (pages, cb) => {
  let num = 0;

  pages.forEach((value, index) => {
    if (value.pageContent || num) {
      num = num + 1;
      value.pageContent = num + '';
    }

    cb && cb(value, index);
  });
};

const removePage = (pageId, state) => {
  const { past, present, future } = state;
  past.push(clone(present));
  present.pages.map((page, index) => {
    if (page.id === pageId) {
      present.pages.splice(index, 1);
    }
  });
  const newPresent = clone(present);
  let newPresentLength = newPresent.pages.length;

  pageChange(newPresent.pages, (value, index) => {
    value.index = index;
  });
  return {
    ...state,
    past: past.slice(0),
    present: newPresent,
    future: future.slice(0),
    showingPageId: newPresent.pages[newPresentLength - 1].id,
  };
};
const undo = (state) => {
  const { past, present, future } = state;
  let newPast = clone(past);
  const undoIdx = newPast && newPast.length - 1;
  if (undoIdx < 0) {
    return null;
  }
  const newPresent = newPast[undoIdx];
  newPast = newPast.slice(0, undoIdx);
  const newFuture = clone(future);
  newFuture.push(clone(present));
  return {
    ...state,
    past: newPast,
    present: newPresent,
    future: newFuture,
    showingPageId: state.showingPageId,
  };
};

const setPageThumb = (id, base64str, state) => {
  const { past, present, future } = state;
  // console.log(id, base64str);
  const newPresent = { ...present };
  const showingPage = newPresent.pages.find((item) => {
    return item.id === id;
  });
  if (showingPage) showingPage.thumb = base64str;
  return {
    ...state,
    past: past.slice(0),
    present: newPresent,
    future: future.slice(0),
    showingPageId: state.showingPageId,
  };
};
const setPDFThumb = (id, base64str, state) => {
  const { past, present, future } = state;
  // console.log(id, base64str);
  const newPresent = { ...present };
  const showingPage = newPresent.pages.find((item) => {
    return item.id === id;
  });
  showingPage.pdfThumb = base64str;
  return {
    ...state,
    past: past.slice(0),
    present: newPresent,
    future: future.slice(0),
    showingPageId: state.showingPageId,
  };
};

const setShowingPage = (pageId, state) => {
  const { past, present, future } = state;
  const newPresent = { ...present };

  // 清空所有页面中element的select效果
  if (pageId != state.showingPageId) {
    present.pages.forEach((page) => {
      page.elements.forEach((element) => {
        element.config.select = false;
      });
    });
  }
  return {
    ...state,
    past: past.slice(0),
    present: newPresent,
    future: future.slice(0),
    showingPageId: pageId,
    selectElementId: undefined,
  };
};

const addTimerToPage = (state, content, TimerId) => {
  const { past, present, future } = state;
  const previous = { ...present };
  let newPast = past.slice(0);
  newPast.push(previous);
  let newPresent = clone(present);

  if (!newPresent.config.timer) {
    newPresent.config.timer = [];
  }

  if (TimerId) {
    // newPresent.config.timer[index] = content;
    let timerIndex = newPresent.config.timer.findIndex((timer) => {
      return timer.id == TimerId;
    });
    newPresent.config.timer[timerIndex] = { ...content, id: TimerId };
  } else {
    newPresent.config.timer.push({ id: nanoid(24), ...content });
  }

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
  };
};

const deleteTimer = (state, id) => {
  const { past, present, future } = state;
  const previous = { ...present };
  let newPast = past.slice(0);
  newPast.push(previous);
  let newPresent = clone(present);

  let timerIndex = newPresent.config.timer.findIndex((timer) => {
    return timer.id === id;
  });
  if (timerIndex !== undefined) {
    newPresent.config.timer.splice(timerIndex, 1);
  }

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
  };
};

const editChioceQuestion = (state, elementId, content) => {
  const { past, present, future } = state;
  const previous = { ...present };
  let newPast = past.slice(0);
  const pageId = state.showingPageId;
  newPast.push(previous);
  let newPresent = clone(present);
  newPresent.pages.forEach((page, index) => {
    if (page.id === pageId) {
      page.elements.forEach((item, index2) => {
        if (item.id === elementId) {
          newPresent.pages[index].elements[index2].content[0].value =
            content.replace(/VAR_ElementId/g, elementId);
        }
      });
    }
  });

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: pageId,
  };
};

const actChangeQuestionGroup = (state, content, deleteQ, id, addQ) => {
  const { past, present, future } = state;
  const previous = { ...present };
  let newPast = past.slice(0);
  const pageId = state.showingPageId;
  newPast.push(previous);
  const newPresent = clone(present);
  let cPage = newPresent.pages.find((item) => item.id === pageId);

  let cGroup;

  if (cPage.elements && cPage.elements.length) {
    cPage.elements.map((element, index) => {
      if (id && element.id === id) {
        cPage.elements.splice(index, 1);
      }
      if (element.type === ElementTypes.questionGroup) {
        cGroup = cPage.elements[index];
      }
    });
  }

  if (cGroup) {
    if (deleteQ) {
      cGroup.content[0].value = content;
    } else {
      const divEle = document.createElement('div');
      divEle.innerHTML = cGroup.content[0].value;
      const innerDiv = divEle.getElementsByClassName('questions-group')[0];
      innerDiv.innerHTML = innerDiv.innerHTML + content;
      cGroup.content[0].value = divEle.innerHTML;
    }
  } else {
    cPage.elements.push(
      createNewElementObject(ElementTypes.questionGroup, content)
    );
  }

  if (addQ) {
    cPage.elements.push(
      createNewElementObject(ElementTypes.newChoiceQuestion, addQ)
    );
  }

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: pageId,
  };
};

const addElementToPage = (elementType, state, content = '', template = {}) => {
  const { past, present, future } = state;
  const previous = { ...present };
  let newPast = past.slice(0);
  const pageId = state.showingPageId;
  newPast.push(previous);
  const newPresent = clone(present);
  let cPage = newPresent.pages.find((item) => item.id === pageId);
  let newEle;

  let isGroup;
  let newGroupName;

  switch (elementType) {
    case ElementTypes.textBox:
      cPage.elements.forEach((ele) => {
        ele.config.select = false;
      });
      newEle = createNewElementObject(ElementTypes.textBox);

      if (cPage && cPage.config) {
        newEle.config.border = cPage.config.border;
        newEle.config.backgroundColor = cPage.config.backgroundColor;
        newEle.content[0].background = cPage.config.backgroundColor;
        newEle.config.shadow = cPage.config.shadow;
        newEle.config.padding = cPage.config.padding;
        newEle.config.borderRadius = cPage.config.borderRadius;
      }

      cPage.elements.push(newEle);
      break;
    case ElementTypes.tableBox:
      cPage.elements.push(createNewElementObject(ElementTypes.tableBox));
      break;
    case ElementTypes.leafletMap:
      cPage.elements.push(
        createNewElementObject(ElementTypes.leafletMap, content)
      );
      break;
    case ElementTypes.videoBox:
      cPage.elements.push(
        createNewElementObject(ElementTypes.videoBox, content)
      );
      break;
    case ElementTypes.audioBox:
      cPage.elements.push(
        createNewElementObject(ElementTypes.audioBox, content)
      );
      break;
    case ElementTypes.templateCard:
      cPage.elements.push(
        createNewElementObject(ElementTypes.templateCard, content)
      );
      break;
    case ElementTypes.drawingBox:
      cPage.elements.push(
        createNewElementObject(ElementTypes.drawingBox, content)
      );
      break;
    case ElementTypes.typingBox:
      cPage.elements.push(
        createNewElementObject(ElementTypes.typingBox, content)
      );
      break;
    case ElementTypes.composeTemplates:
      cPage.elements = template.elements.concat(cPage.elements);
      break;
    case ElementTypes.choiceQuestion:
      cPage.elements.push(
        createNewElementObject(ElementTypes.choiceQuestion, template)
      );
      break;
    case ElementTypes.newChoiceQuestion:
      cPage.elements.push(
        createNewElementObject(ElementTypes.newChoiceQuestion, content)
      );
      break;
    case ElementTypes.pageTemplates:
      if (template.elements && template.elements.length) {
        isGroup = template.id.includes('group:');
        const groupNameSuffix = nanoid(8);

        const idMap = {};
        const groupMap = {};

        template.elements.forEach((v) => {
          const newId = nanoid(24);
          // 如果为分组就是添加分组元素,并重命名分组
          if (v.config.groupName) {
            const newGroupName = v.config.groupName + '_' + groupNameSuffix;
            groupMap[v.config.groupName] = newGroupName;
            v.config.groupName = newGroupName;
          }

          idMap[v.id] = newId;
          v.id = newId;
        });

        // 处理触发元素id
        template.elements.forEach((v) => {
          const { triggerElId, triggerHideElId } = v.config || {};
          if (triggerElId) {
            const newTriggeredElId =
              idMap[triggerElId] ||
              `GroupName:${groupMap[triggerElId.replace('GroupName:', '')]}`;

            if (newTriggeredElId) {
              v.config.triggerElId = newTriggeredElId;
            }
          }
          if (triggerHideElId) {
            const newTriggerHideElId =
              idMap[triggerHideElId] ||
              `GroupName:${
                groupMap[triggerHideElId.replace('GroupName:', '')]
              }`;
            if (newTriggerHideElId) {
              v.config.triggerHideElId = newTriggerHideElId;
            }
          }
        });
      }

      cPage.elements =
        template.elements && template.elements.length
          ? cPage.elements.concat(template.elements)
          : [];
      // 如果为分组不改变page的config
      cPage.config = isGroup ? cPage.config : template.config;
      break;
    case ElementTypes.imageBox:
      cPage.elements.forEach((ele) => {
        ele.config.select = false;
      });
      cPage.elements.push(
        createNewElementObject(ElementTypes.imageBox, content)
      );
      break;
    case ElementTypes.nextButton:
      cPage.elements.push(
        createNewElementObject(ElementTypes.nextButton, content)
      );
      break;
    case ElementTypes.insertCode:
      cPage.elements.push(
        createNewElementObject(ElementTypes.insertCode, content)
      );
      break;
    case ElementTypes.colorFillGame:
      cPage.elements.push(
        createNewElementObject(ElementTypes.colorFillGame, content)
      );
      break;
    case ElementTypes.atlas:
      cPage.elements.push(createNewElementObject(ElementTypes.atlas, content));
      break;
    default:
      cPage.elements.push({
        type: ElementTypes.textBox,
        content: [],
        show: true,
        innerHTML: '',
      });
  }

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: pageId,
    selectElementId:
      cPage.elements.length > 0
        ? cPage.elements[cPage.elements.length - 1].id
        : undefined,
  };
};
const addTemplateToPage = (state, template = {}) => {
  const { past, present, future } = state;
  const previous = { ...present };
  let newPast = past.slice(0);
  const pageId = state.showingPageId;
  newPast.push(previous);
  const newPresent = clone(present);
  let cPage = newPresent.pages.find((item) => item.id === pageId);
  let newTemplate = clone(template);
  newTemplate.id = nanoid(24);
  if (newTemplate.config.triggerElId === template.id) {
    newTemplate.config.triggerElId = newTemplate.id;
  }
  if (newTemplate.config.triggerHideElId === template.id) {
    newTemplate.config.triggerHideElId = newTemplate.id;
  }
  cPage.elements.push(newTemplate);

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: pageId,
  };
};

const setElementSize = (size, id, state) => {
  const { past, present, future } = state;
  let newPast = past.slice(0);
  let newPresent = clone(present);
  let currentPage = findItemById(newPresent.pages, state.showingPageId);
  let element = findItemById(currentPage.elements, id);
  if (
    element.config.width !== size.width ||
    element.config.height !== size.height
  ) {
    newPast.push({ ...present });
  }
  element.config.width = parseInt(size.width);
  element.config.height = parseInt(size.height);

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: state.showingPageId,
  };
};
const setElementPos = (pos, id, state) => {
  const { past, present, future } = state;
  let newPast = past.slice(0);
  let newPresent = clone(present);
  let currentPage = findItemById(newPresent.pages, state.showingPageId);
  let element = findItemById(currentPage.elements, id);
  if (element.config.x !== pos.x || element.config.y !== pos.y) {
    newPast.push({ ...present });
  }
  element.config.x = parseInt(pos.x);
  element.config.y = parseInt(pos.y);
  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: state.showingPageId,
  };
};

const setElementAni = (ani, id, state) => {
  const { past, present, future } = state;
  let newPast = past.slice(0);
  newPast.push({ ...present });
  let newPresent = clone(present);
  let currentPage = findItemById(newPresent.pages, state.showingPageId);
  let element = findItemById(currentPage.elements, id);

  element.config.rotateDeg = ani.rotateDeg;
  element.config.aniClassName = ani.aniClassName;
  element.config.anidelay = ani.aniDelay;
  element.config.duration = ani.aniDuration;
  element.config.anitimes = ani.aniTimes;
  element.config.aniloop = ani.aniLoop;
  element.config.showState = ani.showState;
  element.config.hideDelay = ani.hideDelay;
  element.config.aniAudioName = ani.aniAudioName;
  element.config.aniAudioUrl = ani.aniAudioUrl;

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: state.showingPageId,
  };
};

const setGroupAni = (ani, id, state) => {
  const { past, present, future } = state;
  let newPast = past.slice(0);
  newPast.push({ ...present });
  let newPresent = clone(present);
  let currentPage = findItemById(newPresent.pages, state.showingPageId);
  let elements = currentPage.elements.filter(
    (element) => element.config.groupName === id
  );

  elements.forEach((element) => {
    element.config.rotateDeg = ani.rotateDeg;
    element.config.aniClassName = ani.aniClassName;
    element.config.anidelay = ani.aniDelay;
    element.config.duration = ani.aniDuration;
    element.config.anitimes = ani.aniTimes;
    element.config.aniloop = ani.aniLoop;
    element.config.showState = ani.showState;
    element.config.hideDelay = ani.hideDelay;
    element.config.aniAudioName = ani.aniAudioName;
    element.config.aniAudioUrl = ani.aniAudioUrl;
  });

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: state.showingPageId,
  };
};

const setGroupStyle = (style, id, state) => {
  const { past, present, future } = state;
  const { border, shadow, borderRadius, padding, background } = style;
  let newPast = past.slice(0);
  newPast.push({ ...present });
  let newPresent = clone(present);
  let currentPage = findItemById(newPresent.pages, state.showingPageId);
  let elements = currentPage.elements.filter(
    (element) => element.config.groupName === id
  );

  elements.forEach((element) => {
    element.content[0].background = background;
    element.config = {
      ...element.config,
      border,
      shadow,
      borderRadius,
      padding,
    };
  });

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: state.showingPageId,
  };
};

//设置触发效果
const setGroupTri = (tri, id, state) => {
  const { past, present, future } = state;
  let newPast = past.slice(0);
  newPast.push({ ...present });
  let newPresent = clone(present);
  let currentPage = findItemById(newPresent.pages, state.showingPageId);

  let elements = currentPage.elements.filter(
    (element) => element.config.groupName === id
  );

  const showId = tri.triggerElId;
  const hideElId = tri.triggerHideElId;

  elements.forEach((element) => {
    element.config = {
      ...element.config,
      ...tri,
      triggerElId: showId === 'paste self' ? element.id : showId,
      triggerHideElId: hideElId === 'paste self' ? element.id : hideElId,
    };
  });

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: state.showingPageId,
  };
};

const setElementTrigger = (tri, id, state) => {
  const { past, present, future } = state;
  let newPast = past.slice(0);
  newPast.push({ ...present });
  let newPresent = clone(present);
  let currentPage = findItemById(newPresent.pages, state.showingPageId);
  let element = findItemById(currentPage.elements, id);

  element.config = { ...element.config, ...tri };

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: state.showingPageId,
  };
};

const setElementContent = (content, id, state) => {
  const { past, present, future } = state;
  let newPast = past.slice(0);
  newPast.push({ ...present });
  let newPresent = clone(present);
  let currentPage = findItemById(newPresent.pages, state.showingPageId);
  let element = findItemById(currentPage.elements, id);
  element.content = content;
  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: state.showingPageId,
  };
};

const setRevoke = (state) => {
  const { past, present, future } = state;
  if (past.length > 0) {
    let newPast = past.slice(0);
    let newPresent = clone(newPast[newPast.length - 1]);
    newPast = newPast.slice(0, -1);
    let newFuture = future.slice(0);
    newFuture.push({ ...present });
    let currentPage = findItemById(newPresent.pages, state.showingPageId);
    return {
      ...state,
      past: newPast,
      present: newPresent,
      future: newFuture,
      showingPageId: currentPage
        ? currentPage.id
        : newPresent.pages[newPresent.pages.length - 1].id,
    };
  } else {
    return {
      ...state,
      past: past.slice(0),
      present: { ...present },
      future: future.slice(0),
      showingPageId: state.showingPageId,
    };
  }
};

const setRollBack = (state) => {
  const { past, present, future } = state;

  if (future.length > 0) {
    let newPast = past.slice(0);
    newPast.push({ ...present });
    let newFuture = future.slice(0, -1);
    let newPresent = clone(future[future.length - 1]);
    let currentPage = findItemById(newPresent.pages, state.showingPageId);

    return {
      ...state,
      past: newPast,
      present: newPresent,
      future: newFuture,
      showingPageId: currentPage
        ? currentPage.id
        : newPresent.pages[newPresent.pages.length - 1].id,
    };
  } else {
    return {
      ...state,
      past: past.slice(0),
      present: { ...present },
      future: future.slice(0),
      showingPageId: state.showingPageId,
    };
  }
};

const getScale = (layout, width, height) => {
  const main = document.getElementById('ID-App-Main');
  const mainWidth = width * 0.9;
  const mainHeight = height * 0.9;
  console.log(mainWidth, mainHeight);
  let w = layout.width;
  let h = layout.height;
  let wr = w / mainWidth;
  let hr = h / mainHeight;
  let s = 1;
  if (w > mainWidth || h > mainHeight) {
    if (wr >= hr) {
      s = 1 / wr;
    } else {
      s = 1 / hr;
    }
    s = Math.floor(s * 1000) / 1000;
    return s;
  }
  return 1;
};

const copyElement = (key, state) => {
  const { past, present, future } = state;
  let newPast = past.slice(0);
  newPast.push({ ...present });
  let newPresent = clone(present);
  let cPage = newPresent.pages.find((item) => item.id === state.showingPageId);
  let onPasteId = state.onPasteId;

  if (cPage.elements && cPage.elements.length && key === 'CtrlC') {
    const groupIds = [];
    const isGroup = state.selectElementId.includes('group:');
    const groupName = state.selectElementId.replace('group:', '');

    cPage.elements.map((element, index) => {
      // 复制的为分组元素
      if (isGroup && element.config && element.config.groupName === groupName) {
        groupIds.push(element.id);
      }
      // 复制的为单个元素
      else if (element.id === state.selectElementId) {
        groupIds.push(element.id);
      }
    });

    if (groupIds.length === 0) return state;

    onPasteId = [state.showingPageId, isGroup ? groupName : false, groupIds];
  }
  // 粘贴
  else if (key === 'CtrlV' && onPasteId) {
    let copyPage = newPresent.pages.find((item) => item.id === onPasteId[0]);
    // 单独复制元素，不带分组属性，复制的是分组时带分组属性。
    const newGroupName = onPasteId[1] ? onPasteId[1] + '_' + nanoid(8) : '';

    onPasteId[2].forEach((id) => {
      let copyElement = copyPage.elements.find((item) => item.id === id);
      copyElement = clone(copyElement);
      const newId = nanoid(24);
      cPage.elements.push(copyElement);

      // 题型的特殊处理,题型的content里用到了element的id,需要全局替换一下新id
      if (
        copyElement.type === ElementTypes.choiceQuestion ||
        copyElement.type === ElementTypes.questionGroup
      ) {
        const idReg = new RegExp(copyElement.id, 'g');
        copyElement.content[0].value = copyElement.content[0].value.replace(
          idReg,
          newId
        );
      }

      copyElement.id = newId;
      copyElement.config.groupName = newGroupName;
    });
  }
  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: state.showingPageId,
    onPasteId,
  };
};

const deleteElement = (state, id) => {
  const { past, present, future } = state;
  if (!state.selectElementId) return state;

  let newPast = past.slice(0);
  newPast.push({ ...present });
  let newPresent = clone(present);
  let cPage = newPresent.pages.find((item) => item.id === state.showingPageId);
  if (cPage.elements && cPage.elements.length) {
    const isGroup = state.selectElementId.includes('group:');
    const groupName = state.selectElementId.replace('group:', '');

    cPage.elements = cPage.elements.filter((element) =>
      isGroup
        ? element.config.groupName !== groupName
        : element.id !== state.selectElementId
    );
  }

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
    showingPageId: state.showingPageId,
  };
};

const selectElement = (id, state) => {
  const { past, present, future } = state;
  let newPresent = { ...present };

  newPresent.pages.forEach((page) => {
    page.elements.forEach((element) => {
      element.config.select = false;
    });
  });

  if (!id.includes('group:') && id) {
    let cPage = newPresent.pages.find(
      (item) => item.id === state.showingPageId
    );
    let cEle = cPage.elements.find((item) => item.id === id);
    cEle.config.select = true;
  }

  return {
    ...state,
    // past: newPast,
    present: newPresent,
    future: future.slice(0),
    showingPageId: state.showingPageId,
    selectElementId: id,
  };
};

const setPageIsvertical = (state, action) => {
  const newState = { ...state };
  if (!newState.present) {
    newState.present = {};
  }
  const { present } = newState || {};
  if (!present.config) {
    present.config = {};
  }
  present.config.isVertical = action.isVertical;
  return newState;
};

const actSetPageColor = (color, isAll, state) => {
  const { past, present, future } = state;
  const newPresent = { ...present };
  if (isAll) {
    newPresent.config.color = color;
    /* if (newPresent.config.image) {
      delete newPresent.config.image;
    } */

    newPresent.pages.forEach((page) => {
      if (!page.config) {
        page.config = {};
      }
      page.config.color = color;
      /* if (page.config.image) {
        delete page.config.image;
      } */
    });
  } else {
    let currentPage = findItemById(newPresent.pages, state.showingPageId);

    if (!currentPage.config) {
      currentPage.config = {};
    }
    currentPage.config.color = color;
    /* if (currentPage.config.image) {
      delete currentPage.config.image;
    } */
  }
  return {
    past: past.slice(0),
    present: newPresent,
    future: future.slice(0),
    showingPageId: state.showingPageId,
  };
};

const actSetPageAllBackground = (image, state) => {
  const { past, present, future } = state;
  const newPresent = { ...present };
  newPresent.config.image = { ...newPresent.config.image, ...image };
  /* if (newPresent.config.color) {
    delete newPresent.config.color;
  } */

  newPresent.pages.forEach((page) => {
    if (!page.config) {
      page.config = {};
    }
    page.config.image = { ...page.config.image, ...image };
    /* if (page.config.color) {
      delete page.config.color;
    } */
  });

  return {
    past: past.slice(0),
    present: newPresent,
    future: future.slice(0),
    showingPageId: state.showingPageId,
  };
};

const actSetPageBackground = (image, state) => {
  const { past, present, future } = state;
  const newPresent = { ...present };
  let currentPage = findItemById(newPresent.pages, state.showingPageId);
  if (!currentPage.config) {
    currentPage.config = {};
  }
  currentPage.config.image = { ...currentPage.config.image, ...image };
  return {
    past: past.slice(0),
    present: newPresent,
    future: future.slice(0),
    showingPageId: state.showingPageId,
  };
};

const actRemoveImage = (removeAll, state) => {
  const { past, present, future } = state;
  const newPresent = { ...present };

  if (removeAll) {
    newPresent.pages.forEach((value) => {
      if (
        value.config.image &&
        newPresent.config.image.url === value.config.image.url
      ) {
        delete value.config.image;
      }
    });

    delete newPresent.config.image;
  } else {
    let currentPage = findItemById(newPresent.pages, state.showingPageId);
    delete currentPage.config.image;
  }
  return {
    past: past.slice(0),
    present: newPresent,
    future: future.slice(0),
    showingPageId: state.showingPageId,
  };
};
const addRemoveTopicSet = (state, topic, action = 'add') => {
  let { questionSet } = state;
  if (action === 'add') {
    questionSet.push(topic);
  } else if (action === 'remove') {
    questionSet = questionSet.filter((topic1) => {
      return topic1.id !== topic.id;
    });
  } else {
    questionSet = questionSet.map((topic1) => {
      if (topic.id === topic1.id) {
        topic1 = clone(topic);
      }
      return topic1;
    });
  }
  return {
    ...state,
    questionSet,
  };
};
const joinOrExitQuestionSet = (state, pageId, quesetionSetId1) => {
  let { present } = state;
  const newPresent = clone(present);
  newPresent.pages.forEach((page, index) => {
    if (page.id === pageId) {
      page.questionSetId =
        page.questionSetId === quesetionSetId1 ? '' : quesetionSetId1;
      page.elements.forEach((ele, index) => {
        ele.config.questionSetId =
          ele.config.questionSetId === quesetionSetId1 ? '' : quesetionSetId1;
      });
    }
  });
  console.log('添加set', {
    ...state,
    present: newPresent,
  });
  return {
    ...state,
    present: newPresent,
  };
};
// 替换当前元素的内容
const replaceTemplate = (state, oldStr, newStr, elementId, config) => {
  const { past, present, future } = state;
  let newPast = past.slice(0);
  let newPresent = { ...present };
  let currentPage = findItemById(newPresent.pages, state.showingPageId);
  currentPage.elements.forEach((v) => {
    if (elementId === v.id) {
      if (config) {
        v.config.width = config.width;
        v.config.height = config.height;
      }
      v.content[0].value = v.content[0].value.replace(oldStr, newStr);
    }
  });
  // console.log('oldStr, newStr', oldStr, newStr);
  return {
    ...state,
    past: newPast,
    present: newPresent,
    future: future.slice(0),
  };
};

const actSetMusic = (state, payload) => {
  const { present } = state;
  let newPresent = { ...present };
  let bgmusic = [];
  if (payload.music) {
    if (!newPresent.config.backgroundMusic) {
      newPresent.config.backgroundMusic = [];
    }
    bgmusic = newPresent.config.backgroundMusic.concat(payload);
  }
  console.log(bgmusic);
  newPresent.config.backgroundMusic = bgmusic;
  return {
    ...state,
    present: newPresent,
  };
};
const actSetPageTurn = (state, payload) => {
  const { present } = state;
  let newPresent = { ...present };
  newPresent.config.pageTurn = payload.pageTurn;
  return {
    ...state,
    present: newPresent,
  };
};

const actDelMusic = (state, payload) => {
  const { present } = state;
  let newPresent = { ...present };
  newPresent.config.backgroundMusic.splice(payload, 1);
  return {
    ...state,
    present: newPresent,
  };
};

const actGetPageData = (state, payload) => {
  const { present } = state;
  let newPresent = { ...present };

  newPresent = payload;

  return {
    ...state,
    showingPageId: newPresent.pages[0].id,
    present: newPresent,
  };
};

const splitElementHTML = (elements) => {
  if (elements.length > 0) {
    const element = elements[0];
    return element.innerHTML
      .replace(/(^\s*)|(\s*$)/g, '')
      .split('<div class="para"></div>')
      .filter((para) => !!para);
  }
  return false;
};

const splitElementContent = (content) => {
  const div = document.createElement('div');
  div.innerHTML = content
    .replace(/<span/g, "<div style='display: inline'")
    .replace(/<\/span>/g, '</div>');
  const simp = div.getElementsByClassName('simp-p');
  const simpParas = splitElementHTML(simp) || [];
  const trad = div.getElementsByClassName('trad-p');
  const tradParas = splitElementHTML(trad) || [];
  return simpParas.map((para, index) => {
    const _div = document.createElement('div');
    _div.innerHTML = content;
    _div.getElementsByClassName('simp-p')[0].innerHTML = para;
    _div.getElementsByClassName('trad-p')[0].innerHTML = tradParas[index];
    return _div.innerHTML;
  });
};

// 上传文本框
const actInsertUploadedText = (state, payload) => {
  // console.log('actInsertUploadedTextactInsertUploadedTextactInsertUploadedText', state, payload)
  const { past, present, future } = state;
  const previous = { ...present };
  // let newPast = past.slice(0);
  //const pageId = state.showingPageId;
  // newPast.push(previous);
  const newPresent = clone(present);
  payload.forEach((element) => {
    let index = element.index;
    let cPage =
      index > newPresent.pages.length - 1
        ? createNewPageObject(index, present.config.isVertical, state)
        : newPresent.pages[index];
    if (!cPage.config) {
      cPage.config = {};
    }
    //背景图片设置
    if (element.image) {
      if (cPage.config) {
        cPage.config.image = {
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          opacity: 0,
          url: element.image,
        };
      } else {
        cPage.config = {
          image: {
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            opacity: 0,
            url: element.image,
          },
        };
      }
    }
    let elementContents = splitElementContent(element.content.value);
    elementContents.forEach((content) => {
      let newElement = createNewElementObject(ElementTypes.textBox, content);
      newElement.config = { ...element.config, ...newElement.config };
      newElement.config.styles = JSON.stringify(newElement.config.styles);
      cPage.elements.push(newElement);
    });
    if (index > newPresent.pages.length - 1) {
      newPresent.pages.push(cPage);
    }
  });
  return {
    ...state,
    past: [],
    present: newPresent,
    future: [],
    //showingPageId: pageId
  };
};

const addStyleToContent = (content, fontStyle) => {
  // 挂在页面上 此函数仅用来在设置全局时清楚element样式
  const div = document.createElement('div');
  div.innerHTML = content.replace(/text-align:.*?[;"']/g, '');
  // .replace(/font-size:.*;/g, '')
  // .replace(/font-family:[^><]*;/g, '')
  // // .replace(/color:.*;/g, '')
  // .replace(/text-align:.*;/g, '')
  // .replace(/<span style="\s*">(.*)<\/span>/g, '$1');
  const styleNodes = div.getElementsByTagName('span');
  for (let i = 0; i < styleNodes.length; i++) {
    styleNodes[i].style.color = '';
    styleNodes[i].style.fontFamily = '';
    styleNodes[i].style.fontSize = '';
    styleNodes[i].style.textAlign = '';
  }

  return div.innerHTML;
};

const actSetAllPagesFont = (state, fontStyle) => {
  const { past, present, future } = state;
  const previous = { ...present };
  let newPast = past.slice(0);
  //const pageId = state.showingPageId;
  newPast.push(previous);
  const newPresent = clone(present);

  if (!newPresent.config) {
    newPresent.config = {};
  }

  newPresent.config.fontSize = fontStyle.fontSize;
  newPresent.config.fontFamily = fontStyle.fontFamily;
  newPresent.config.fontColor = fontStyle.color;
  newPresent.config.textAlign = fontStyle.textAlign;

  //查找全部元素并替换
  newPresent.pages.forEach((page, pIndex) => {
    if (!page.config) {
      page.config = {};
    }

    page.config.fontSize = fontStyle.fontSize;
    page.config.fontFamily = fontStyle.fontFamily;
    page.config.fontColor = fontStyle.color;
    page.config.textAlign = fontStyle.textAlign;

    page.elements.forEach((element, eIndex) => {
      if (element.type === 'TextBox') {
        //清除element content编辑器样式并添加全局样式
        newPresent.pages[pIndex].elements[eIndex].content[0].value =
          addStyleToContent(
            newPresent.pages[pIndex].elements[eIndex].content[0].value,
            fontStyle
          );
      }
    });
  });

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
  };
};

const actSetPageFont = (state, fontStyle) => {
  const { past, present, future, showingPageId } = state;
  const previous = { ...present };
  let newPast = past.slice(0);
  //const pageId = state.showingPageId;
  newPast.push(previous);
  const newPresent = clone(present);

  const currentPage = newPresent.pages.find(
    (item) => item.id === showingPageId
  );

  if (!currentPage.config) {
    currentPage.config = {};
  }

  currentPage.config.fontSize = fontStyle.fontSize;
  currentPage.config.fontFamily = fontStyle.fontFamily;
  currentPage.config.fontColor = fontStyle.color;
  currentPage.config.textAlign = fontStyle.textAlign;

  currentPage.elements.forEach((element, eIndex) => {
    if (element.type === 'TextBox') {
      //清除element content编辑器样式并添加全局样式
      currentPage.elements[eIndex].content[0].value = addStyleToContent(
        currentPage.elements[eIndex].content[0].value,
        fontStyle
      );
    }
  });

  // console.log('----------', newPresent.pages, fontStyle);

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
  };
};

const actSetAllPagesStyle = (state, pageStyle) => {
  const { past, present, future } = state;
  const previous = { ...present };
  let newPast = past.slice(0);
  //const pageId = state.showingPageId;
  newPast.push(previous);
  const newPresent = clone(present);

  if (!newPresent.config) {
    newPresent.config = {};
  }

  newPresent.config = { ...newPresent.config, ...pageStyle };

  //查找全部元素并替换
  newPresent.pages.forEach((page, pIndex) => {
    if (!page.config) {
      page.config = {};
    }

    page.config = { ...page.config, ...pageStyle };

    page.elements.forEach((element, eIndex) => {
      if (element.type === 'TextBox') {
        //清除element content编辑器样式并添加全局样式
        element.config = { ...element.config, ...pageStyle };

        const $ = window.$;

        if (element.content[0].background) {
          const tmp = $(
            '<div style="background:' +
              element.content[0].background +
              '"></div>'
          );
          tmp.css(
            'background-color',
            pageStyle.backgroundColor || 'transparent'
          );
          element.content[0].background = tmp.css('background');
        } else {
          element.content[0].background =
            pageStyle.backgroundColor || 'transparent';
        }
      }
    });
  });

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
  };
};

const actSetPageStyle = (state, pageStyle) => {
  const { past, present, future, showingPageId } = state;
  const previous = { ...present };
  let newPast = past.slice(0);
  //const pageId = state.showingPageId;
  newPast.push(previous);
  const newPresent = clone(present);

  const currentPage = newPresent.pages.find(
    (item) => item.id === showingPageId
  );

  if (!currentPage.config) {
    currentPage.config = {};
  }

  currentPage.config = { ...currentPage.config, ...pageStyle };

  currentPage.elements.forEach((element, eIndex) => {
    if (element.type === 'TextBox') {
      //清除样式并添加全局样式
      element.config = { ...element.config, ...pageStyle };

      const $ = window.$;

      if (element.content[0].background) {
        const tmp = $(
          '<div style="background:' + element.content[0].background + '"></div>'
        );
        tmp.css('background-color', pageStyle.backgroundColor || 'transparent');
        element.content[0].background = tmp.css('background');
      } else {
        element.content[0].background =
          pageStyle.backgroundColor || 'transparent';
      }
    }
  });

  // console.log('----------', newPresent.pages, fontStyle);

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
  };
};

// 设置页码
const actSetPaginate = (state, paginate) => {
  const { past, present, future } = state;
  const previous = { ...present };
  let newPast = past.slice(0);
  newPast.push(previous);
  const newPresent = clone(present);
  newPresent.paginate = clone(paginate);
  let pages = newPresent.pages;
  let insertPage = paginate.insertPage;
  if (insertPage) {
    let num = 1;
    for (let i = 0; i < pages.length; i++) {
      let page = pages[i];
      if (i < insertPage - 1) {
        page.pageContent = '';
      } else {
        if (i === insertPage - 1) {
          num = 1;
          page.pageContent = num + '';
        } else {
          num = num + 1;
          page.pageContent = num + '';
        }
      }
    }
  }
  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
  };
};

// 显示元素样式面板
const actShowElementStylePanel = (state, element) => {
  return {
    ...state,
    showElementStylePanel: true,
  };
};

// 隐藏元素样式面板
const actHideElementStylePanel = (state, element) => {
  return {
    ...state,
    showElementStylePanel: false,
  };
};

const actChangeElementConfig = (state, element) => {
  let currentPage = state.present.pages.find((item) => {
    return item.id === state.showingPageId;
  });

  let currentElement = currentPage.elements.find((item) => {
    return item.id === state.selectElementId;
  });

  if (currentElement) {
    currentElement.config = element;
  }

  return {
    ...state,
  };
};

const actChangeElementBackground = (state, background) => {
  let currentPage = state.present.pages.find((item) => {
    return item.id === state.showingPageId;
  });

  let currentElement = currentPage.elements.find((item) => {
    return item.id == state.selectElementId;
  });

  currentElement.content[0].background = background;

  return {
    ...state,
  };
};

const actAddElementsGroup = (state, payload) => {
  const newPresent = clone(state.present);

  let currentPage = newPresent.pages.find((item) => {
    return item.id === state.showingPageId;
  });

  let currentElement = currentPage.elements.find((item) => {
    return item.id === payload.id;
  });

  currentElement.config.groupName = payload.name;

  return {
    ...state,
    present: newPresent,
  };
};

const deleteElementsGroup = (state, payload) => {
  const newPresent = clone(state.present);
  let currentPage = newPresent.pages.find((item) => {
    return item.id === state.showingPageId;
  });

  // 遍历元素,清除group值
  currentPage.elements.forEach((element) => {
    if (element.config.groupName === payload) {
      element.config.groupName = '';
    }
  });

  return {
    ...state,
    present: newPresent,
  };
};

const setElementsGroup = (state, payload) => {
  const newPresent = clone(state.present);
  let currentPage = newPresent.pages.find((item) => {
    return item.id === state.showingPageId;
  });

  currentPage.elements.forEach((element) => {
    if (element.config.groupName === payload.name) {
      element.show = payload.show;
    }
  });

  return {
    ...state,
    present: newPresent,
  };
};

const setSelectGroup = (state, payload) => {
  state.selectGroupId = payload;
  return {
    ...state,
  };
};

const setElementsPosition = (state, payload) => {
  if (payload.x === 0 && payload.y === 0) return state;

  const { past, present, future } = state;
  const previous = { ...present };
  let newPast = past.slice(0);
  newPast.push(previous);
  const newPresent = clone(present);

  let currentPage = newPresent.pages.find((item) => {
    return item.id === state.showingPageId;
  });

  currentPage.elements.forEach((element) => {
    if (element.config.groupName === payload.name) {
      element.config.x = Number(element.config.x) + payload.x;
      element.config.y = Number(element.config.y) + payload.y;
    }
  });

  return {
    ...state,
    past: newPast.length <= 3 ? newPast : newPast.slice(-3),
    present: newPresent,
    future: [],
  };
};

const addDict = (state, dict) => {
  const newPresent = clone(state.present);

  if (!newPresent.config.dictionaries) {
    newPresent.config.dictionaries = [];
  }

  newPresent.config.dictionaries.find((value) => value.id === dict);

  console.log(newPresent.config.dictionaries);

  return {
    ...state,
    present: newPresent,
    future: [],
  };
};

const setDict = (state, dict) => {
  const newPresent = clone(state.present);

  if (!newPresent.config.dictionaries) {
    newPresent.config.dictionaries = [];
  }

  let newDict = newPresent.config.dictionaries.find(
    (value) => value.id === dict.id
  );

  if (newDict) {
    newPresent.config.dictionaries.forEach((value, index) => {
      if (value.id === dict.id) {
        newPresent.config.dictionaries[index] = dict;
      }
    });
  } else {
    newPresent.config.dictionaries.push(dict);
  }

  return {
    ...state,
    present: newPresent,
    future: [],
  };
};

const deleteDict = (state, id) => {
  const newPresent = clone(state.present);

  if (!newPresent.config.dictionaries) {
    newPresent.config.dictionaries = [];
  }

  newPresent.config.dictionaries = newPresent.config.dictionaries.filter(
    (value) => value.id !== id
  );

  return {
    ...state,
    present: newPresent,
    future: [],
  };
};

const renameGroup = (state, id, name) => {
  const newPresent = clone(state.present);

  const cPage = newPresent.pages.find(
    (item) => item.id === state.showingPageId
  );
  cPage.elements.forEach((element) => {
    if (element.config.groupName === id) {
      element.config.groupName = name;
    }
  });

  return {
    ...state,
    present: newPresent,
    future: [],
  };
};

const renameElement = (state, id, name) => {
  const newPresent = clone(state.present);

  const cPage = newPresent.pages.find(
    (item) => item.id === state.showingPageId
  );
  const cElement = cPage.elements.find((element) => element.id === id);
  cElement.config.name = name;

  return {
    ...state,
    present: newPresent,
    future: [],
  };
};

//reducer
const bookPages = (state = initialState, action) => {
  let newState = null;
  const { past, present, future } = state;
  switch (action.type) {
    case actionNames.ACT_NAME_SET_TRADI_SIMP:
      return setBookTradiSimp(action.payload, state);
    case actionNames.ACT_NAME_SET_PINYIN:
      return setBookPinyin(action.payload, state);
    case actionNames.ACT_NAME_AUDIO_CHANGE:
      return setBookAudio(action.payload, state);
    case actionNames.ACT_NAME_ADD_NEW_PAGE:
      return addNewPage(action.config, state);
    case actionNames.ACT_NAME_UNDO_CHANGES:
      newState = undo(past, present, future);
      return newState ? newState : state;
    case actionNames.ACT_NAME_SET_PAGE_THUMB:
      return setPageThumb(action.pageId, action.thumb, state);
    case actionNames.ACT_NAME_SET_PDF_THUMB:
      return setPDFThumb(action.pageId, action.thumb, state);
    case actionNames.ACT_NAME_SET_SHOWING_PAGE:
      return setShowingPage(action.pageId, state);
    case actionNames.ACT_NAME_ADD_ELEMENT:
      return addElementToPage(action.elementType, state, action.content);
    case actionNames.ACT_NAME_ADD_COMPOSE_ELEMENT:
      return addElementToPage(action.elementType, state, null, action.template);
    case actionNames.ACT_NAME_ADD_PAGE_ELEMENT:
      return addElementToPage(action.elementType, state, null, action.template);
    case actionNames.ACT_NAME_ADD_STATE_NEXT:
      return addElementToPage(action.elementType, state, action.content);
    case actionNames.ACT_NAME_SET_ELEMENT_SIZE:
      return setElementSize(action.elementSize, action.elementId, state);
    case actionNames.ACT_NAME_SET_ELEMENT_POS:
      return setElementPos(action.elementPos, action.elementId, state);
    case actionNames.ACT_NAME_SET_ELEMENT_ANI:
      return setElementAni(action.elementAni, action.elementId, state);
    case actionNames.ACT_NAME_SET_ELEMENT_TRIGGER: // 设置触发
      return setElementTrigger(action.elementAni, action.elementId, state);
    case actionNames.ACT_NAME_SET_ELEMENT_CONTENT:
      return setElementContent(action.content, action.elementId, state);
    case actionNames.ACT_NAME_SET_REVOKE:
      return setRevoke(state);
    case actionNames.ACT_NAME_SET_ROLL_BACK:
      return setRollBack(state);
    case actionNames.ACT_NAME_REMOVE_PAGE:
      return removePage(action.pageId, state);
    case actionNames.ACT_NAME_COPY_PAGE:
      return copyPage(state);
    case actionNames.ACT_NAME_SET_COPY_ELEMENT:
      return copyElement(action.key, state);
    case actionNames.ACT_NAME_SET_DELETE_ELEMENT:
      return deleteElement(state, action.elementId);
    case actionNames.ACT_NAME_SET_SELECT_ELEMENT:
      return selectElement(action.elementId, state);
    case actionNames.ACT_NAME_SORT_THUMBNAIL:
      return sortThumbnail(action.newList, state); // 页面切换顺序
    // return sortThumbnail(action.oldIndex, action.oldIndex, state);
    case actionNames.ACT_NAME_PAGE_IS_VERTICAL: // 是否坚屏
      return setPageIsvertical(state, action);
    case actionNames.ACT_NAME_ELEMENT_PANE: // 切换面板
      return toggleElementPane(state, action);
    case actionNames.ACT_NAME_ELEMENT_PANE_HIDE: // 隐藏面板
      return hideElementPane(state, action);
    case actionNames.ACT_NAME_ELEMENT_PANE_SHOW: // 显示面板
      return showElementPane(state, action);
    case actionNames.ACT_NAME_TOOGLE_ELEMENT: // 隐藏显示元素
      return toggleElement(state, action.elementId);
    case actionNames.ACT_NAME_SORT_ELEMENT: // 元素上下层排序
      return sortElement(state, action.newList);
    // return sortElement(state, action.oldIndex, action.newIndex);
    case actionNames.ACT_NAME_HIGHLIGHT_ELEMENT: // 高亮元素
      return highlightElement(state, action.elementId);
    case actionNames.ACT_NAME_UNHIGHLIGHT_ELEMENT: // 取消高亮元素
      return unhighlightElement(state, action.elementId);
    case actionNames.ACT_NAME_ADD_TEMPLATE_LIST: // 添加模板
      return addTemplateList(state, action.templates);
    case actionNames.ACT_NAME_ADD_COMPOSE_TEMPLATE_LIST: // 添加模板
      return addComposeTemplateList(state, action.templates);
    case actionNames.ACT_NAME_ADD_CHIOCE_QUESTION: // 添加模板
      return addElementToPage(action.elementType, state, '', action.question);
    case actionNames.ACT_NAME_ADD_PAGE_TEMPLATE_LIST: // 添加页面模板
      return addPageTemplateList(state, action.templates);
    case actionNames.ACT_NAME_ADD_TEMPLATE_TO_PAGE: // 添加元素模板到页面
      return addTemplateToPage(state, action.template);
    case actionNames.ACT_NAME_SHOW_TEMPLATE_LIST: // 显示模板列表
      return showTemplateList(state);
    case actionNames.ACT_NAME_SHOW_COMPOSE_TEMPLATE_LIST: // 显示组合模板列表
      return showComposeTemplateList(state);
    case actionNames.ACT_NAME_SHOW_AUDIO_LIST: // 显示音乐库
      return showAudioList(state);
    case actionNames.ACT_NAME_SHOW_PAGE_TEMPLATE_LIST: // 显示页面模板列表
      return showPageTemplateList(state);
    case actionNames.ACT_NAME_REPLACE_TEMPLATE: // 替换段落
      return replaceTemplate(
        state,
        action.oldStr,
        action.newStr,
        action.id,
        action.config
      );
    case actionNames.ACT_NAME_GET_PAGE_DATA:
      return actGetPageData(state, action.payload);

    case actionNames.ACT_NAME_EDIT_CHIOCE_QUESTION: // 修改题目
      return editChioceQuestion(state, action.elementId, action.content);
    case actionNames.ACT_NAME_ADD_TOPIC_SET: //添加 删除 题集
      return addRemoveTopicSet(state, action.topic, action.action);
    case actionNames.ACT_NAME_JOIN_EXIT_TOPIC_SET: //添加页面、删除页面到 题集
      return joinOrExitQuestionSet(
        state,
        action.pageId,
        action.questionSetId,
        action.action
      );

    case actionNames.ACT_NAME_SET_ELEMENT_HTML:
      return setElementTextHtml(
        state,
        action.htmlText,
        action.id,
        action.contentPos,
        action.background
      );
    case actionNames.ACT_NAME_SET_PAGE_COLOR: // 设置页面颜色
      return actSetPageColor(action.color, action.isAll, state);
    case actionNames.ACT_NAME_SET_All_BACKGROUND: // 设置页面全局背景图
      return actSetPageAllBackground(action.image, state);
    case actionNames.ACT_NAME_SET_BACKGROUND: // 设置页面全局背景图
      return actSetPageBackground(action.image, state);
    case actionNames.ACT_NAME_REMOVE_IMAGE: // 设置页面背景图
      return actRemoveImage(action.removeAll, state); // 移除背景图
    case actionNames.ACT_NAME_SET_MUSIC_CONFIG: //保存背景音乐
      return actSetMusic(state, action.payload);
    case actionNames.ACT_NAME_DEL_MUSIC: //移除背景音乐
      return actDelMusic(state, action.payload);
    case actionNames.ACT_NAME_INSERT_UPLOADED_TEXT: //add uploaded text to book
      return actInsertUploadedText(state, action.payload);
    case actionNames.ACT_NAME_SET_All_FONT: // 设置全局文字
      return actSetAllPagesFont(state, action.payload);
    case actionNames.ACT_NAME_SET_PAGE_FONT: // 设置页面文字
      return actSetPageFont(state, action.payload);
    case actionNames.ACT_NAME_SET_All_STYLE: // 设置全局文字框样式
      return actSetAllPagesStyle(state, action.payload);
    case actionNames.ACT_NAME_SET_PAGE_STYLE: // 设置页面文字框样式
      return actSetPageStyle(state, action.payload);
    case actionNames.ACT_NAME_SET_PAGINATE: // 设置页码
      return actSetPaginate(state, action.paginate);
    case actionNames.ACT_NAME_QUESTIONS_GROUP_CHANGE: // 编辑题组
      return actChangeQuestionGroup(
        state,
        action.content,
        action.deleteQ,
        action.deleteId,
        action.addQ
      );
    case actionNames.ACT_NAME_ADD_TIMER: // 添加计时器
      return addTimerToPage(state, action.content);
    case actionNames.ACT_NAME_EDIT_TIMER: // 编辑计时器
      return addTimerToPage(state, action.content, action.id);
    case actionNames.ACT_NAME_DELETE_TIMER: // 删除计时器
      return deleteTimer(state, action.id);
    case actionNames.ACT_NAME_SHOW_ELEMENT_STYLE_PANEL: // 显示元素样式面板
      return actShowElementStylePanel(state, action.element);
    case actionNames.ACT_NAME_HIDE_ELEMENT_STYLE_PANEL: // 隐藏元素样式面板
      return actHideElementStylePanel(state);
    case actionNames.ACT_NAME_CHANGE_ELEMENT_CONFIG: // 修改元素配置项
      return actChangeElementConfig(state, action.element);
    case actionNames.ACT_NAME_CHANGE_ELEMENT_BACKGROUND: // 修改元素背景
      return actChangeElementBackground(state, action.background);
    case actionNames.ACT_NAME_SET_PAGETURN: //保存背景音乐
      return actSetPageTurn(state, action.payload);
    case actionNames.ACT_NAME_ADD_ELEMENTS_GROUP: // 添加分组
      return actAddElementsGroup(state, action.payload);
    case actionNames.ACT_NAME_DELETE_ELEMENTS_GROUP: // 删除分组
      return deleteElementsGroup(state, action.payload);
    case actionNames.ACT_NAME_SET_ELEMENTS_GROUP: // 设置分组
      return setElementsGroup(state, action.payload);
    case actionNames.ACT_NAME_SET_ELEMENTS_POSITION: // 调整分组位置
      return setElementsPosition(state, action.payload);
    case actionNames.ACT_NAME_SET_SELECT_GROUP: // 选择分组
      return setSelectGroup(state, action.payload);
    case actionNames.ACT_NAME_SET_GROUP_ANI: // 设置分组动画
      return setGroupAni(action.ani, action.name, state);
    case actionNames.ACT_NAME_SET_GROUP_STYLE: // 设置分组动画
      return setGroupStyle(action.style, action.name, state);
    case actionNames.ACT_NAME_SET_GROUP_TRI: // 设置分组触发
      return setGroupTri(action.tri, action.name, state);
    case actionNames.ACT_NAME_ADD_DICT: // 添加字典
      return addDict(state, action.dict);
    case actionNames.ACT_NAME_SET_DICT: // 设置字典
      return setDict(state, action.dict);
    case actionNames.ACT_NAME_DELETE_DICT: // 删除字典
      return deleteDict(state, action.id);
    case actionNames.ACT_NAME_RENAME_GROUP: // 重命名组
      return renameGroup(state, action.id, action.name);
    case actionNames.ACT_NAME_RENAME_ELEMENT: // 重命名元素
      return renameElement(state, action.id, action.name);

    default:
      return state;
  }
};
export default bookPages;
