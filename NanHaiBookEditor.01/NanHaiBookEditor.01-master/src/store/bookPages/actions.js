const ns = 'BookPages';
export const actionNames = {
  ACT_NAME_SET_All_STYLE: `${ns}-SET_All_STYLE`,
  ACT_NAME_SET_PAGE_STYLE: `${ns}-SET_PAGE_STYLE`,
  ACT_NAME_ADD_STATE_NEXT: `${ns}-ADD_STATE_NEXT`,
  ACT_NAME_SET_PAGE_FONT: `${ns}-SET_PAGE_FONT`,
  ACT_NAME_SET_All_FONT: `${ns}-SET_ALL_FONT`, // 设置页面全局文字样式
  ACT_NAME_SET_TRADI_SIMP: `${ns}-SET_TRADI_SIMP`,
  ACT_NAME_SET_PINYIN: `${ns}-SET_PINYIN`,
  ACT_NAME_ADD_NEW_PAGE: `${ns}-ADD_NEW_PAGE`,
  ACT_NAME_COPY_PAGE: `${ns}-COPY_PAGE`,
  ACT_NAME_REMOVE_PAGE: `${ns}-REMOVE_PAGE`,
  ACT_NAME_UPDATE_PAGE: `${ns}-UPDATE_PAGE`,
  ACT_NAME_UNDO_CHANGES: `${ns}-UNDO_CHANGES`,
  ACT_NAME_REDO_CHANGES: `${ns}-REDO_CHANGES`,
  ACT_NAME_SET_PAGE_THUMB: `${ns}-SET_PAGE_THUMB`,
  ACT_NAME_SET_PDF_THUMB: `${ns}-SET_PDF_THUMB`,
  ACT_NAME_SET_SHOWING_PAGE: `${ns}-SET_SHOWING_PAGE`,
  ACT_NAME_ADD_ELEMENT: `${ns}-ADD_NEW_ELEMENT`,
  ACT_NAME_SET_ELEMENT_SIZE: `${ns}-SET_ELEMENT_SIZE`,
  ACT_NAME_SET_ELEMENT_CONTENT: `${ns}-SET_ELEMENT_CONTENT`,
  ACT_NAME_SET_ELEMENT_POS: `${ns}-SET_ELEMENT_POS`,
  ACT_NAME_SET_ELEMENT_ANI: `${ns}-SET_ELEMENT_ANI`,
  ACT_NAME_SET_ELEMENT_TRIGGER: `${ns}-SET_ELEMENT_TRIGGER`, // 设置触发动作
  ACT_NAME_SET_REVOKE: `${ns}-SET_REVOKE`,
  ACT_NAME_SET_ROLL_BACK: `${ns}-SET_ROLL_BACK`,
  ACT_NAME_SET_COPY_ELEMENT: `${ns}-SET_COPY_ELEMENT`,
  ACT_NAME_SET_DELETE_ELEMENT: `${ns}-SET_DELETE_ELEMENT`,
  ACT_NAME_SET_SELECT_ELEMENT: `${ns}-SET_SELECT_ELEMENT`,
  ACT_NAME_SORT_THUMBNAIL: `${ns}-SORT_THUMBNAIL`,
  ACT_NAME_PAGE_IS_VERTICAL: `${ns}-PAGE_IS_VERTICAL`,
  ACT_NAME_ELEMENT_PANE: `${ns}-ELEMENT_PANE`,
  ACT_NAME_ELEMENT_PANE_HIDE: `${ns}-ELEMENT_PANE_HIDE`,
  ACT_NAME_ELEMENT_PANE_SHOW: `${ns}-ELEMENT_PANE_SHOW`,
  ACT_NAME_TOOGLE_ELEMENT: `${ns}-ACT_NAME_TOOGLE_ELEMENT`,
  ACT_NAME_SORT_ELEMENT: `${ns}-ACT_NAME_SORT_ELEMENT`,
  ACT_NAME_HIGHLIGHT_ELEMENT: `${ns}-ACT_NAME_HIGHLIGHT_ELEMENT`,
  ACT_NAME_UNHIGHLIGHT_ELEMENT: `${ns}-ACT_NAME_UNHIGHLIGHT_ELEMENT`,
  ACT_NAME_SET_ELEMENT_HTML: `${ns}-ACT_NAME_SET_ELEMENT_HTML`,
  ACT_NAME_SET_PAGE_COLOR: `${ns}-ACT_NAME_SET_PAGE_COLOR`,
  ACT_NAME_ADD_TEMPLATE_LIST: `${ns}-ACT_NAME_ADD_TEMPLATE_LIST`,
  ACT_NAME_SHOW_TEMPLATE_LIST: `${ns}-ACT_NAME_SHOW_TEMPLATE_LIST`,
  ACT_NAME_REPLACE_TEMPLATE: `${ns}-ACT_NAME_REPLACE_TEMPLATE`,
  ACT_NAME_SET_All_BACKGROUND: `${ns}-ACT_NAME_SET_All_BACKGROUND`,
  ACT_NAME_SET_BACKGROUND: `${ns}-ACT_NAME_SET_BACKGROUND`,
  ACT_NAME_REMOVE_IMAGE: `${ns}-ACT_NAME_REMOVE_IMAGE`,
  ACT_NAME_ADD_COMPOSE_TEMPLATE_LIST: `${ns}-ACT_NAME_ADD_COMPOSE_TEMPLATE_LIST`,
  ACT_NAME_ADD_PAGE_TEMPLATE_LIST: `${ns}-ACT_NAME_ADD_PAGE_TEMPLATE_LIST`,
  ACT_NAME_SHOW_COMPOSE_TEMPLATE_LIST: `${ns}-ACT_NAME_SHOW_COMPOSE_TEMPLATE_LIST`,
  ACT_NAME_SHOW_AUDIO_LIST: `${ns}-ACT_NAME_SHOW_AUDIO_LIST`,
  ACT_NAME_ADD_COMPOSE_ELEMENT: `${ns}-ACT_NAME_ADD_COMPOSE_ELEMENT`,
  ACT_NAME_ADD_CHIOCE_QUESTION: `${ns}-ACT_NAME_ADD_CHIOCE_QUESTION`,
  ACT_NAME_EDIT_CHIOCE_QUESTION: `${ns}-ACT_NAME_EDIT_CHIOCE_QUESTION`,
  ACT_NAME_ADD_TOPIC_SET: `${ns}-ACT_NAME_ADD_TOPIC_SET`,
  ACT_NAME_JOIN_EXIT_TOPIC_SET: `${ns}-ACT_NAME_JOIN_EXIT_TOPIC_SET`,
  ACT_NAME_SHOW_PAGE_TEMPLATE_LIST: `${ns}-ACT_NAME_SHOW_PAGE_TEMPLATE_LIST`,
  ACT_NAME_ADD_PAGE_ELEMENT: `${ns}-ACT_NAME_ADD_PAGE_ELEMENT`,
  ACT_NAME_SET_MUSIC_CONFIG: `${ns}-SET_MUSIC_CONFIG`,
  ACT_NAME_DEL_MUSIC: `${ns}-DELETE_MUSIC`,
  ACT_NAME_GET_PAGE_DATA: `${ns}-GET_PAGE_DATA`,
  ACT_NAME_INSERT_UPLOADED_TEXT: `${ns}-INSERT_UPLOADED_TEXT`,
  ACT_NAME_SET_PAGINATE: `${ns}-SET_PAGINATE`, // 设置页码
  ACT_NAME_AUDIO_CHANGE: `${ns}-AUDIO_CHANGE`,
  ACT_NAME_QUESTIONS_GROUP_CHANGE: `${ns}-QUESTIONS_GROUP_CHANGE`,
  ACT_NAME_ADD_TIMER: `${ns}-ADD_TIMER`,
  ACT_NAME_EDIT_TIMER: `${ns}-EDIT_IMER`,
  ACT_NAME_DELETE_TIMER: `${ns}-DELETE_TIMER`,
  ACT_NAME_ADD_TEMPLATE_TO_PAGE: `${ns}-ADD_TEMPLATE_TO_PAGE`,
  ACT_NAME_SHOW_ELEMENT_STYLE_PANEL: `${ns}-SHOW_ELEMENT_STYLE_PANEL`,
  ACT_NAME_HIDE_ELEMENT_STYLE_PANEL: `${ns}-HIDE_ELEMENT_STYLE_PANEL`,
  ACT_NAME_CHANGE_ELEMENT_CONFIG: `${ns}-CHANGE_ELEMENT_CONFIG`,
  ACT_NAME_CHANGE_ELEMENT_BACKGROUND: `${ns}-CHANGE_ELEMENT_BACKGROUND`,
  ACT_NAME_SET_PAGETURN: `${ns}-SET_PAGETURN`,
  ACT_NAME_ADD_ELEMENTS_GROUP: `${ns}-ADD_ELEMENTS_GROUP`, // 添加分组
  ACT_NAME_DELETE_ELEMENTS_GROUP: `${ns}-DELETE_ELEMENTS_GROUP`, // 删除分组
  ACT_NAME_SET_ELEMENTS_GROUP: `${ns}-SET_ELEMENTS_GROUP`, // 设置分组
  ACT_NAME_SET_ELEMENTS_POSITION: `${ns}-SET_ELEMENTS_POSITION`, // 设置分组位置
  ACT_NAME_SET_SELECT_GROUP: `${ns}-SET_SELECT_GROUP`, // 选择分组
  ACT_NAME_SET_GROUP_ANI: `${ns}-SET_GROUP_ANI`, // 设置分组动画
  ACT_NAME_SET_GROUP_TRI: `${ns}-SET_GROUP_TRI`, // 设置分组触发
  ACT_NAME_SET_GROUP_STYLE: `${ns}-ACT_NAME_SET_GROUP_STYLE`, // 设置分组样式
  ACT_NAME_ADD_DICT: `${ns}-ADD_DICT`, // 添加字典
  ACT_NAME_SET_DICT: `${ns}-SET_DICT`, // 添加字典
  ACT_NAME_DELETE_DICT: `${ns}-DELETE_DICT`, // 删除字典
  ACT_NAME_RENAME_GROUP: `${ns}-RENAME_GROUP`, // 重命名组
  ACT_NAME_RENAME_ELEMENT: `${ns}-RENAME_ELEMENT` // 重命名元素
};



