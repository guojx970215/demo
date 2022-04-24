import { Modal, Tabs, message } from 'antd';
import React, { useState, useEffect } from 'react';
import Api from '../../../api/bookApi';
import QuestionQuestion, {
  getCommonQuestion,
  getSortQuestion,
  parseQuestion,
} from './QuestionQuestion/QuestionQuestion'; // 题目
import QuestionAnalysis, {
  parseAnalysis,
} from './QuestionAnalysis/QuestionAnalysis';
import {
  QuestionOptions,
  QuestionTypes,
  QuestionsOptions,
  SortQuestionOptions,
  CommonQuestionOptions,
  AnalysisOptions,
  CommonSettingOptions,
  AnswerOptions,
  FillBlankAnswerOptions,
} from './types';
import QuestionSettings, {
  parseQuestionSettings,
} from './QuestionSettings/QuestionSettings';
import { DEFAULT_OPTIONS } from './DefaultSettings';
import AnswerContainer, { parseAnswers } from './QuestionAnswer/QuestionAnswer';
import { getChoiceStr } from './QuestionAnswer/ChoiceAnswer';
import { getFillBlankStr } from './QuestionAnswer/FillBlankAnswer';
import { getArrayStr } from './QuestionAnswer/ArrayAnswer';
import { getLinesStr } from './QuestionAnswer/LinesAnswer';
import { getPicStr } from './QuestionAnswer/PicAnswer';
import { getSortStr } from './QuestionAnswer/SortAnswer';
import { getWritingStr } from './QuestionAnswer/WritingAnswer';
import './AddQuestionForm.css';

interface QuestionFormProps {
  visible: boolean; // 弹窗的显隐 boolean
  onCancel?: () => void; // 关闭弹窗
  content?: string; // 被编辑的题型Dom
  trans: any;
  questionType?: QuestionTypes; // 题型
  onOk?: (question: StringifyResult) => void;
}

