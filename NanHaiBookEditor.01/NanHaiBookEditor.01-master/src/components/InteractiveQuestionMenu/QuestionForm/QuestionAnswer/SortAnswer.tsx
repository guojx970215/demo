import React, { useEffect, useState } from 'react';
import { Radio, Button, Icon, Select, Input } from 'antd';
import { getRuby } from '../QuestionForm';
import { getSimp } from '../QuestionQuestion/QuestionQuestion';
import { SortAnswerOptions, AnswerOptions, SortItem } from '../types';
import PicCard, { getPicOptions, getPicDomStr } from '../Common/PicCard';

interface SortAnswerProps {
  trans: any;
  answer: SortAnswerOptions;
  sortQuestion: { value: number; label: string }[];
  setAnswer: (answer: AnswerOptions) => void;
}

const SortAnswer = (props: SortAnswerProps) => {
  const { trans, answer, sortQuestion, setAnswer } = props;
  const { type } = answer;
  const sortList = answer.answer;

  const setNewAnswer = (key, value) => {
    const newAnswer = { ...answer };
    newAnswer[key] = value;
    setAnswer(newAnswer);
  };

  const addSort = () => {
    const newSortList = [...sortList];
    const id =
      newSortList.length === 0 ? 0 : newSortList[newSortList.length - 1].id + 1;
    newSortList.push({
      id,
      pic: { url: '', width: 50, height: 50, default: false },
      content: '',
      pinyin: '',
      tradi: '',
      answer: undefined,
      audio: '',
    });

    setNewAnswer('answer', newSortList);
  };

  const deleteSort = (id) => {
    const newSortList = sortList.filter((sort) => sort.id !== id);
    setNewAnswer('answer', newSortList);
  };

  const setSort = (value, key, id) => {
    const newSortList = [...sortList];
    const sort = newSortList.find((item) => item.id === id);
    sort[key] = value;
    setNewAnswer('answer', newSortList);
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Radio.Group
          value={type}
          onChange={(e) => setNewAnswer('type', e.target.value)}
          style={{ marginRight: 16 }}
        >
          <Radio value={0}>{trans.AddQuestionForm.variable10}</Radio>
          <Radio value={1}>{trans.AddQuestionForm.variable9}</Radio>
        </Radio.Group>

        <Button type="primary" onClick={addSort}>
          <Icon type="plus" />
          {trans.AddQuestionForm.variable12}
        </Button>
      </div>

      {sortList.map((sort) => (
        <div className="answer-sort-container" key={sort.id}>
          <Select
            value={sort.answer}
            onChange={(value) => setSort(value, 'answer', sort.id)}
            style={{ width: 110, marginBottom: 8 }}
            placeholder={trans.AddQuestionForm.sortName}
          >
            {sortQuestion.map((item, index) => (
              <Select.Option value={item.value} key={item.value}>
                {index + 1}. {item.label}
              </Select.Option>
            ))}
          </Select>

          {type === 0 ? (
            <Input
              style={{ width: 110 }}
              value={sort.content}
              onChange={(e) => setSort(e.target.value, 'content', sort.id)}
              placeholder={trans.AddQuestionForm.text}
            ></Input>
          ) : (
            <PicCard
              trans={trans}
              pic={sort.pic}
              setPic={(pic) => setSort(pic, 'pic', sort.id)}
              width={110}
              style={{ marginLeft: 0 }}
              hideDefault={true}
            ></PicCard>
          )}

          <span
            className="answer-sort-delete"
            onClick={() => deleteSort(sort.id)}
          >
            <Icon type="close"></Icon>
          </span>
        </div>
      ))}
    </>
  );
};

export default SortAnswer;

export function parseSort(div: HTMLDivElement): SortAnswerOptions {
  let sortWordsDiv = div.getElementsByClassName('sort-word');
  let sortImagesDiv = div.getElementsByClassName('sort-image');

  // 文字分类题
  if (sortWordsDiv.length > 0) {
    let result: SortAnswerOptions = {
      type: 0,
      answer: [],
    };

    for (let i = 0; i < sortWordsDiv.length; i++) {
      // 获取音频
      const audioDiv = sortWordsDiv[i].getElementsByTagName('audio')[0];
      const [simp, tradi, pinyin] = getSimp(sortWordsDiv[i].innerHTML);

      result.answer.push({
        id: i,
        content: simp,
        tradi,
        pinyin,
        answer: ~~sortWordsDiv[i].getAttribute('data-index'),
        audio: audioDiv?.getAttribute('src') || '',
        pic: { url: '', width: 50, height: 50, default: false },
      });
    }

    return result;
  } else if (sortImagesDiv.length > 0) {
    let result: SortAnswerOptions = {
      type: 1,
      answer: [],
    };

    for (let i = 0; i < sortImagesDiv.length; i++) {
      result.answer.push({
        id: i,
        content: '',
        pinyin: '',
        tradi: '',
        audio: '',
        pic: getPicOptions(sortImagesDiv[i]),
        answer: ~~sortImagesDiv[i].getAttribute('data-index'),
      });
    }

    return result;
  }
}

export const getSortStr = async (
  answer: SortAnswerOptions
): Promise<string[]> => {
  const buttons = `<div class="question-submit">Submit</div>`;

  let answerItems = '';

  if (answer.type === 1) {
    answer.answer.forEach((value) => {
      answerItems += `<div class="sort-image" data-index="${value.answer}">
      ${getPicDomStr(value.pic)}
      </div>`;
    });
  } else if (answer.type === 0) {
    let sortWords = await getRuby(
      answer.answer?.map((value) => value.content) || []
    );

    answer.answer.forEach((value, index) => {
      answerItems += `<div class="${
        answer.type === 0 ? 'sort-word' : 'sort-line'
      }" 
      data-index="${value.answer}">

      ${
        value.audio
          ? `<div onclick="questionAudio(this)" class="music-pause">
               <audio controlsList="nodownload" src="${value.audio}"></audio>
             </div>`
          : ''
      }

      <span>${sortWords[index]}</span>
    </div>`;
    });
  }

  let answerContainer =
    "<div class='sort-items-container new-sort-container'>" +
    answerItems +
    '</div>';

  return [answerContainer, buttons];
};
