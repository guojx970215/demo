import React, { useEffect, useState } from 'react';
import { FontBold, FontColor, FontItalic, FontSize } from '../Common/FontStyle';
import MusicCard from '../Common/MusicCard';
import PicCard, { getPicDomStr, getPicOptions } from '../Common/PicCard';
import {
  AnswerOptions,
  LineOptions,
  LinesAnswerOptions,
  TextStyle,
} from '../types';
import { getRuby } from '../QuestionForm';
import { getSimp } from '../QuestionQuestion/QuestionQuestion';
import { Button, Divider, Icon, Input, InputNumber } from 'antd';

interface LinesAnswerProps {
  trans: any;
  answer: LinesAnswerOptions;
  setAnswer: (answer: AnswerOptions) => void;
}

const LinesAnswer = (props: LinesAnswerProps) => {
  const { answer, trans, setAnswer } = props;
  const { textStyle, lines } = answer;

  const setNewAnswer = (key, value) => {
    const newAnswer = { ...answer };
    newAnswer[key] = value;
    setAnswer(newAnswer);
  };

  const addLine = () => {
    const newLineList = [...lines];
    const id =
      newLineList.length === 0 ? 0 : newLineList[newLineList.length - 1].id + 1;
    newLineList.push({
      id,
      left: {
        content: '',
        pinyin: '',
        tradi: '',
        pic: { url: '', width: 50, height: 50, default: false },
        audio: '',
      },
      right: {
        index: newLineList.length - 1,
        content: '',
        pinyin: '',
        tradi: '',
        pic: { url: '', width: 50, height: 50, default: false },
        audio: '',
      },
    });
    setNewAnswer('lines', newLineList);
  };

  const deleteLine = (id) => {
    const newLineList = lines.filter((line) => line.id !== id);
    setNewAnswer('lines', newLineList);
  };

  const setLeftLine = (value, key, id) => {
    const newLineList = [...lines];
    const line = newLineList.find((item) => item.id === id);
    line.left[key] = value;
    setNewAnswer('lines', newLineList);
  };

  const setRightLine = (value, key, id) => {
    const newLineList = [...lines];
    const line = newLineList.find((item) => item.id === id);
    line.right[key] = value;
    setNewAnswer('lines', newLineList);
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
      <div>
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
      {lines.map((line, index) => (
        <div key={line.id} className="answer-lines-container">
          <span className="answer-line-index">{index + 1}. </span>
          <div className="answer-lines-left">
            <label>left: </label>
            <Input
              value={line.left.content}
              onChange={(e) => setLeftLine(e.target.value, 'content', line.id)}
              placeholder={trans.AddQuestionForm.inputLeft}
              style={{ width: 120, verticalAlign: 'top' }}
            ></Input>
            <PicCard
              width={75}
              pic={line.left.pic}
              setPic={(pic) => setLeftLine(pic, 'pic', line.id)}
              trans={trans}
            ></PicCard>
            <MusicCard
              trans={trans}
              width={75}
              audio={line.left.audio}
              setAudio={(audio) => setLeftLine(audio, 'audio', line.id)}
            ></MusicCard>
          </div>
          <div className="answer-lines-right">
            <label>right: </label>
            <span>
              <Input
                value={line.right.content}
                onChange={(e) =>
                  setRightLine(e.target.value, 'content', line.id)
                }
                placeholder={trans.AddQuestionForm.inputRight}
              ></Input>
              <InputNumber
                value={line.right.index}
                onChange={(e) => setRightLine(e, 'index', line.id)}
                style={{ width: 80, marginTop: 11 }}
              ></InputNumber>
            </span>
            <PicCard
              width={75}
              pic={line.right.pic}
              setPic={(pic) => setRightLine(pic, 'pic', line.id)}
              trans={trans}
            ></PicCard>
            <MusicCard
              trans={trans}
              width={75}
              audio={line.right.audio}
              setAudio={(audio) => setRightLine(audio, 'audio', line.id)}
            ></MusicCard>
          </div>
          <span
            className="answer-line-close"
            onClick={() => deleteLine(line.id)}
          >
            <Icon type="close"></Icon>
          </span>
        </div>
      ))}
      <Button style={{ marginTop: 16 }} onClick={addLine} type="primary">
        <Icon type="plus" />
        {trans.AddQuestionForm.addOption}
      </Button>
    </>
  );
};