export const actRenameElement = (id, name) => ({
  type: actionNames.ACT_NAME_RENAME_ELEMENT,
  id,
  name
});

export const actRenameGroup = (id, name) => ({
  type: actionNames.ACT_NAME_RENAME_GROUP,
  id,
  name
});

export const actAddDict = (dict) => ({
  type: actionNames.ACT_NAME_ADD_DICT,
  dict
});

export const actSetDict = (dict) => ({
  type: actionNames.ACT_NAME_SET_DICT,
  dict
});

export const actDeleteDict = (id) => ({
  type: actionNames.ACT_NAME_DELETE_DICT,
  id
});

export const actSetGroupAni = (ani, name) => ({
  type: actionNames.ACT_NAME_SET_GROUP_ANI,
  ani,
  name
});

export const actSetGroupStyle = (style, name) => ({
  type: actionNames.ACT_NAME_SET_GROUP_STYLE,
  style,
  name
});

export const actSetGroupTri = (tri, name) => ({
  type: actionNames.ACT_NAME_SET_GROUP_TRI,
  tri,
  name
});

export const actSetSelectGroup= payload => ({
  type: actionNames.ACT_NAME_SET_SELECT_GROUP,
  payload
});

export const actSetElementPosition = payload => ({
  type: actionNames.ACT_NAME_SET_ELEMENTS_POSITION,
  payload
});

