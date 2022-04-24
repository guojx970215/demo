import {
  Button,
  Checkbox,
  Divider,
  Icon,
  Input,
  InputNumber,
  Radio,
  Tooltip,
} from 'antd';
import React, { useEffect } from 'react';
import { FontBold, FontColor, FontItalic, FontSize } from '../Common/FontStyle';
import MusicCard from '../Common/MusicCard';
import PicCard, { getPicDomStr, getPicOptions } from '../Common/PicCard';
import { getRuby } from '../QuestionForm';
import { getSimp } from '../QuestionQuestion/QuestionQuestion';
import { ChoiceAnswerOptions, ChoiceSelection, AnswerOptions } from '../types';

interface ChoiceAnswerProps {
  answer: ChoiceAnswerOptions;
  trans: any;
  setAnswer: (answer: AnswerOptions) => void;
  isActive: boolean;
}

const ChoiceAnswer = (props: ChoiceAnswerProps) => {
  const { answer, trans, setAnswer, isActive } = props;
  const { type, rows, marginTop, textStyle, selections } = answer;

  const setNewAnswer = (key, value) => {
    const newAnswer = { ...answer };
    newAnswer[key] = value;
    setAnswer(newAnswer);
  };

  const setNewSelection = (key, value, id) => {
    const item = selections.find((selection) => selection.id === id);
    item[key] = value;
    setNewAnswer('selections', selections);
  };

  const typeChange = (e) => {
    const newAnswer = { ...answer };
    if (e.target.value === 1) {
      const newSelections = [...newAnswer.selections];
      let flag = false;
      newSelections.forEach((selection, idx) => {
        if (flag && selection.isRight === true) {
          selection.isRight = false;
        } else if (selection.isRight === true) {
          flag = true;
        }
      });
      newAnswer.selections = newSelections;
    }
    newAnswer.type = e.target.value;
    setAnswer(newAnswer);
  };

  const setSingleAnswer = (id) => {
    const newSelections = [...selections];
    newSelections.forEach((selection) => {
      if (id === selection.id) {
        selection.isRight = true;
      } else {
        selection.isRight = false;
      }
    });
    setNewAnswer('selections', newSelections);
  };

  const setMultipleAnswer = (e) => {
    const newSelections = [...selections];
    const item = newSelections.find(
      (selection) => selection.id === e.target.value
    );
    item.isRight = !item.isRight;
    setNewAnswer('selections', newSelections);
  };

  const addSelection = () => {
    const newSelections = [...selections];

    const id =
      newSelections.length === 0
        ? 0
        : newSelections[newSelections.length - 1].id + 1;

    newSelections.push({
      id,
      isRight: false,
      content: '',
      pinyin: '',
      tradi: '',
      pic: { url: '', width: 50, height: 50, default: false },
      audio: '',
      jumpToPage: '0',
    });
    setNewAnswer('selections', newSelections);
  };

  const deleteSelection = (id) => {
    let newSelections = [...selections];
    newSelections = newSelections.filter((selection) => id !== selection.id);
    setNewAnswer('selections', newSelections);
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

  // paste to options
  const handlePaste = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        setNewAnswer('selections', parseOptionsText(text || ''));
      })
      .catch((err) => {
        console.error('Failed to read clipboard contents: ', err);
      });
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 16 }}>
          <label style={{ color: '#000', marginRight: 4 }}>
            {trans.AddQuestionForm.choiceType} :
          </label>
          <Radio.Group onChange={typeChange} value={type}>
            <Radio value={1}>{trans.AddQuestionForm.singleAnswer}</Radio>
            <Radio value={2}>{trans.AddQuestionForm.multipleAnswer}</Radio>
          </Radio.Group>
        </span>

        <span style={{ marginRight: 16 }}>
          <label style={{ color: '#000', marginRight: 4 }}>
            {trans.AddQuestionForm.row} :
          </label>
          <Radio.Group
            onChange={(e) => setNewAnswer('rows', e.target.value)}
            value={rows}
          >
            <Radio value={1}>{trans.AddQuestionForm.oneCol}</Radio>
            <Radio value={0}>{trans.AddQuestionForm.oneRow}</Radio>
            <Radio value={2}>{trans.AddQuestionForm.twoRow}</Radio>
            <Radio value={3}>{trans.AddQuestionForm.threeRow}</Radio>
          </Radio.Group>
        </span>

        <span style={{ marginRight: 16 }}>
          <label style={{ color: '#000', marginRight: 4 }}>
            {trans.AddQuestionForm.marginTop} :
          </label>
          <InputNumber
            precision={0}
            value={marginTop}
            onChange={(value) => setNewAnswer('marginTop', value)}
            style={{ marginLeft: 4 }}
          ></InputNumber>
        </span>

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
      <div>
        {selections.map((selection, index) => (
          <div className="question-selection" key={selection.id}>
            {type === 1 ? (
              <Radio
                checked={selection.isRight}
                onChange={() => setSingleAnswer(selection.id)}
              ></Radio>
            ) : (
              <Checkbox
                onChange={setMultipleAnswer}
                key={index}
                checked={selection.isRight}
                value={index}
                style={{ marginRight: 8 }}
              ></Checkbox>
            )}
            <span>
              {selectWords[index]}.{selection.isRight}
            </span>
            <div className="question-selections-container">
              <span
                style={{
                  display: 'inline-block',
                  width: 140,
                  verticalAlign: 'top',
                }}
              >
                <Input
                  value={selection.content}
                  onChange={(e) =>
                    setNewSelection('content', e.target.value, selection.id)
                  }
                  style={{
                    width: '100%',
                    marginBottom: 11,
                  }}
                  placeholder={trans.AddQuestionForm.selectionPh}
                ></Input>
                {type === 1 && (
                  <Input
                    value={selection.jumpToPage}
                    onChange={(e) =>
                      setNewSelection(
                        'jumpToPage',
                        e.target.value,
                        selection.id
                      )
                    }
                    style={{ width: '100%' }}
                    placeholder={trans.AddQuestionForm.jump}
                    addonAfter={
                      <Tooltip title={trans.AddQuestionForm.choiceOption2}>
                        <span className="jump-page-tip">?</span>
                      </Tooltip>
                    }
                  ></Input>
                )}
              </span>
              <PicCard
                trans={trans}
                width={75}
                pic={selection.pic}
                setPic={(pic) => setNewSelection('pic', pic, selection.id)}
                style={{ verticalAlign: 'middle' }}
              ></PicCard>
              <MusicCard
                trans={trans}
                width={75}
                audio={selection.audio}
                setAudio={(audio) =>
                  setNewSelection('audio', audio, selection.id)
                }
                style={{ verticalAlign: 'middle' }}
              ></MusicCard>
              <Icon
                type="close"
                onClick={() => deleteSelection(selection.id)}
                className="delete-choice-btn"
              ></Icon>
            </div>
          </div>
        ))}

        <br />
        <Button
          type="primary"
          onClick={addSelection}
          style={{ marginRight: 16 }}
        >
          add new selection
        </Button>
        <Button onClick={handlePaste}>paste options</Button>
      </div>
    </>
  );
};

