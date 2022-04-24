import React, { useEffect, useState } from 'react';
import { Button, Divider, Icon, Input, InputNumber } from 'antd';
import {
  LintHeight,
  FontSize,
  FontColor,
  FontItalic,
  FontBold,
} from '../Common/FontStyle';
import PicCard, { getPicOptions } from '../Common/PicCard';
import MusicCard from '../Common/MusicCard';
import {
  QuestionTypes,
  CommonQuestionOptions,
  SortQuestionOptions,
  SortQuestion,
  Size,
  PicOptions
} from '../types';
import './QuestionQuestion.css';
interface QuestionQuestionProps {
  trans: any;
  questionType: QuestionTypes;
  question: CommonQuestionOptions | SortQuestionOptions;
  setQuestion: (question: CommonQuestionOptions | SortQuestionOptions) => void;
}

const QuestionQuestion = (props: QuestionQuestionProps) => {
  const {
    trans,
    questionType, // 题目类型
    question,
    setQuestion,
  } = props;

  const { textStyle, pic, audio, content } = question as CommonQuestionOptions;
  const { sort = [], sortSize } = question as SortQuestionOptions;

  const setNewQuestion = (key, value) => {
    const newQuestion = { ...question };
    newQuestion[key] = value;
    setQuestion(newQuestion);
  };

  const inserBlank = () => {
    setNewQuestion('content', content + '____');
  };

  // font style
  const setLineHeight = (value) => {
    const newTextStyle = { ...textStyle, lineHeight: value };
    setNewQuestion('textStyle', newTextStyle);
  };
  const setFontSize = (value) => {
    const newTextStyle = { ...textStyle, fontSize: value };
    setNewQuestion('textStyle', newTextStyle);
  };
  const setTextColor = (value) => {
    const newTextStyle = { ...textStyle, color: value };
    setNewQuestion('textStyle', newTextStyle);
  };
  const setItalic = (value) => {
    const newTextStyle = { ...textStyle, italic: value };
    setNewQuestion('textStyle', newTextStyle);
  };
  const setFontBold = (value) => {
    const newTextStyle = { ...textStyle, bold: value };
    setNewQuestion('textStyle', newTextStyle);
  };

  return (
    <div className="question-question" style={{ overflow: 'visible' }}>
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

      {questionType === 1 && (
        <Button type="primary" onClick={inserBlank}>
          {trans.AddQuestionForm.insertBlank}
        </Button>
      )}
      {questionType !== 5 ? (
        <div style={{ marginTop: 16 }}>
          <Input.TextArea
            rows={3}
            onChange={(e) => setNewQuestion('content', e.target.value)}
            value={content}
            style={{
              fontSize: `${textStyle.fontSize}px`,
              color: textStyle.color,
              fontStyle: textStyle.italic ? 'italic' : 'normal',
              fontWeight: textStyle.bold ? 700 : 'normal',
              lineHeight: textStyle.lineHeight,
              width: 'calc(100% - 200px)',
              display: 'inline-block',
              verticalAlign: 'top',
            }}
            placeholder={trans.AddQuestionForm.questionPH}
          ></Input.TextArea>
          <PicCard
            trans={trans}
            setPic={(pic) => setNewQuestion('pic', pic)}
            pic={pic}
            width={82}
          ></PicCard>
          <MusicCard
            trans={trans}
            setAudio={(audio) => setNewQuestion('audio', audio)}
            audio={audio}
            width={82}
          ></MusicCard>
        </div>
      ) : (
        <SortContainer
          sort={sort}
          setSort={(sort) => setNewQuestion('sort', sort)}
          trans={trans}
          sortSize={sortSize}
          setSortSize={(size) => setNewQuestion('sortSize', size)}
        ></SortContainer>
      )}
    </div>
  );
};

interface SortContainerProps {
  sort: SortQuestion[];
  setSort: (sort: SortQuestion[]) => void;
  trans: any;
  sortSize: Size;
  setSortSize: (sortSize: Size) => void;
}