export const actAddElementsGroup = payload => ({
  type: actionNames.ACT_NAME_ADD_ELEMENTS_GROUP,
  payload
});

export const actDeleteElementsGroup = payload => ({
  type: actionNames.ACT_NAME_DELETE_ELEMENTS_GROUP,
  payload
});

export const actSetElementsGroup = payload => ({
  type: actionNames.ACT_NAME_SET_ELEMENTS_GROUP,
  payload
});

export const actAudioChange = payload => ({
  type: actionNames.ACT_NAME_AUDIO_CHANGE,
  payload
});

export const actAddStateNext = (elementType, content) => ({
  type: actionNames.ACT_NAME_ADD_STATE_NEXT,
  elementType,
  content
});

export const actSetTradiSimp = payload => ({
  type: actionNames.ACT_NAME_SET_TRADI_SIMP,
  payload
});

export const actSetAllPagesFont = payload => ({
  type: actionNames.ACT_NAME_SET_All_FONT,
  payload
});

export const actSetPageFont = payload => ({
  type: actionNames.ACT_NAME_SET_PAGE_FONT,
  payload
});

export const actSetAllPagesStyle = payload => ({
  type: actionNames.ACT_NAME_SET_All_STYLE,
  payload
});

export const actSetPageStyle = payload => ({
  type: actionNames.ACT_NAME_SET_PAGE_STYLE,
  payload
});

