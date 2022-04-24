import { Button, Divider, Icon, Input, InputNumber, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { FontBold, FontColor, FontItalic, FontSize } from '../Common/FontStyle';
import MusicCard from '../Common/MusicCard';
import PicCard, { getPicDomStr, getPicOptions } from '../Common/PicCard';
import { getRuby } from '../QuestionForm';
import { getSimp } from '../QuestionQuestion/QuestionQuestion';
import { AnswerOptions, ArrayAnswerOptions } from '../types';

interface ArrayAnswerProps {
  trans: any;
  answer: ArrayAnswerOptions;
  setAnswer: (answer: AnswerOptions) => void;
}
const ArrayAnswer = (props: ArrayAnswerProps) => {
  const { answer, trans, setAnswer } = props;
  const { array, textStyle, type } = answer;

  const setNewAnswer = (key, value) => {
    const newAnswer = { ...answer };
    newAnswer[key] = value;
    setAnswer(newAnswer);
  };

  const setArray = (value, type, id) => {
    let newAnswerList = [...answer.array];
    const item = newAnswerList.find((item) => item.id === id);
    item[type] = value;
    setNewAnswer('array', newAnswerList);
  };

  const addArray = () => {
    const newAnswerList = [...array];
    const id =
      newAnswerList.length === 0
        ? 0
        : newAnswerList[newAnswerList.length - 1].id + 1;
    newAnswerList.push({
      id,
      content: '',
      pinyin: '',
      tradi: '',
      pic: { url: '', width: 50, height: 50, default: false },
      answer: 1,
      audio: '',
    });

    setNewAnswer('array', newAnswerList);
  };

  const deleteArray = (id) => {
    const newAnswerList = [...array].filter((item) => item.id !== id);
    setNewAnswer('array', newAnswerList);
  };

  // font style
  const setFontSize = (value) => {
    const newTextStyle = { ...textStyle, fontSize: value };
    setNewAnswer('textStyle', newTextStyle);
  };
  const setTextColor = (value) => {
    const newTextStyle = { ...textStyle, color: value };
    setNewAnswer('textStyle', newTextStyle);
  };
  const setItalic = (value) => {
    const newTextStyle = { ...textStyle, italic: value };
    setNewAnswer('textStyle', newTextStyle);
  };
  const setFontBold = (value) => {
    const newTextStyle = { ...textStyle, bold: value };
    setNewAnswer('textStyle', newTextStyle);
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Radio.Group
          onChange={(e) => setNewAnswer('type', e.target.value)}
          value={type}
          style={{ marginRight: 16 }}
        >
          <Radio value="horizontal">{trans.AddQuestionForm.variable19}</Radio>
          <Radio value="vertical">{trans.AddQuestionForm.variable18}</Radio>
        </Radio.Group>
        <FontSize
          trans={trans}
          value={textStyle.fontSize}
          onChange={setFontSize}
        ></FontSize>
        <FontColor
          trans={trans}
          value={textStyle.color}
          onChange={setTextColor}
        ></FontColor>
        <FontItalic
          trans={trans}
          value={textStyle.italic}
          onChange={setItalic}
        ></FontItalic>
        <FontBold
          trans={trans}
          value={textStyle.bold}
          onChange={setFontBold}
        ></FontBold>
      </div>
      <Divider orientation="left">{trans.AddQuestionForm.selection}</Divider>
      {array.map((item) => {
        return (
          <div key={item.id} className="answer-array-input">
            <span>
              <Input
                style={{ width: '100%', marginBottom: 11 }}
                onChange={(e) => setArray(e.target.value, 'content', item.id)}
                value={item.content}
                placeholder={trans.AddQuestionForm.optionPH}
              />
              <label>{trans.AddQuestionForm.variable4}: </label>
              <InputNumber
                style={{ width: '50px' }}
                min={1}
                max={array.length}
                defaultValue={0}
                onChange={(e) => setArray(e, 'answer', item.id)}
                value={item.answer}
              />
            </span>
            <PicCard
              width={75}
              pic={item.pic}
              setPic={(pic) => setArray(pic, 'pic', item.id)}
              trans={trans}
            ></PicCard>
            <MusicCard
              trans={trans}
              width={75}
              audio={item.audio}
              setAudio={(audio) => setArray(audio, 'audio', item.id)}
            ></MusicCard>
            <span
              className="array-input-delete"
              onClick={() => deleteArray(item.id)}
            >
              <Icon type="close" />
            </span>
          </div>
        );
      })}
      <div>
        <Button type="primary" onClick={addArray} style={{ marginTop: 16 }}>
          <Icon type="plus" />
          {trans.AddQuestionForm.addOption}
        </Button>
      </div>
    </>
  );
};

export default ArrayAnswer;

export function parseArray(div: HTMLDivElement): ArrayAnswerOptions {
  const answersDiv = div.querySelector('.choice-container') as HTMLElement;
  const horizontal = div.querySelector('.horizontal-order');

  let result: ArrayAnswerOptions = {
    textStyle: {
      color: answersDiv.style.color,
      fontSize: Number(answersDiv.style.fontSize.replace('px', '')),
      bold: answersDiv.style.fontWeight + '' === '700',
      italic: answersDiv.style.fontStyle === 'italic',
    },
    type: horizontal ? 'horizontal' : 'vertical',
    array: [],
  };

  const answerList = div
    .querySelector('.question-container')
    .getAttribute('data-checked')
    .split('/');
  const answers = div.getElementsByClassName('array-list');

  for (let i = 0; i < answers.length; i++) {
    // 获取音频
    const audioDiv = answers[i].getElementsByTagName('audio')[0];

    let [simp, tradi, pinyin] = getSimp(answers[i].innerHTML);

    result.array.push({
      id: i,
      answer: ~~answerList[i],
      content: simp.replace(/[1-9]. /g, ''),
      tradi,
      pinyin,
      pic: getPicOptions(answers[i]),
      audio: audioDiv?.getAttribute('src') || '',
    });
  }

  return result;
}

export const getArrayStr = async (
  answer: ArrayAnswerOptions
): Promise<string[]> => {
  let answerArray = [],
    checkedAnswer = [],
    answerContainer = '',
    buttons = '',
    answerList = '';

  let textsRuby = await getRuby(
    answer.array?.map((value) => value.content) || []
  );

  answer.array.forEach((value, index) => {
    answerArray.push(index + 1);
    checkedAnswer.push(value.answer);
    const option = `<span>${textsRuby[index]}</span>`;

    answerList =
      answerList +
      `<div class="array-list">${getPicDomStr(value.pic)}${option}${
        value.audio
          ? `<div onclick="questionAudio(this)" class="music-pause">
               <audio controlsList="nodownload" src="${value.audio}"></audio>
            </div>`
          : ''
      }
    </div>`;
  });

  answerContainer = `<div class="choice-container question-array${
    answer.type === 'horizontal' ? ' horizontal-order' : ''
  }" 
    style="font-size: ${answer.textStyle.fontSize}px; font-weight: ${
    answer.textStyle.bold ? '700' : 'normal'
  }; color: ${answer.textStyle.color}; font-style: ${
    answer.textStyle.italic ? 'italic' : 'normal'
  };">
    ${answerList}
    </div>`;

  // ！！！！！ script 放到预览中去执行  ！！！！
  buttons = `<div class="question-submit">Submit</div>`;

  return [
    answerArray.join('/'),
    answerContainer,
    buttons,
    checkedAnswer.join('/'),
  ];
};
