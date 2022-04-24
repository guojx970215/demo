import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  LintHeight,
  FontSize,
  FontColor,
  FontItalic,
  FontBold,
} from '../Common/FontStyle';
import { getSimp } from '../QuestionQuestion/QuestionQuestion';
import { AnalysisOptions } from '../types';

export type GetAnalysisData = () => AnalysisOptions;

export function parseAnalysis(div: HTMLElement): AnalysisOptions {
  let analysis = document.createElement('div');
  analysis.innerHTML = div
    .querySelector('.question-container')
    .getAttribute('data-analysis');
  analysis = analysis.querySelector('div');
  const [simp, tradi, pinyin] = getSimp(analysis.innerHTML);

  let result = {
    content: simp,
    tradi: tradi,
    pinyin: pinyin,
    textStyle: {
      lineHeight: analysis.style.lineHeight,
      color: analysis.style.color,
      fontSize: Number(analysis.style.fontSize.replace('px', '')),
      bold: analysis.style.fontWeight + '' === '700',
      italic: analysis.style.fontStyle === 'italic',
    },
  };

  analysis = null;

  return result;
}

interface QuestionAnalysisProps {
  trans: any;
  analysis: AnalysisOptions;
  setAnalysis: (analysis: AnalysisOptions) => void;
}

const QuestionAnalysis = (props: QuestionAnalysisProps) => {
  const { trans, analysis, setAnalysis } = props;
  const { textStyle, content } = analysis;

  const setNewAnalysis = (key, value) => {
    const newAnalysis = { ...analysis };
    newAnalysis[key] = value;
    setAnalysis(newAnalysis);
  };

  // font style
  const setLineHeight = (value) => {
    const newTextStyle = { ...textStyle, lineHeight: value };
    setNewAnalysis('textStyle', newTextStyle);
  };
  const setFontSize = (value) => {
    const newTextStyle = { ...textStyle, fontSize: value };
    setNewAnalysis('textStyle', newTextStyle);
  };
  const setTextColor = (value) => {
    const newTextStyle = { ...textStyle, color: value };
    setNewAnalysis('textStyle', newTextStyle);
  };
  const setItalic = (value) => {
    const newTextStyle = { ...textStyle, italic: value };
    setNewAnalysis('textStyle', newTextStyle);
  };
  const setFontBold = (value) => {
    const newTextStyle = { ...textStyle, bold: value };
    setNewAnalysis('textStyle', newTextStyle);
  };

  const { lineHeight, fontSize, color, italic, bold } = textStyle;
  return (
    <div>
      <LintHeight
        trans={trans}
        value={textStyle.lineHeight}
        onChange={setLineHeight}
      ></LintHeight>
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

      <Input.TextArea
        rows={3}
        onChange={(e) => setNewAnalysis('content', e.target.value)}
        value={content}
        style={{
          fontSize: `${analysis.textStyle.fontSize}px`,
          color: analysis.textStyle.color,
          fontStyle: analysis.textStyle.italic ? 'italic' : 'normal',
          fontWeight: analysis.textStyle.bold ? 700 : 'normal',
          lineHeight: analysis.textStyle.lineHeight,
          marginTop: 16,
        }}
        placeholder={trans.AddQuestionForm.questionPH}
      ></Input.TextArea>
    </div>
  );
};

export default QuestionAnalysis;