const QuestionForm = (props: QuestionFormProps) => {
  const { visible, onCancel, content, trans, questionType, onOk } = props;

  const [type, setType] = useState<QuestionTypes>(0);
  const [question, setQuestion] = useState<
    CommonQuestionOptions | SortQuestionOptions
  >();
  const [settings, setSettings] = useState<CommonSettingOptions>();
  const [analysis, setAnalysis] = useState<AnalysisOptions>();
  const [answer, setAnswer] = useState<AnswerOptions>();
  const [activeTab, setActiveTab] = useState<string>('1');

  useEffect(() => {
    if (!visible) return;
    const newOptions = parseQuestionDom(content, questionType);
    setType(newOptions.questionType);
    setQuestion(newOptions.question);
    setSettings(newOptions.settings);
    setAnswer(newOptions.answer);
    setAnalysis(newOptions.analysis);
  }, [content, questionType, visible]);

  // 填空题 ，有几个空对应几个答案
  useEffect(() => {
    if (type === 1) {
      const fillblankQ = (question as CommonQuestionOptions).content;

      // 判断有多少个空
      let res = fillblankQ.match(/____/g);
      let newAnswerList = answer as FillBlankAnswerOptions;

      if (!res) {
        setAnswer([]);
        return;
      }

      if (res.length === newAnswerList.length) return;
      // deleteing blank
      if (newAnswerList.length > res.length) {
        newAnswerList = newAnswerList.slice(0, res.length);
      }
      // adding new blank
      for (let i = 0; i < res.length; i++) {
        if (!newAnswerList[i]) {
          newAnswerList[i] = [
            {
              simp: '',
              trad: '',
            },
          ];
        }
      }

      setAnswer(newAnswerList);
    }
  }, [question, type]);

  const [loading, setLoading] = useState<boolean>(false);

  const onFinished = async () => {
    setLoading(true);
    const string = await stringifyQuestionDom({
      questionType: type,
      question,
      settings,
      answer,
      analysis,
    } as QuestionsOptions);
    setLoading(false);
    onOk && onOk(string);
    onCancel && onCancel();
  };

  return (
    <Modal
      visible={visible}
      title={
        content
          ? trans.AddQuestionForm.editQuestion
          : trans.AddQuestionForm.createQuestion
      }
      onCancel={onCancel}
      width="90%"
      bodyStyle={{ height: '70vh' }}
      destroyOnClose={true}
      okButtonProps={{ disabled: loading }}
      okText={
        loading ? trans.AddQuestionForm.loading : trans.AddQuestionForm.submit
      }
      cancelText={trans.AddQuestionForm.cancel}
      onOk={onFinished}
    >
      <div className="add-question-container">
        <Tabs
          tabPosition="left"
          style={{ height: '100%' }}
          activeKey={activeTab}
          onChange={setActiveTab}
        >
          <Tabs.TabPane tab={trans.AddQuestionForm.question} key="1">
            <QuestionQuestion
              trans={trans}
              questionType={type}
              question={question}
              setQuestion={setQuestion}
            ></QuestionQuestion>
          </Tabs.TabPane>
          {type !== 6 && (
            <Tabs.TabPane tab={trans.AddQuestionForm.answer} key="2">
              <AnswerContainer
                trans={trans}
                answer={answer}
                setAnswer={setAnswer}
                questionType={type}
                sort={(question as SortQuestionOptions)?.sort}
                isActive={activeTab === '2'}
              ></AnswerContainer>
            </Tabs.TabPane>
          )}
          <Tabs.TabPane tab={trans.AddQuestionForm.analysis} key="3">
            <QuestionAnalysis
              trans={trans}
              analysis={analysis}
              setAnalysis={setAnalysis}
            ></QuestionAnalysis>
          </Tabs.TabPane>
          <Tabs.TabPane tab={trans.AddQuestionForm.setting} key="4">
            <QuestionSettings
              trans={trans}
              questionType={type}
              settings={settings}
              setSettings={setSettings}
            ></QuestionSettings>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default QuestionForm;

export const getRuby = async (content: string[]): Promise<string[]> => {
  const res = await Api.getPinyinContent({ text: content });

  let resStrArray: string[] = [];
  if (res.state !== false) {
    res.forEach((value) => {
      let { simplified, traditional, pinyin } = value;

      let simpStr = '';
      let tradStr = '';

      simplified.forEach((val, idx) => {
        if (val === '\n') {
          simpStr += '</ruby><div></div><ruby>';
          tradStr += '</ruby><div></div><ruby>';
        } else {
          simpStr += `<rb>${val}</rb><rt>${pinyin[idx]}</rt>`;
          tradStr += `<rb>${traditional[idx]}</rb><rt>${pinyin[idx]}</rt>`;
        }
      });
      resStrArray.push(
        `<div style="display: inline-block"><div class="text simp-p"><ruby>${simpStr}</ruby></div><div class="text trad-p"><ruby>${tradStr}</ruby></div></div>`
      );
    });
  } else {
    message.error(res.msg || 'network error!', 3);
  }

  return resStrArray;
};

const questionType = {
  单选题: 0,
  多选题: 0,
  填空题: 1,
  排序题: 2,
  连线题: 3,
  点击题: 4,
  分类题: 5,
  录音题: 6,
  写作题: 7,
};

function getQuestionType(string: string): QuestionTypes {
  return questionType[string];
}

export function parseQuestionDom(
  domString: string,
  type?: QuestionTypes
): QuestionOptions {
  let result: QuestionOptions;

  if (!domString) {
    type = type || 0;
    result = DEFAULT_OPTIONS.find((option) => option.questionType === type);

    return result;
  }

  let div = document.createElement('div');
  div.innerHTML = domString;

  const questionType = getQuestionType(
    div.querySelector('.question-type').textContent
  );

  const questionId = div
    .querySelector('.question-container')
    .getAttribute('id')
    ?.replace('question-', '');

  result = {
    questionId: questionId,
    questionType: questionType,
    question: parseQuestion(questionType, div),
    answer: questionType !== 6 ? parseAnswers(questionType, div) : undefined,
    analysis: parseAnalysis(div),
    settings: parseQuestionSettings(div),
  };

  div = null;
  return result;
}

export function parseQuestionGroup(content) {
  const divEle = document.createElement('div');
  divEle.innerHTML = content;
  const questionEles = divEle.getElementsByClassName('question-container');
  const result = [];
  for (let i = 0; i < questionEles.length; i++) {
    result.push(parseQuestionDom(questionEles[i].outerHTML));
  }

  return result;
}

const getAnalysis = (analStyle, content) => {
  return `
  <div style="font-size: ${analStyle.fontSize}px; font-weight: ${
    analStyle.bold ? '700' : 'normal'
  }; color: ${analStyle.color}; font-style: ${
    analStyle.italic ? 'italic' : 'normal'
  }; line-height: ${analStyle.lineHeight};">
  ${content}
   </div>`;
};

type StringifyResult = { dom: string; isGroup: boolean };

export async function stringifyQuestionDom(
  options: QuestionsOptions
): Promise<StringifyResult> {
  //render choice content
  let analysisStr = '',
    questionStr = '',
    answerArray = '',
    checkedAnswer = '',
    questionTypeName = '',
    answerContainer = '',
    buttons = '';

  // 题目部分, 解析部分
  if (options.questionType === 5) {
    let sortStems = options.question.sort?.map((value) => value.content) || [];
    let stemTrans: string[] = await getRuby([
      options.analysis.content,
      ...sortStems,
    ]);
    analysisStr = getAnalysis(options.analysis.textStyle, stemTrans[0]);
    questionStr = getSortQuestion(stemTrans.slice(1), options.question);
  } else {
    let stemTrans: string[] = await getRuby([
      options.analysis.content,
      options.question.content,
    ]);
    questionStr = getCommonQuestion(
      options.question.textStyle,
      options.question.pic,
      stemTrans[1],
      options.question.audio
    );
    analysisStr = getAnalysis(options.analysis.textStyle, stemTrans[0]);
  }

  // 答题部分
  switch (options.questionType) {
    case 0: // 题目名 ，选择题答案 ，答题内容 , 按钮
      [questionTypeName, answerArray, answerContainer, buttons] =
        await getChoiceStr(options.answer);
      break;
    case 1: // 填空题题目 ，答案 ，答题内容 ，按钮
      questionTypeName = '填空题';
      [questionStr, answerArray, answerContainer, buttons] =
        await getFillBlankStr(
          options.answer,
          questionStr,
          options.question.textStyle
        );
      break;
    case 2: // 排序题答案 ，答题内容 ，按钮 , 选中答案
      questionTypeName = '排序题';
      [answerArray, answerContainer, buttons, checkedAnswer] =
        await getArrayStr(options.answer);
      break;
    case 3: // 连线题答题内容 ，按钮
      questionTypeName = '连线题';
      [answerContainer, buttons] = await getLinesStr(options.answer);
      break;
    case 4: // 图片题答题内容
      questionTypeName = '点击题';
      [answerContainer] = await getPicStr(options.answer);
      break;
    case 5: // 分类题答题内容 ，
      questionTypeName = '分类题';
      [answerContainer, buttons] = await getSortStr(options.answer);
      break;
    case 6: // 录音题按钮
      questionTypeName = '录音题';
      buttons = `<audio class="record-audio" controls controlsList="nodownload"></audio>
      <div class="click-to-record">RECORD</div><div class="download-audio">⬇<div>`;
      break;
    case 7: // 写作题按钮
      questionTypeName = '写作题';
      [answerContainer, buttons] = await getWritingStr(
        options.answer,
        options.question.textStyle
      );
      break;
  }

  // 设置部分
  const settings = options.settings;

  const content = `<div
      class="question-container"
      data-answer="${answerArray}"
      data-checked="${options.questionType === 2 ? checkedAnswer : ''}"
      data-type="${settings.type}"
      data-lockpage="${settings.pageLocked ? '1' : '0'}"
      data-analysis='${analysisStr}'
      ${settings.groupIndex ? `style="z-index: ${settings.groupIndex};"` : ''}
    >
      <div class="question-type">${questionTypeName}</div>
      ${
        options.questionType === 5
          ? answerContainer + questionStr
          : questionStr + answerContainer
      }
      ${buttons || ''}
      ${
        settings.rightAudio
          ? `<audio controlsList="nodownload" class="question-right-audio" 
          src="${settings.rightAudio}" preload="none" ></audio>`
          : ''
      }
      ${
        settings.wrongAudio
          ? `<audio controlsList="nodownload" 
          class="question-wrong-audio" src="${settings.wrongAudio}" 
          preload="none"></audio>`
          : ''
      }
    </div>`;

  return {
    dom: content,
    isGroup: options.questionType === 0 && !!options.settings.groupIndex,
  };
}