const SortContainer = (props: SortContainerProps) => {
  const { sort, setSort, trans, sortSize, setSortSize } = props;

  const setNewSort = (value, key, id) => {
    const newSort = [...sort];
    const selectSort = newSort.find((item) => item.id === id);
    selectSort[key] = value;
    setSort(newSort);
  };

  const addSort = () => {
    const newSort = [...sort];
    const id = newSort.length === 0 ? 0 : newSort[newSort.length - 1].id + 1;
    newSort.push({
      id,
      content: '',
      pinyin: '',
      tradi: '',
      pic: { url: '', width: 50, height: 50, default: false },
      background: '',
      audio: '',
    });
    setSort(newSort);
  };

  const deleteSort = (id: number) => {
    let newSort = [...sort];
    newSort = newSort.filter((item) => item.id !== id);
    setSort(newSort);
  };

  return (
    <>
      <span style={{ marginLeft: 8, marginRight: 16 }}>
        <span style={{ color: '#000' }}>Container Width : </span>
        <InputNumber
          value={sortSize.width}
          onChange={(value) =>
            setSortSize({ width: value, height: sortSize.height })
          }
        ></InputNumber>
      </span>
      <span>
        <span style={{ color: '#000' }}>container height : </span>
        <InputNumber
          value={sortSize.height}
          onChange={(value) =>
            setSortSize({ width: sortSize.width, height: value })
          }
        ></InputNumber>
      </span>
      <Divider orientation="left">
        {trans.AddQuestionForm.sortContainer}
      </Divider>
      <div style={{ marginTop: 16 }}>
        {sort.map((item: SortQuestion) => (
          <div className="sort-container" key={item.id}>
            <div className="delete-sort" onClick={() => deleteSort(item.id)}>
              <Icon type="close" />
            </div>
            <Input
              value={item.content}
              className="sort-name"
              onChange={(e) => setNewSort(e.target.value, 'content', item.id)}
              placeholder="Sort kind name"
              style={{ width: 158 }}
            />
            <PicCard
              trans={trans}
              setPic={(pic) => setNewSort(pic, 'pic', item.id)}
              pic={item.pic}
              width={75}
              style={{ marginLeft: 0 }}
            ></PicCard>
            <MusicCard
              trans={trans}
              setAudio={(audio) => setNewSort(audio, 'audio', item.id)}
              audio={item.audio}
              width={75}
              style={{ marginLeft: 8 }}
            ></MusicCard>
            <PicCard
              trans={trans}
              setPic={(pic) => setNewSort(pic.url, 'background', item.id)}
              pic={{
                url: item.background,
                width: 50,
                height: 50,
                default: false,
              }}
              width={158}
              placeholder="background"
              style={{ marginLeft: 0, marginTop: 8, height: 88 }}
              noSettings={true}
            ></PicCard>
          </div>
        ))}

        <div style={{ marginTop: 16 }}>
          <Button onClick={addSort} type="primary">
            <Icon type="plus"></Icon>
            {trans.AddQuestionForm.variable14}
          </Button>
        </div>
      </div>
    </>
  );
};

export default QuestionQuestion;

/**
 * @param {string} content 文本dom的innerHTML
 * @returns {[string, string, string]} [简体文本 , 繁体文本 , 拼音文本(空格做间隔符号) ]
 *
 * */

export function getSimp(content: string): string[] {
  content = content.replace(/<\/ruby><div><\/div><ruby>/g, '\n');
  const div = document.createElement('div');
  div.innerHTML = content;

  const simp =
    div
      .querySelector<HTMLElement>('.simp-p')
      ?.innerHTML.replace(/<ruby>/g, '')
      .replace(/<\/ruby>/g, '')
      .replace(/<rt>(.*?)<\/rt>/g, '')
      .replace(/<rb>/g, '')
      .replace(/<\/rb>/g, '')
      .replace(/^\s+|\s+$/g, '') || '';

  const tradi =
    div
      .querySelector<HTMLElement>('.trad-p')
      ?.innerHTML.replace(/<ruby>/g, '')
      .replace(/<\/ruby>/g, '')
      .replace(/<rt>(.*?)<\/rt>/g, '')
      .replace(/<rb>/g, '')
      .replace(/<\/rb>/g, '')
      .replace(/^\s+|\s+$/g, '') || '';

  const pinyin =
    div
      .querySelector<HTMLElement>('.simp-p')
      ?.innerHTML.replace(/<ruby>/g, '')
      .replace(/<\/ruby>/g, '')
      .replace(/<rb>(.*?)<\/rb>/g, '')
      .replace(/<rt>/g, '')
      .replace(/<\/rt>/g, ' ')
      .replace(/^\s+|\s+$/g, '') || '';

  return [simp, tradi, pinyin];
}