export const actSetPinyin = payload => ({
  type: actionNames.ACT_NAME_SET_PINYIN,
  payload
});

export const actInsertUploadedText = payload => ({
  type: actionNames.ACT_NAME_INSERT_UPLOADED_TEXT,
  payload
});

export const actGetPageData = payload => ({
  type: actionNames.ACT_NAME_GET_PAGE_DATA,
  payload
});

export const actJoinOrExitQuestionSet = (pageId, questionSetId) => ({
  type: actionNames.ACT_NAME_JOIN_EXIT_TOPIC_SET,
  pageId,
  questionSetId
});
export const actAddRemoveTopicSet = (topic, action) => ({
  type: actionNames.ACT_NAME_ADD_TOPIC_SET,
  topic,
  action
});
export const actEditChoiceQuestion = (content, elementId) => ({
  type: actionNames.ACT_NAME_EDIT_CHIOCE_QUESTION,
  content,
  elementId
});
export const actReplaceTempParagraph = (oldStr, newStr, id, config) => {
  return {
    type: actionNames.ACT_NAME_REPLACE_TEMPLATE,
    oldStr,
    newStr,
    id,
    config
  };
};
export const actSetTextHtml = (htmlText, id, pos, background) => {
  if (background) {
    return {
      type: actionNames.ACT_NAME_SET_ELEMENT_HTML,
      htmlText,
      id,
      contentPos: pos,
      background: background
    };
  } else {
    return {
      type: actionNames.ACT_NAME_SET_ELEMENT_HTML,
      htmlText,
      id,
      contentPos: pos
    };
  }
};

export const actAddTemplateList = templates => ({
  type: actionNames.ACT_NAME_ADD_TEMPLATE_LIST,
  templates
});

export const actAddComposeTemplateList = templates => ({
  type: actionNames.ACT_NAME_ADD_COMPOSE_TEMPLATE_LIST,
  templates
});

export const actAddPageTemplateList = templates => ({
  type: actionNames.ACT_NAME_ADD_PAGE_TEMPLATE_LIST,
  templates
});

export const actShowTemplateList = () => ({
  type: actionNames.ACT_NAME_SHOW_TEMPLATE_LIST
});
export const actShowComposeTemplateList = () => ({
  type: actionNames.ACT_NAME_SHOW_COMPOSE_TEMPLATE_LIST
});

