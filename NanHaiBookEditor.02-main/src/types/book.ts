export type BookElementConfig = {
  triggerHideDelay?: number;
  triggerHideAni?: string;
  name?: string;
  extends?: string;
  x?: string;
  y?: string;
  width?: number;
  height?: number;
  template?: string;
  select?: boolean;
  groupName?: string;
  anidelay?: number;
  duration?: number;
  anitimes?: number;
  trigger?: number;
  triggerType?: number;
  triggerMusicTimes?: number;
  triggerMusicLoop?: boolean;
  triggerAniTimes?: number;
  triggerAniLoop?: boolean;
  triggerAniDuration?: number;
  triggerAniDelay?: number;
  triggerPicW?: number;
  triggerPicH?: number;
  triggerPicX?: number;
  triggerPicY?: number;
  editable?: boolean;
  aniloop?: boolean;
  aniClassName?: string;
  rotateDeg?: string;
  audio?: string;
  triggerMusicName?: string;
  triggerAniName?: string;
  triggerPicName?: string;
  triggerPicUrl?: string;
  triggerPicAni?: string;
  borderRadius?: number;
  padding?: number;
  backgroundColor?: string;
  border?: string;
  shadow?: string;
  showState?: boolean;
  triggerElId?: string;
  triggerAudio?: string;
  hideDelay?: number;
  bringToFront?: boolean;
  aniAudioUrl?: string;
  aniAudioName?: string;
  triggerHideElId?: string;
  bringToBack?: boolean;
};

export type BookElementContent = {
  background: string;
  type: 'html';
  value: string;
}[];

export enum BookElementType {
  textBox = 'TextBox',
  tableBox = 'TableBox',
  leafletMap = 'leafletMap',
  templateCard = 'templateCard',
  drawingBox = 'DrawingBox',
  composeTemplates = 'ComposeTemplates',
  choiceQuestion = 'ChoiceQuestion',
  questionGroup = 'QuestionGroup',
  newChoiceQuestion = 'NewChoiceQuestion',
  pageTemplates = 'pageTemplates',
  imageBox = 'ImageBox',
  videoBox = 'VideoBox',
  audioBox = 'AudioBox',
  nextButton = 'NextButton',
  insertCode = 'InsertCode',
  colorFillGame = 'ColorFillGame',
  atlas = 'Atlas',
  typingBox = 'TypingBox',
}

export type BookElement = {
  id: string;
  type: BookElementType;
  content: BookElementContent;
  config: BookElementConfig;
  show: boolean;
  innerHTML?: string;
};

export type BookPageConfigImage = {
  backgroundRepeat: 'no-repeat' | 'repeat';
  backgroundSize: string;
  opacity: number;
  url: string;
};

export type BookPageConfigColor = {
  color: string;
  type: 0 | 1; // 0 pure color; 1 Gradient;
};

export type FontStyles = {
  fontColor: string;
  fontFamily: string;
  fontSize: number;
};

export type ContainerStyles = {
  borderRadius: number;
  padding: number;
  border?: string;
  shadow?: string;
  backgroundColor?: string;
};

export type CommonStylesSetting = FontStyles &
  ContainerStyles & {
    textAlign?: 'left' | 'center' | 'right';
  };

export type BookPageConfig = {
  image?: BookPageConfigImage;
  color?: BookPageConfigColor;
  groupList?: string[];
} & CommonStylesSetting;

export type BookPage = {
  id: string;
  elements: BookElement[];
  showElementPane: boolean;
  pageContent?: string;
  config: BookPageConfig;
  index?: number;
  thumb?: string;
};

export type BackGroundMusic = {
  page: string;
  music: string;
  name: string;
  loop: boolean;
};

export type Dictionary = {
  id: string;
  dictContent: string;
  dictContentTradition: string;
  dictContentLink: string;
  dictImage: DictMedia;
  dictImageLink: string;
  dictAudio: DictMedia;
};

export type DictMedia = {
  url: string;
  name: string;
};

export type BookConfig = {
  image?: BookPageConfigImage;
  color?: BookPageConfigColor;
  backgroundMusic: BackGroundMusic[];
  isVertical: boolean;
  pinyin: boolean;
  simple: boolean;
  audio: boolean;
  timer: timer[];
  pageTurn: 0 | 1;
  dictionaries: Dictionary[];
} & CommonStylesSetting;

export type Book = {
  id: string;
  bookCode?: string;
  bookName?: string;
  config: BookConfig;
  pages: BookPage[];
  paginate?: paginate;
  userId: string;
};

export type timer = {
  countDown: boolean;
  duration: number;
  size: number;
  fontSize: number;
  fontColor: string;
  bgColor: string;
  bgSize: number;
  fgColor: string;
  fgSize: number;
  scope: string;
  x: number;
  y: number;
  id: string;
};

export type paginate = {
  color: string;
  fontFamily: string;
  fontSize: 0;
  paginatShow: true;
  margin: {
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
  };
  position: {
    align: string;
    bottom: string;
    header: string;
  };
  isBold: true;
  isItalic: true;
};
