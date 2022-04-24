import { Checkbox, InputNumber, Radio } from 'antd';
import React from 'react';
import { QuestionTypes, CommonSettingOptions } from '../types';
import MusicCard from '../Common/MusicCard';

interface QuestionSettingsProps {
  trans: any;
  questionType: QuestionTypes;
  settings?: CommonSettingOptions;
  setSettings: (options: CommonSettingOptions) => void;
}

const QuestionSettings = (props: QuestionSettingsProps) => {
  const { trans, questionType, settings, setSettings } = props;
  const { type, wrongAudio, rightAudio, groupIndex, pageLocked } = settings;

  const setNewSettings = (key, value) => {
    const newSettings = { ...settings };
    newSettings[key] = value;
    setSettings(newSettings);
  };

  return (
    <div>
      {questionType === 0 && (
        <div style={{ marginBottom: 16 }}>
          {trans.AddQuestionForm.joinGroup}
          <InputNumber
            value={groupIndex}
            min={0}
            max={20}
            style={{ width: 90, margin: '0 8px' }}
            onChange={(value) => setNewSettings('groupIndex', value)}
          />
          ({trans.AddQuestionForm.joinGroupPS})
        </div>
      )}
      {questionType !== 6 && questionType !== 7 && (
        <>
          <Radio.Group
            onChange={(e) => setNewSettings('type', e.target.value)}
            value={type}
          >
            <Radio value={1}>{trans.AddQuestionForm.showAnswer}</Radio>

            <Radio value={2}>{trans.AddQuestionForm.continueAnswer}</Radio>
          </Radio.Group>

          <div style={{ margin: '16px 0' }}>
            <MusicCard
              trans={trans}
              setAudio={(audio) => setNewSettings('rightAudio', audio)}
              audio={rightAudio}
              width={90}
              placeholder={trans.AddQuestionForm.rightAudio}
              style={{ marginLeft: 0 }}
            ></MusicCard>

            <MusicCard
              trans={trans}
              setAudio={(audio) => setNewSettings('wrongAudio', audio)}
              audio={wrongAudio}
              width={90}
              placeholder={trans.AddQuestionForm.wrongAudio}
            ></MusicCard>
          </div>
        </>
      )}
      <div>
        <Checkbox
          checked={pageLocked}
          onChange={(e) => setNewSettings('pageLocked', e.target.checked)}
        >
          {trans.AddQuestionForm.lockPage}
        </Checkbox>
      </div>
    </div>
  );
};

export default QuestionSettings;

export function parseQuestionSettings(div: HTMLElement): CommonSettingOptions {
  const questionContainer = div.querySelector(
    '.question-container'
  ) as HTMLElement;
  const rightAudio = div.querySelector('.question-right-audio');
  const wrongAudio = div.querySelector('.question-wrong-audio');

  return {
    type: ~~questionContainer.getAttribute('data-type') === 2 ? 2 : 1,
    pageLocked: questionContainer.getAttribute('data-lockpage') === '1',
    rightAudio: rightAudio?.getAttribute('src') || '',
    wrongAudio: wrongAudio?.getAttribute('src') || '',
    groupIndex: questionContainer.style.zIndex
      ? ~~questionContainer.style.zIndex
      : 0,
  };
}