export const actShowAudioList = () => ({
  // 获取音乐库数据
  type: actionNames.ACT_NAME_SHOW_AUDIO_LIST
});

export const actShowPageTemplateList = () => ({
  type: actionNames.ACT_NAME_SHOW_PAGE_TEMPLATE_LIST
});

//actions:
export const actToggleElement = elementId => ({
  type: actionNames.ACT_NAME_TOOGLE_ELEMENT,
  elementId
});

export const actSortElement = newList => ({
  type: actionNames.ACT_NAME_SORT_ELEMENT,
  newList
});
// export const actSortElement = (oldIndex, newIndex) => ({
//   type: actionNames.ACT_NAME_SORT_ELEMENT,
//   oldIndex,
//   newIndex
// });

export const actHighlightElement = elementId => ({
  type: actionNames.ACT_NAME_HIGHLIGHT_ELEMENT,
  elementId
});

export const actUnhighlightElement = elementId => ({
  type: actionNames.ACT_NAME_UNHIGHLIGHT_ELEMENT,
  elementId
});

export const actElementPaneToggle = slider => ({
  type: actionNames.ACT_NAME_ELEMENT_PANE,
  slider
});

export const actElementPaneHide = () => ({
  type: actionNames.ACT_NAME_ELEMENT_PANE_HIDE
});

export const actElementPaneShow = () => ({
  type: actionNames.ACT_NAME_ELEMENT_PANE_SHOW
});

/**
 * 是否坚屏
 * @param {boolean} isVertical
 */
export const actIsVertical = isVertical => ({
  type: actionNames.ACT_NAME_PAGE_IS_VERTICAL,
  isVertical
});

export const actSortThumbnail = (newList, oldIndex) => ({
  type: actionNames.ACT_NAME_SORT_THUMBNAIL,
  newList
});
// export const actSortThumbnail = (newIndex, oldIndex) => ({
//   type: actionNames.ACT_NAME_SORT_THUMBNAIL,
//   newIndex,
//   oldIndex
// });
export const actAddPage = config => ({
  type: actionNames.ACT_NAME_ADD_NEW_PAGE,
  config: config
});

export const actCopyPage = () => ({
  type: actionNames.ACT_NAME_COPY_PAGE
});

export const actUndo = () => ({
  type: actionNames.ACT_NAME_UNDO_CHANGES
});

export const actSetPageThumb = (base64str, pageId) => ({
  type: actionNames.ACT_NAME_SET_PAGE_THUMB,
  thumb: base64str,
  pageId: pageId
});
export const actSetPdfThumb = (base64str, pageId) => ({
  type: actionNames.ACT_NAME_SET_PDF_THUMB,
  thumb: base64str,
  pageId: pageId
});

export const actSetShowingPage = pageId => ({
  type: actionNames.ACT_NAME_SET_SHOWING_PAGE,
  pageId: pageId
});
export const actRemovePage = pageId => ({
  type: actionNames.ACT_NAME_REMOVE_PAGE,
  pageId: pageId
});

export const actAddElement = (elementType, content) => ({
  type: actionNames.ACT_NAME_ADD_ELEMENT,
  elementType: elementType,
  content
});
export const actAddTemplateToPage = template => ({
  type: actionNames.ACT_NAME_ADD_TEMPLATE_TO_PAGE,
  template
});
export const actAddComposeElement = (elementType, template) => ({
  type: actionNames.ACT_NAME_ADD_COMPOSE_ELEMENT,
  template,
  elementType
});

export const addChoiceQuestion = (elementType, question) => ({
  type: actionNames.ACT_NAME_ADD_CHIOCE_QUESTION,
  question,
  elementType
});

export const actAddPageElement = (elementType, template) => ({
  type: actionNames.ACT_NAME_ADD_PAGE_ELEMENT,
  template,
  elementType
});

export const actSetElementSize = (size, elementId) => ({
  type: actionNames.ACT_NAME_SET_ELEMENT_SIZE,
  elementSize: size,
  elementId: elementId
});

