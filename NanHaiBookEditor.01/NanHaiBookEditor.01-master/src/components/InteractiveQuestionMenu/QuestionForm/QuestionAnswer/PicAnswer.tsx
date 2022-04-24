import React, { useEffect, useState } from 'react';
import { AnswerOptions, PicAnswerOptions, PicOptions } from '../types';
import PicCard from '../Common/PicCard';
import { Button, Icon, Modal } from 'antd';
import './setImageAnswer.css';

interface SetImageAnswerProps {
  pic: PicOptions;
  visible: boolean;
  onCancel: () => void;
  onOk: (area: RightArea[]) => void;
  answers: RightArea[];
}

interface PicAnswerProps {
  trans: any;
  answer: PicAnswerOptions;
  setAnswer: (answer: AnswerOptions) => void;
}

interface RightArea {
  id: string | number;
  w: string;
  h: string;
  x: string;
  y: string;
}

const SetImageAnswer = (props: SetImageAnswerProps) => {
  const { pic, visible, onCancel, onOk, answers } = props;

  const [config, setConfig] = useState({
    x: -1,
    y: -1,
    w: 0,
    h: 0,
  });

  const [size, setSize] = useState({
    w: 0,
    h: 0,
  });

  const [newAnswer, setNewAnswer] = useState([]);

  useEffect(() => {
    let scale = pic.width / pic.height;
    setSize({
      w: ~~(scale * window.innerHeight * 0.8),
      h: ~~(window.innerHeight * 0.8),
    });

    setNewAnswer(answers);
  }, [visible, pic]);

  useEffect(() => {
    if (config.x < 0) {
      return;
    }
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', stopDrag);

    return () => {
      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('mouseup', stopDrag);
    };
  }, [config.x, config.y]);

  const startDrag = (e) => {
    e.preventDefault();

    let rect = document
      .getElementById('set-image-container')
      .getBoundingClientRect();

    setConfig({ x: e.pageX - rect.left, y: e.pageY - rect.top, w: 0, h: 0 });
  };

  const onDragMove = (e) => {
    e.preventDefault();
    let rect = document
      .getElementById('set-image-container')
      .getBoundingClientRect();

    let w = e.pageX - rect.left - config.x;
    let h = e.pageY - rect.top - config.y;
    if (w > 5 || h > 5) {
      setConfig({
        ...config,
        w,
        h,
      });
    }
  };

  const stopDrag = (e) => {
    e.preventDefault();

    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', stopDrag);

    if (config.w > 5 && config.h > 5) {
      let id =
        newAnswer.length === 0 ? 0 : newAnswer[newAnswer.length - 1].id + 1;
      let copyNewAnswer = [
        ...newAnswer,
        {
          id,
          x: ((config.x / size.w) * 100).toFixed(1) + '%',
          y: ((config.y / size.h) * 100).toFixed(1) + '%',
          w: ((config.w / size.w) * 100).toFixed(1) + '%',
          h: ((config.h / size.h) * 100).toFixed(1) + '%',
        },
      ];
      setNewAnswer(copyNewAnswer);
    }

    setConfig({
      x: -1,
      y: -1,
      w: 0,
      h: 0,
    });
  };

  const deleteArea = (e, id) => {
    e.preventDefault();

    let copyNewAnswer = [...newAnswer];
    copyNewAnswer = copyNewAnswer.filter((value) => value.id !== id);
    setNewAnswer(copyNewAnswer);
  };

  const returnConfig = () => {
    onOk(newAnswer);
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      wrapClassName="set-image-modal"
      closable={false}
    >
      <div
        id="set-image-container"
        className="set-image-container"
        style={{ width: size.w, height: size.h }}
        onMouseDown={(e) => startDrag(e)}
        onMouseUp={stopDrag}
      >
        <img src={pic.url} width="100%" height="100%" />
        {config.w > 0 && config.y > 0 ? (
          <div
            className="answer-area"
            style={{
              width: config.w,
              height: config.h,
              left: config.x,
              top: config.y,
            }}
          ></div>
        ) : (
          ''
        )}
        {newAnswer.map((value) => (
          <div
            key={value.id}
            className="answer-area"
            style={{
              width: value.w,
              height: value.h,
              left: value.x,
              top: value.y,
            }}
            onContextMenu={(e) => deleteArea(e, value.id)}
          ></div>
        ))}
      </div>
      <div className="buttons-group">
        <div className="button-check" onClick={() => returnConfig()}>
          <Icon type="check" />
        </div>
        <div className="button-cancel" onClick={onCancel}>
          <Icon type="close" />
        </div>
      </div>
    </Modal>
  );
};

const PicAnswer = (props: PicAnswerProps) => {
  const { trans, answer, setAnswer } = props;
  const { pic } = answer;
  const rightArea = answer.answer;
  const [areaVisible, setAreaVisible] = useState<boolean>(false);

  const setNewAnswer = (key, value) => {
    const newAnswer = { ...answer };
    newAnswer[key] = value;
    setAnswer(newAnswer);
  };

  const setRightAraes = (area) => {
    setNewAnswer('answer', area);
    setAreaVisible(false);
  };

  return (
    <>
      <Button
        onClick={() => setAreaVisible(true)}
        disabled={!pic.url}
        type="primary"
        style={{ width: 500, display: 'block', margin: 16 }}
      >
        {trans.AddQuestionForm.variable6}
      </Button>

      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          marginRight: 16,
        }}
      >
        <PicCard
          trans={trans}
          pic={pic}
          setPic={(pic) => setNewAnswer('pic', pic)}
          width={500}
          hideDefault={true}
        ></PicCard>

        <div className="answer-pic-area-cover">
          {rightArea.map((area) => (
            <div
              className="answer-pic-area"
              key={area.id}
              style={{
                top: area.y,
                left: area.x,
                width: area.w,
                height: area.h,
              }}
            ></div>
          ))}
        </div>
      </div>

      <SetImageAnswer
        visible={areaVisible}
        pic={pic}
        onCancel={() => setAreaVisible(false)}
        onOk={setRightAraes}
        answers={rightArea}
      ></SetImageAnswer>
    </>
  );
};

export default PicAnswer;

export const getPicStr = async (
  answer: PicAnswerOptions
): Promise<string[]> => {
  let rightAreas = '',
    answerContainer = '';

  answer.answer.forEach((value) => {
    rightAreas = `${rightAreas}<div class="answer-area hide-area right-area-${value.id}" style="width: ${value.w};
        height: ${value.h}; top: ${value.y}; left: ${value.x};" ></div>`;
  });

  answerContainer = `<div class="answer-pic-container" 
      style="width: ${answer.pic.width}px; height: ${
    answer.pic.height
  }px;" data-rightarea='${JSON.stringify(answer.answer)}'>
      <img src="${answer.pic.url}" width="100%" 
      height="100%" />
      ${rightAreas}
      </div><div class="zoom-pic"></div>`;

  return [answerContainer];
};

export function parsePic(div: HTMLDivElement): PicAnswerOptions {
  const answersCon = div.querySelector('.answer-pic-container') as HTMLElement;
  const answersImg = div.querySelector('.answer-pic-container img');
  const width = answersCon?.style.width.replace('px', '') || 50;
  const height = answersCon?.style.height.replace('px', '') || 50;
  return {
    pic: {
      url: answersImg.getAttribute('src'),
      width: width === '100%' ? 50 : ~~width,
      height: height === 'auto' ? 50 : ~~height,
      default: width === '100%',
    },
    answer: JSON.parse(answersCon.getAttribute('data-rightarea')),
  };
}