export function parseQuestion(
  questionType: QuestionTypes,
  div: HTMLDivElement
) {
  // 分类题
  if (questionType === 5) {
    const sortContainer = div.querySelectorAll<HTMLElement>(
      '.sort-kind-container'
    );
    const sortDivs = div.querySelectorAll<HTMLElement>('.sort-kind-name');

    let sort = [];
    for (let i = 0; i < sortDivs.length; i++) {
      // 获取分类背景
      const backgroundImage = sortContainer[i].style.backgroundImage;
      // 获取题干音频
      const audioDiv = sortDivs[i].querySelector('audio');
      //题干文字
      const [simp, tradi, pinyin] = getSimp(sortDivs[i].innerHTML);

      sort[i] = {
        id: i,
        content: simp.replace(/^\s+|\s+$/g, ''),
        tradi: tradi,
        pinyin: pinyin,
        pic: getPicOptions(sortDivs[i]),
        audio: audioDiv ? audioDiv.getAttribute('src') : '',
        background: backgroundImage.replace('url("', '').replace('")', ''),
      };
    }

    let result: SortQuestionOptions = {
      textStyle: {
        lineHeight: sortDivs[0].style.lineHeight,
        color: sortDivs[0].style.color,
        fontSize: Number(sortDivs[0].style.fontSize.replace('px', '')),
        bold: sortDivs[0].style.fontWeight + '' === '700',
        italic: sortDivs[0].style.fontStyle === 'italic',
      },
      sortSize: {
        width: Number(sortContainer[0].style.width.replace('px', '')),
        height: Number(sortContainer[0].style.height.replace('px', '')),
      },
      sort: sort,
    };

    return result;
  }

  // 其它题型
  else {
    const stemDiv = div.querySelector<HTMLElement>('.question-name');

    const audioDiv = stemDiv.querySelector('audio');
    // 题干文字
    let [simp, tradi, pinyin] = getSimp(stemDiv.innerHTML);
    // 填空题
    if (questionType === 1) {
      simp = simp.replace(/<input.*?>/g, '____');
    }

    let result: CommonQuestionOptions = {
      content: simp,
      tradi: tradi,
      pinyin: pinyin,
      audio: audioDiv?.getAttribute('src') || '',
      textStyle: {
        lineHeight: stemDiv.style.lineHeight,
        color: stemDiv.style.color,
        fontSize: Number(stemDiv.style.fontSize.replace('px', '')),
        bold: stemDiv.style.fontWeight + '' === '700',
        italic: stemDiv.style.fontStyle === 'italic',
      },
      pic: getPicOptions(stemDiv)
    };

    return result;
  }
}

export const getCommonQuestion = (questionStyle, pic, content, audio) => {
  const width = pic?.default ? '100%' : pic.width + 'px';
  const height = pic?.default ? 'auto' : pic.height + 'px';
  return `<div class="question-name" style="font-size: ${
    questionStyle.fontSize
  }px; font-weight: ${questionStyle.bold ? '700' : 'normal'}; color: ${
    questionStyle.color
  }; font-style: ${questionStyle.italic ? 'italic' : 'normal'}; line-height: ${
    questionStyle.lineHeight
  };">
  ${
    pic?.svg
      ? `<div class='question-svg-container' style='width: ${width}; height: ${height}'>${pic.svg}</div>`
      : ''
  }
  ${
    pic?.url && !pic?.svg
      ? `<img src="${pic.url}" class="question-name-img" width="${width}" height="${height}" />`
      : ''
  }
  ${content}
  ${
    audio
      ? `<div onclick="questionAudio(this)" class="music-pause">
           <audio controlsList="nodownload" src="${audio}"></audio>
         </div>`
      : ''
  }
  </div>`;
};

export const getSortQuestion = (
  sortTrans: string[],
  sortStem: SortQuestionOptions
) => {
  let sortKindContainers = '';
  const textStyle = sortStem.textStyle;
  const textStyleStr = `font-size: ${textStyle.fontSize}px; font-weight: ${
    textStyle.bold ? '700' : 'normal'
  }; color: ${textStyle.color}; font-style: ${
    textStyle.italic ? 'italic' : 'normal'
  }; line-height: ${textStyle.lineHeight};`;

  const sizeStr = `width: ${sortStem.sortSize.width}px; height: ${sortStem.sortSize.height}px;`;

  sortStem.sort.forEach((value, index) => {
    const width = value?.pic?.default ? '100%' : value?.pic.width + 'px';
    const height = value?.pic?.default ? 'auto' : value?.pic.height + 'px';
    sortKindContainers += `<div class="sort-kind-container" data-index="${index}" 
    style="${sizeStr}${
      value.background ? `background-image: url(${value.background});` : ''
    }">
    <div class="sort-kind-name" style="${textStyleStr}">
    ${
      value.pic?.svg
        ? `<div class='question-svg-container' style='width: ${width}; height: ${height}'>${value?.pic.svg}</div>`
        : ''
    }
    ${
      value.pic?.url
        ? `<img src="${value.pic.url}" class="question-name-img" width="${width}" height="${height}" />`
        : ''
    }
    <span>${sortTrans[index]}</span>
    ${
      value.audio
        ? `<div onclick="questionAudio(this)" class="music-pause">
             <audio controlsList="nodownload" src="${value.audio}"></audio>
           </div>`
        : ''
    }
    </div>
    <div class="sort-item-container" data-index="${index}"></div>
    </div>`;
  });

  return sortKindContainers;
};
