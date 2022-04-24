import { InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';
import { AnswerOptions, WritingAnswerOptions, TextStyle } from '../types';
import { FontBold, FontColor, FontItalic, FontSize } from '../Common/FontStyle';
import Api from '../../../../api/bookApi';

interface WritingAnswerProps {
  trans: any;
  answer: WritingAnswerOptions;
  setAnswer: (answer: AnswerOptions) => void;
}

const WritingAnswer = (props: WritingAnswerProps) => {
  const { answer, trans, setAnswer } = props;
  const { maxLength = 5000, height = 300, textStyle } = answer;

  const setNewAnswer = (key, value) => {
    const newAnswer = { ...answer };
    newAnswer[key] = value;
    setAnswer(newAnswer);
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
    <div>
      <div style={{marginBottom: 16}}>
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
      <div style={{marginBottom: 16}}>
        <span style={{marginRight: 12, width: 72, display: 'inline-block'}}>maxLength</span>
        <InputNumber 
          style={{width: 120}}
          value={maxLength} 
          min={1} 
          max={10000}
          onChange={(value) => {
            setNewAnswer('maxLength', value)
          }} 
        />
      </div>
      <div>
        <span style={{marginRight: 12, width: 72, display: 'inline-block'}}>height</span>
        <InputNumber 
          style={{width: 120}}
          value={height}
          min={300}
          onChange={(value) => {
            setNewAnswer('height', value)
          }} 
        />
      </div>
    </div>
  );
};

export default WritingAnswer;

export function parseWriting(div: HTMLDivElement): WritingAnswerOptions {
  
  const answersDiv = div.querySelector('.choice-container textarea') as HTMLElement;
  const result: WritingAnswerOptions = {
    textStyle: {
      color: answersDiv.style.color,
      fontSize: Number(answersDiv.style.fontSize.replace('px', '')),
      bold: answersDiv.style.fontWeight + '' === '700',
      italic: answersDiv.style.fontStyle === 'italic',
    },
    maxLength: Number(answersDiv.getAttribute('data-max')),
    height: Number(answersDiv.getAttribute('data-height')),
  };

  return result;
}

export const getWritingStr = async (
  answer: WritingAnswerOptions,
  stemStyle: TextStyle
): Promise<string[]> => {
  let answerContainer = '',
    buttons = '';

  const style = answer.textStyle;

  let inputStr = `<textarea data-max="${answer.maxLength}" data-height="${answer.height || 300}"
  style="width: 100%; height: ${answer.height || 300}px; 
  border: 0; border-radius: 5px; background-color: rgba(241,241,241,.98);
  width: 100%; padding: 12px; resize: none; 
  font-size: ${style.fontSize}px; font-weight: ${
    style.bold ? '700' : 'normal'
  }; color: ${style.color}; font-style: ${
    style.italic ? 'italic' : 'normal'
  }; line-height: ${style.lineHeight};"></textarea>`;

  answerContainer = `<div class="choice-container question-writing">
    ${inputStr}
  </div>`;

  buttons = `<div style="margin-top: 12px; padding-left: 12px;">
    <span style="font-size: ${stemStyle.fontSize}px; font-weight: ${
      stemStyle.bold ? '700' : 'normal'
    }; color: ${stemStyle.color}; font-style: ${
      stemStyle.italic ? 'italic' : 'normal'
    }; line-height: ${stemStyle.lineHeight};">0 / ${answer.maxLength}</span>
    <div class="question-submit submit-writing">Submit</div>
  </div>`;
  return [answerContainer, buttons];
};