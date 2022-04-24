import React, { useState, useEffect } from 'react';
import {
  ChoiceAnswerOptions,
  ArrayAnswerOptions,
  LinesAnswerOptions,
  FillBlankAnswerOptions,
  SortAnswerOptions,
  PicAnswerOptions,
  WritingAnswerOptions,
  QuestionTypes,
  SortQuestion,
} from '../types';
import './QuestionAnswer.css';
import ChoiceAnswer, { parseChoice } from './ChoiceAnswer';
import FillBlankAnswer, { parseFillBlank } from './FillBlankAnswer';
import ArrayAnswer, { parseArray } from './ArrayAnswer';
import LinesAnswer, { parseLines } from './LinesAnswer';
import PicAnswer, { parsePic } from './PicAnswer';
import WritingAnswer, { parseWriting } from './WritingAnswer';
import SortAnswer, { parseSort } from './SortAnswer';

type AnswerOptions =
  | ChoiceAnswerOptions
  | ArrayAnswerOptions
  | LinesAnswerOptions
  | FillBlankAnswerOptions
  | SortAnswerOptions
  | PicAnswerOptions 
  | WritingAnswerOptions;

export function parseAnswers(
  questionType: QuestionTypes,
  div: HTMLDivElement
): AnswerOptions {
  let result: AnswerOptions;

  switch (questionType) {
    case 0:
      result = parseChoice(div);
      break;
    case 1:
      result = parseFillBlank(div);
      break;
    case 2:
      result = parseArray(div);
      break;
    case 3:
      result = parseLines(div);
      break;
    case 4:
      result = parsePic(div);
      break;
    case 5:
      result = parseSort(div);
      break;
    case 7:
      result = parseWriting(div);
      break;
  }

  return result;
}
interface AnswerConatinerProps {
  questionType: QuestionTypes;
  answer?: AnswerOptions;
  setAnswer: (answer: AnswerOptions) => void;
  trans: any;
  sort?: SortQuestion[];
  isActive: boolean;
}

const AnswerConatiner = (props: AnswerConatinerProps) => {
  const { questionType, answer, trans, sort, setAnswer, isActive } = props;

  const [sortQuestion, setSortQuestion] = useState<
    { value: number; label: string }[]
  >([]);

  useEffect(() => {
    if (!sort) return;
    setSortQuestion(
      sort.map((sort) => ({
        value: sort.id,
        label: sort.content,
      }))
    );
  }, [sort]);

  return questionType === 0 ? (
    <ChoiceAnswer
      answer={answer as ChoiceAnswerOptions}
      setAnswer={setAnswer}
      trans={trans}
      isActive={isActive}
    ></ChoiceAnswer>
  ) : questionType === 1 ? (
    <FillBlankAnswer
      answer={answer as FillBlankAnswerOptions}
      trans={trans}
      setAnswer={setAnswer}
    ></FillBlankAnswer>
  ) : questionType === 2 ? (
    <ArrayAnswer
      trans={trans}
      answer={answer as ArrayAnswerOptions}
      setAnswer={setAnswer}
    ></ArrayAnswer>
  ) : questionType === 3 ? (
    <LinesAnswer
      trans={trans}
      answer={answer as LinesAnswerOptions}
      setAnswer={setAnswer}
    ></LinesAnswer>
  ) : questionType === 4 ? (
    <PicAnswer
      trans={trans}
      answer={answer as PicAnswerOptions}
      setAnswer={setAnswer}
    ></PicAnswer>
  ) : questionType === 7 ? (
    <WritingAnswer
      trans={trans}
      answer={answer as WritingAnswerOptions}
      setAnswer={setAnswer}
    ></WritingAnswer>
  ) : (
    <SortAnswer
      trans={trans}
      answer={answer as SortAnswerOptions}
      sortQuestion={sortQuestion}
      setAnswer={setAnswer}
    ></SortAnswer>
  );
};

export default AnswerConatiner;