export default ChoiceAnswer;

export const selectWords: string[] = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

export function parseChoice(div: HTMLDivElement): ChoiceAnswerOptions {
  const answersDiv = div.querySelector<HTMLElement>('.choice-container');
  const oneline = div.querySelector('.one-row');
  const twoline = div.querySelector('.two-column');
  const threeline = div.querySelector('.three-column');
  const answers = div.querySelectorAll<HTMLElement>('.choice-list');
  const selections: ChoiceSelection[] = [];

  for (let i = 0; i < answers.length; i++) {
    // 获取音频
    const audioDiv = answers[i].getElementsByTagName('audio')[0];
    const [simp, tradi, pinyin] = getSimp(answers[i].innerHTML);

    selections.push({
      id: i,
      content: simp,
      tradi,
      pinyin,
      isRight: answers[i].getAttribute('data-right') === '1',
      pic: getPicOptions(answers[i]),
      audio: audioDiv?.getAttribute('src') || '',
      jumpToPage: answers[i].querySelector('span').getAttribute('data-jump'),
    });
  }

  const marginTop = Number(
    (answers[0] as HTMLElement).style.marginTop.replace('px', '')
  );
  return {
    textStyle: {
      color: answersDiv.style.color,
      fontSize: Number(answersDiv.style.fontSize.replace('px', '')),
      bold: answersDiv.style.fontWeight + '' === '700',
      italic: answersDiv.style.fontStyle === 'italic',
    },
    type: div.querySelector('.question-type').textContent === '单选题' ? 1 : 2,
    rows: oneline ? 0 : twoline ? 2 : threeline ? 3 : 1,
    selections,
    marginTop: !marginTop && marginTop !== 0 ? 12 : marginTop,
  };
}

export const getChoiceStr = async (
  answer: ChoiceAnswerOptions
): Promise<string[]> => {
  let answerArray = [],
    answerContainer = '',
    answerList = '',
    buttons = '';

  const textsRuby = await getRuby(
    answer.selections?.map((value) => value.content) || []
  );
  const style = answer.textStyle;
  const spanTop = (style.fontSize * 1.5 - 18) / 2;

  answer.selections.forEach((value, index) => {
    const option = `<span>${selectWords[index]}. ${textsRuby[index]}</span>`;
    if (value.isRight) {
      answerArray.push(selectWords[index]);
    }
    answerList =
      answerList +
      `<div class="choice-list" style="margin-top: ${
        answer.marginTop
      }px" data-right=${value.isRight ? '1' : '2'}>
  <span data-jump="${value.jumpToPage}" style="top: ${
        spanTop < 0 ? 0 : spanTop
      }px"></span>
  <p>${option}</p>
  ${
    value.audio
      ? `<div onclick="questionAudio(this)" class="music-pause">
           <audio controlsList="nodownload" src="${value.audio}"></audio>
        </div>`
      : ''
  }
  ${getPicDomStr(value.pic)}
</div>`;
  });

  let rowClass = '';
  if (!answer.rows) {
    rowClass = ' one-row';
  } else if (answer.rows === 2) {
    rowClass = ' two-column';
  } else if (answer.rows === 3) {
    rowClass = ' three-column';
  }

  answerContainer = `<div class="choice-container${rowClass}" 
style="font-size: ${style.fontSize}px; font-weight: ${
    style.bold ? '700' : 'normal'
  }; color: ${style.color}; font-style: ${style.italic ? 'italic' : 'normal'};">
${answerList}
</div>`;

  buttons =
    answer.type === 1 ? '' : `<div class="question-submit">Submit</div>`;

  return [
    answer.type === 1 ? '单选题' : '多选题',
    answerArray.join('/'),
    answerContainer,
    buttons,
  ];
};

const parseOptionsText = (text) => {
  const newSelections: ChoiceSelection[] = [];
  const parsedArr: string[] = text.split(/\n/);
  parsedArr.forEach((option, index) => {
    newSelections.push({
      id: index,
      isRight: false,
      content: option.trim().substr(2).trim(),
      pinyin: '',
      tradi: '',
      pic: { url: '', width: 50, height: 50, default: false },
      audio: '',
      jumpToPage: '0',
    });
  });

  if (newSelections[0]) newSelections[0].isRight = true;

  return newSelections;
};
