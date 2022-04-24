export type QuestionTypes = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Size = { width: number; height: number };

export interface TextStyle {
  lineHeight?: string;
  color?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
}

export interface PicOptions {
  url: string;
  width: number;
  height: number;
  default: boolean;
  svg?: string;
}

export interface CommonQuestionOptions {
  textStyle?: TextStyle;
  content: string;
  pinyin: string;
  tradi: string;
  pic?: PicOptions;
  audio?: string;
}

//choice
interface ChoiceOptions {
  questionId: String,
  questionType: 0;
  question: CommonQuestionOptions;
  answer: ChoiceAnswerOptions;
  analysis: AnalysisOptions;
  settings: CommonSettingOptions;
}

interface ChoiceSelection {
  id: number;
  isRight: boolean; // if is right answer
  content: string;
  pinyin: string;
  tradi: string;
  pic?: PicOptions;
  audio?: string;
  jumpToPage?: string; // jumpToPage only exit in single selection
}

interface ChoiceAnswerOptions {
  id?: number;
  type?: 1 | 2; // single , multi
  rows?: 1 | 2 | 3 | 0; // number of selection rows
  marginTop?: number; // gap between selections
  textStyle?: TextStyle; // selection text style
  selections: ChoiceSelection[];
}
export { ChoiceOptions, ChoiceAnswerOptions, ChoiceSelection };

// blank
interface FillBlankOptions {
  questionId: String,
  questionType: 1;
  question: CommonQuestionOptions;
  answer: FillBlankAnswerOptions;
  analysis: AnalysisOptions;
  settings: CommonSettingOptions;
}

type FillBlankAnswerOptions = {
  trad: string;
  simp: string;
}[][];
export { FillBlankOptions, FillBlankAnswerOptions };

// array
interface ArrayOptions {
  questionId: String,
  questionType: 2;
  question: CommonQuestionOptions;
  answer: ArrayAnswerOptions;
  analysis: AnalysisOptions;
  settings: CommonSettingOptions;
}

interface ArrayAnswerOptions {
  type: 'horizontal' | 'vertical';
  textStyle?: TextStyle; // selection text style
  array: ArrayItem[];
}

interface ArrayItem {
  id: number;
  content: string;
  pinyin: string;
  tradi: string;
  answer: number;
  pic?: PicOptions;
  audio?: string;
}

export { ArrayOptions, ArrayAnswerOptions, ArrayItem };

// line
interface LinesOptions {
  questionId: String,
  questionType: 3;
  question: CommonQuestionOptions;
  answer: LinesAnswerOptions;
  analysis: AnalysisOptions;
  settings: CommonSettingOptions;
}

interface LineOptions {
  id: number;
  left: {
    content: string;
    pinyin: string;
    tradi: string;
    pic?: PicOptions;
    audio?: string;
  };
  right: {
    index: number;
    content: string;
    pinyin: string;
    tradi: string;
    pic?: PicOptions;
    audio?: string;
  };
}
interface LinesAnswerOptions {
  textStyle?: TextStyle; // selection text style
  lines: LineOptions[];
}

export { LinesOptions, LineOptions, LinesAnswerOptions };

// pic
interface PicsOptions {
  questionId: String,
  questionType: 4;
  question: CommonQuestionOptions;
  answer: PicAnswerOptions;
  analysis: AnalysisOptions;
  settings: CommonSettingOptions;
}

interface PicAnswerOptions {
  pic: PicOptions;
  answer: {
    id: string | number;
    w: string;
    h: string;
    x: string;
    y: string;
  }[];
}

export { PicsOptions, PicAnswerOptions };

// sort
interface SortOptions {
  questionId: String,
  questionType: 5;
  question: SortQuestionOptions;
  answer: SortAnswerOptions;
  analysis: AnalysisOptions;
  settings: CommonSettingOptions;
}

interface SortQuestion {
  id: number;
  content: string;
  pinyin: string;
  tradi: string;
  pic?: PicOptions;
  audio?: string;
  background?: string;
}

interface SortQuestionOptions {
  textStyle?: TextStyle;
  sort: SortQuestion[];
  sortSize?: Size;
}

interface SortItem {
  id: number;
  pic?: PicOptions;
  content?: string;
  pinyin: string;
  tradi: string;
  answer: number;
  audio?: string;
}

interface SortAnswerOptions {
  type: 0 | 1;
  answer: SortItem[];
}

interface ImageSortAnswer {
  type: 0;
  answer: {
    pic: PicOptions;
    answer: number;
  }[];
}

interface WordSortAnswer {
  type: 1;
  answer: {
    pic: PicOptions;
    content?: string;
    pinyin?: string;
    tradi?: string;
    answer: number;
    audio?: string;
  }[];
}

export {
  ImageSortAnswer,
  WordSortAnswer,
  SortAnswerOptions,
  SortQuestionOptions,
  SortQuestion,
  SortItem
};

export interface AnalysisOptions {
  textStyle?: TextStyle;
  content: string;
  pinyin: string;
  tradi: string;
}

interface CommonSettingOptions {
  type: 1 | 2; // 1 Auto show answer  ， 2 Continue when choose the wrong answer
  wrongAudio?: string;
  rightAudio?: string;
  pageLocked: boolean;
  groupIndex?: number;
}

export { CommonSettingOptions };

interface AudioOptions {
  questionId: String,
  questionType: 6;
  question: CommonQuestionOptions;
  settings: CommonSettingOptions;
  analysis: AnalysisOptions;
}
interface WritingAnswerOptions {
  textStyle?: TextStyle; // selection text style,
  maxLength: number;
  minLength?: number;
  height?: number;
}
interface WritingOptions {
  questionId: String,
  questionType: 7;
  question: CommonQuestionOptions;
  answer: WritingAnswerOptions;
  settings: CommonSettingOptions;
  analysis: AnalysisOptions;
}

export { WritingAnswerOptions, WritingOptions };

type QuestionsOptions =
  | ChoiceOptions
  | FillBlankOptions
  | ArrayOptions
  | LinesOptions
  | PicsOptions
  | SortOptions
  | AudioOptions
  | WritingOptions;


export type AnswerOptions =
  | ChoiceAnswerOptions
  | ArrayAnswerOptions
  | WritingAnswerOptions
  | LinesAnswerOptions
  | FillBlankAnswerOptions
  | SortAnswerOptions
  | PicAnswerOptions;
  
interface QuestionOptions {
  questionId: String,
  questionType: QuestionTypes;
  question: CommonQuestionOptions | SortQuestionOptions;
  answer?: AnswerOptions;
  analysis: AnalysisOptions;
  settings: CommonSettingOptions;
}

export { QuestionOptions, QuestionsOptions };
