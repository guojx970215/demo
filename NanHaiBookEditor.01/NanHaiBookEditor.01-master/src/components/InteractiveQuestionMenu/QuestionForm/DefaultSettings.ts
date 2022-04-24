import { QuestionsOptions, CommonSettingOptions } from './types';

const question = {
  pic: { url: '', width: 50, height: 50, default: false },
  content: '',
  pinyin: '', // 新加字段
  tradi: '', // 新加字段
  textStyle: {
    lineHeight: '1em',
    color: '#000000',
    fontSize: 24,
    bold: false,
    italic: false,
  },
  audio: '',
};

const analysis = {
  textStyle: {
    lineHeight: '1em',
    color: '#000000',
    fontSize: 24,
    bold: false,
    italic: false,
  },
  content: '',
  pinyin: '', // 新加字段
  tradi: '', // 新加字段
};

const settings: CommonSettingOptions = {
  type: 2,
  wrongAudio: '',
  rightAudio: '',
  pageLocked: false,
  groupIndex: 0,
};

const commonOptions = {
  questionId: '',
  question,
  analysis,
  settings
};

export const DEFAULT_OPTIONS: QuestionsOptions[] = [
  // 选择题
  {
    ...commonOptions,
    questionType: 0,
    answer: {
      type: 1,
      rows: 1,
      marginTop: 12,
      textStyle: {
        lineHeight: '1em',
        color: '#000000',
        fontSize: 24,
        bold: false,
        italic: false,
      },
      selections: [
        {
          id: 0,
          isRight: true,
          content: '',
          pinyin: '', // 新加字段
          tradi: '', // 新加字段
          pic: { url: '', height: 50, width: 50, default: false },
          audio: '',
          jumpToPage: '',
        },
        {
          id: 1,
          isRight: false,
          content: '',
          pinyin: '', // 新加字段
          tradi: '', // 新加字段
          pic: { url: '', height: 50, width: 50, default: false },
          audio: '',
          jumpToPage: '',
        },
        {
          id: 2,
          isRight: false,
          content: '',
          pinyin: '', // 新加字段
          tradi: '', // 新加字段
          pic: { url: '', height: 50, width: 50, default: false },
          audio: '',
          jumpToPage: '',
        },
        {
          id: 3,
          isRight: false,
          content: '',
          pinyin: '', // 新加字段
          tradi: '', // 新加字段
          pic: { url: '', height: 50, width: 50, default: false },
          audio: '',
          jumpToPage: '',
        },
      ],
    },
    settings: {
      ...settings,
      pageLocked: true
    }
  },
  // 填空题
  {
    ...commonOptions,
    questionType: 1,
    answer: [],
  },
  // 排序题
  {
    ...commonOptions,
    questionType: 2,
    answer: {
      type: 'horizontal',
      textStyle: {
        lineHeight: '1em',
        color: '#000000',
        fontSize: 24,
        bold: false,
        italic: false,
      },
      array: [
        {
          id: 0,
          content: '',
          pinyin: '', // 新加字段
          tradi: '', // 新加字段
          answer: 1,
          pic: { url: '', width: 50, height: 50, default: false },
          audio: '',
        },
      ],
    },
  },
  // 连线题
  {
    ...commonOptions,
    questionType: 3,
    answer: {
      textStyle: {
        lineHeight: '1em',
        color: '#000000',
        fontSize: 24,
        bold: false,
        italic: false,
      },
      lines: [
        {
          id: 0,
          left: {
            content: '',
            pinyin: '', // 新加字段
            tradi: '', // 新加字段
            pic: { url: '', width: 50, height: 50, default: false },
            audio: '',
          },
          right: {
            index: 1,
            content: '',
            pinyin: '', // 新加字段
            tradi: '', // 新加字段
            pic: { url: '', width: 50, height: 50, default: false },
            audio: '',
          },
        },
      ],
    },
  },
  // 图片题
  {
    ...commonOptions,
    questionType: 4,
    answer: {
      answer: [],
      pic: { url: '', width: 50, height: 50, default: false },
    },
  },
  // 分类题
  {
    ...commonOptions,
    questionType: 5,
    question: {
      textStyle: {
        lineHeight: '1em',
        color: '#000000',
        fontSize: 24,
        bold: false,
        italic: false,
      },
      sort: [
        {
          id: 0,
          content: '',
          pinyin: '', // 新加字段
          tradi: '', // 新加字段
          pic: { url: '', width: 50, height: 50, default: false },
          audio: '',
          background: '',
        },
      ],
      sortSize: {
        width: 210,
        height: 240,
      },
    },
    answer: {
      type: 0,
      answer: [
        {
          id: 0,
          pic: { url: '', width: 50, height: 50, default: false },
          answer: 0,
          content: '',
          pinyin: '', // 新加字段
          tradi: '', // 新加字段
          audio: '',
        },
      ],
    },
  },
  // 录音题
  {
    ...commonOptions,
    questionType: 6,
  },
  // 写作题
  {
    ...commonOptions,
    questionType: 7,
    answer: {
      textStyle: {
        lineHeight: '1em',
        color: '#000000',
        fontSize: 24,
        bold: false,
        italic: false,
      },
      maxLength: 5000,
      height: 300,
    },
  },
];