export const actSetElementPos = (pos, elementId) => ({
  type: actionNames.ACT_NAME_SET_ELEMENT_POS,
  elementPos: pos,
  elementId: elementId
});

export const actSetElementAni = (ani, elementId) => ({
  type: actionNames.ACT_NAME_SET_ELEMENT_ANI,
  elementAni: ani,
  elementId
});

export const actSetElementTrigger = (ani, elementId) => ({
  type: actionNames.ACT_NAME_SET_ELEMENT_TRIGGER,
  elementAni: ani,
  elementId
});

export const actSetElementContent = (content, elementId) => ({
  type: actionNames.ACT_NAME_SET_ELEMENT_CONTENT,
  content: content,
  elementId: elementId
});

export const actRevoke = () => ({
  type: actionNames.ACT_NAME_SET_REVOKE
});

export const actRollBack = () => ({
  type: actionNames.ACT_NAME_SET_ROLL_BACK
});

export const copyElement = key => ({
  type: actionNames.ACT_NAME_SET_COPY_ELEMENT,
  key: key
});

export const deleteElement = id => ({
  type: actionNames.ACT_NAME_SET_DELETE_ELEMENT,
  id: id
});

export const actSelectElement = elementId => ({
  type: actionNames.ACT_NAME_SET_SELECT_ELEMENT,
  elementId: elementId
});

export const actSetPageColor = (color, isAll) => ({
  type: actionNames.ACT_NAME_SET_PAGE_COLOR,
  color: color,
  isAll: isAll
});

export const actSetPageAllBackground = image => ({
  type: actionNames.ACT_NAME_SET_All_BACKGROUND,
  image: image
});

export const actSetPageBackground = image => ({
  type: actionNames.ACT_NAME_SET_BACKGROUND,
  image: image
});

export const actRemoveImage = removeAll => ({
  type: actionNames.ACT_NAME_REMOVE_IMAGE,
  removeAll: removeAll
});

export const actSetMusic = payload => ({
  type: actionNames.ACT_NAME_SET_MUSIC_CONFIG,
  payload
});

export const actDelMusic = payload => ({
  type: actionNames.ACT_NAME_DEL_MUSIC,
  payload
});

// 设置页码
export const actSetPaginate = paginate => ({
  type: actionNames.ACT_NAME_SET_PAGINATE,
  paginate: paginate
});

// 设置题组
export const actSetQuestionsGroup = (content, deleteQ, deleteId, addQ) => ({
  type: actionNames.ACT_NAME_QUESTIONS_GROUP_CHANGE,
  content,
  deleteQ,
  deleteId,
  addQ
});

// 添加计时器
export const actAddTimer = content => ({
  type: actionNames.ACT_NAME_ADD_TIMER,
  content
});

// 编辑计时器
export const actEditTimer = (content, id) => ({
  type: actionNames.ACT_NAME_EDIT_TIMER,
  content,
  id
});
// 删除计时器
export const actDeleteTimer = id => ({
  type: actionNames.ACT_NAME_DELETE_TIMER,
  id
});
// 显示元素样式面板
export const actShowElementStylePanel = element => ({
  type: actionNames.ACT_NAME_SHOW_ELEMENT_STYLE_PANEL,
  element
});

// 关闭元素样式面板
export const actHideElementStylePanel = () => ({
  type: actionNames.ACT_NAME_HIDE_ELEMENT_STYLE_PANEL
});

// 修改元素配置
export const actChangeElementConfig = element => ({
  type: actionNames.ACT_NAME_CHANGE_ELEMENT_CONFIG,
  element
});

// 修改元素背景
export const actChangeElementBackground = background => ({
  type: actionNames.ACT_NAME_CHANGE_ELEMENT_BACKGROUND,
  background
});

// 设置翻页动画
export const actSetPageTurn = payload => ({
  type: actionNames.ACT_NAME_SET_PAGETURN,
  payload
});
