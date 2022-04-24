import { message, Input, Button } from 'antd';
import React from 'react';
import { AnswerOptions, FillBlankAnswerOptions, TextStyle } from '../types';
import Api from '../../../../api/bookApi';
import { map, max } from 'lodash';

interface FillBlankAnswerProps {
  trans: any;
  answer: FillBlankAnswerOptions;
  setAnswer: (answer: AnswerOptions) => void;
}

const FillBlankAnswer = (props: FillBlankAnswerProps) => {
  const { trans, answer, setAnswer } = props;

  const addAnotherAnswer = (index: number) => {
    const newAnswer = [...answer];
    newAnswer[index].push({
      simp: '',
      trad: '',
    });
    setAnswer(newAnswer);
  };

  const setNewAnswer = (
    key: 'simp' | 'trad',
    value: string,
    blankIndex: number,
    index: number
  ) => {
    const newAnswer = [...answer];
    newAnswer[blankIndex][index][key] = value;
    setAnswer(newAnswer);
  };

  const getTrad = (blankIndex: number, index: number) => {
    let value = answer[blankIndex][index].simp;
    if (!value) {
      return;
    }

    Api.getPinyinContent({ text: [value] }).then((result) => {
      if (result.state !== false) {
        let { traditional } = result[0];

        let newAnswerList = [...answer];
        newAnswerList[blankIndex][index].trad = traditional.join('');
        setAnswer(newAnswerList);
      } else {
        message.error('Network error, please retry!', 3);
      }
    });
  };

  return (
    <div>
      {answer.map((blankAnswers, blankIndex) => (
        <div key={blankIndex} className="answer-fillblank-input">
          <div className="answer-fillblank-header">
            <strong>Blank {blankIndex + 1}. </strong>
            <Button
              type="primary"
              size="small"
              onClick={() => addAnotherAnswer(blankIndex)}
            >
              Extend
            </Button>
          </div>

          {blankAnswers.map((item, index) => (
            <div key={index} className="answer-fillblank-content">
              <div>
                <span>{trans.AddQuestionForm.answerSimp}</span>
                <Input
                  value={item.simp}
                  onChange={(e) =>
                    setNewAnswer('simp', e.target.value, blankIndex, index)
                  }
                  onBlur={() => getTrad(blankIndex, index)}
                />
              </div>

              <div>
                <span>{trans.AddQuestionForm.answerTradi}</span>
                <Input
                  value={item.trad}
                  onChange={(e) =>
                    setNewAnswer('trad', e.target.value, blankIndex, index)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FillBlankAnswer;

export function parseFillBlank(div: HTMLDivElement): FillBlankAnswerOptions {
  const result: FillBlankAnswerOptions = [];

  let answerList =
    div
      .querySelector('.question-container')
      ?.getAttribute('data-answer')
      .split('/') || [];

  answerList.forEach((value, index) => {
    const answers = value.split(',');
    const simpAnswers = answers[0].split('&');
    const tradAnswers = answers[1].split('&');
    const answersArray: typeof result[0] = [];
    simpAnswers.forEach((value, idx) => {
      answersArray.push({
        simp: value,
        trad: tradAnswers[idx],
      });
    });
    result.push(answersArray);
  });

  return result;
}

export const getFillBlankStr = async (
  fillBlankAnswerOptions: FillBlankAnswerOptions,
  stem: string,
  stemStyle: TextStyle
): Promise<string[]> => {
  let inputStr = (answerLength: number) => `<input class="question_blank_input" 
  style="width: ${answerLength * (stemStyle.fontSize + 3)}px; font-size: ${
    stemStyle.fontSize
  }px; font-weight: ${stemStyle.bold ? '700' : 'normal'}; color: ${
    stemStyle.color
  }; font-style: ${stemStyle.italic ? 'italic' : 'normal'};" />`;

  const stemDom = document.createElement('div');
  stemDom.innerHTML = stem;
  const simp = stemDom.getElementsByClassName('simp-p')[0];
  const trad = stemDom.getElementsByClassName('trad-p')[0];

  fillBlankAnswerOptions?.forEach((fillBlankAnswerOption) => {
    const length = max(
      fillBlankAnswerOption.map((answer) => answer.simp.length)
    );
    const input = inputStr(length);
    simp.innerHTML = simp.innerHTML.replace('____', input);
    trad.innerHTML = trad.innerHTML.replace('____', input);
  });

  stem = stemDom.innerHTML;

  let answersArrays = map(fillBlankAnswerOptions, (fillBlankAnswerOption) => {
    const simps: string[] = [];
    const trads: string[] = [];

    fillBlankAnswerOption.forEach((answer) => {
      simps.push(answer.simp);
      trads.push(answer.trad);
    });
    return simps.join('&') + ',' + trads.join('&');
  });

  let buttons = `<div class="question-submit">Submit</div>`;
  return [stem, answersArrays.join('/'), '', buttons];
};