export default LinesAnswer;

export const getLinesStr = async (
  answer: LinesAnswerOptions
): Promise<string[]> => {
  let answerContainer = '';
  let buttons = `<div class="question-submit">Submit</div>`;

  let leftUl: string[] = [],
    rightUl: string[] = [];

  let leftRuby = answer.lines?.map((value) => value.left.content) || [];
  let rightRuby = answer.lines?.map((value) => value.right.content) || [];
  const ruby = await getRuby([...leftRuby, ...rightRuby]);
  leftRuby = ruby.slice(0, leftRuby.length);
  rightRuby = ruby.slice(rightRuby.length);

  answer.lines.forEach((value, index) => {
    const optionLeft = `<span>${leftRuby[index]}</span>`;

    const optionRight = `<span>${rightRuby[index]}</span>`;

    leftUl.push(`<li data-sort="${index + 1}" 
    onclick="linesLeftClick(this)">
        ${getPicDomStr(value.left.pic)}
        ${optionLeft}
        ${
          value.left.audio
            ? `<div onclick="questionAudio(this)" class="music-pause">
               <audio controlsList="nodownload" src="${value.left.audio}"></audio>
            </div>`
            : ''
        }
        <i></i>
      </li>
      `);

    rightUl.push(`<li data-sort="${value.right.index}" 
      onclick="linesRightClick(this)">
        ${getPicDomStr(value.right.pic)}
        ${optionRight}
        ${
          value.right.audio
            ? `<div onclick="questionAudio(this)" class="music-pause">
               <audio controlsList="nodownload" src="${value.right.audio}"></audio>
            </div>`
            : ''
        }
        <i></i>
      </li>`);
  });
  const style = answer.textStyle;

  answerContainer = `<div class="choice-container lines-container" style="font-size: ${
    style.fontSize
  }px; font-weight: ${style.bold ? '700' : 'normal'}; color: ${
    style.color
  }; font-style: ${style.italic ? 'italic' : 'normal'};">
  <ul class="lines-left">${leftUl.join('')}</ul>
  <ul class="lines-right">${rightUl.join('')}</ul>
  <canvas class="question-canvas"></canvas>
  </div>
  `;
  return [answerContainer, buttons];
};

export function parseLines(div: HTMLDivElement): LinesAnswerOptions {
  const answersDiv = div.querySelector('.choice-container') as HTMLElement;
  let result: LinesAnswerOptions = {
    textStyle: {
      color: answersDiv.style.color,
      fontSize: Number(answersDiv.style.fontSize.replace('px', '')),
      bold: answersDiv.style.fontWeight + '' === '700',
      italic: answersDiv.style.fontStyle === 'italic',
    },
    lines: [],
  };
  const leftLis = answersDiv
    .getElementsByTagName('ul')[0]
    .getElementsByTagName('li');

  const rightLis = answersDiv
    .getElementsByTagName('ul')[1]
    .getElementsByTagName('li');

  for (let i = 0; i < leftLis.length; i++) {
    const audioDivLeft = leftLis[i].getElementsByTagName('audio')[0];
    const audioDivRight = rightLis[i].getElementsByTagName('audio')[0];

    const [lSimp, lTradi, lPinyin] = getSimp(leftLis[i].innerHTML);
    const [rSimp, rTradi, rPinyin] = getSimp(rightLis[i].innerHTML);

    result.lines.push({
      id: i,
      left: {
        content: lSimp.replace(/[1-9]. /g, ''),
        tradi: lTradi,
        pinyin: lPinyin,
        pic: getPicOptions(leftLis[i]),
        audio: audioDivLeft?.getAttribute('src') || '',
      },
      right: {
        index: ~~rightLis[i].getAttribute('data-sort'),
        content: rSimp.replace(/[1-9]. /g, ''),
        tradi: rTradi,
        pinyin: rPinyin,
        pic: getPicOptions(rightLis[i]),
        audio: audioDivRight?.getAttribute('src') || '',
      },
    });
  }

  return result;
}
