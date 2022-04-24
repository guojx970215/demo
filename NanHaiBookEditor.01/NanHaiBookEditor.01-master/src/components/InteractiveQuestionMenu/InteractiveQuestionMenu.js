import React, { useState } from 'react';

import { connect } from 'react-redux';
import {
  addChoiceQuestion,
  actAddElement,
  actAddStateNext,
  actSetQuestionsGroup,
} from '../../store/bookPages/actions';
import { ElementTypes } from '../../constants';

const mapDispatchToProps = (dispatch) => ({
  addChoiceQuestion: (question) => {
    dispatch(addChoiceQuestion(ElementTypes.choiceQuestion, question));
  },
  addNewChoiceQuestion: (content) => {
    dispatch(actAddElement(ElementTypes.newChoiceQuestion, content));
  },
  setQuestionsGroup: (content) => {
    dispatch(actSetQuestionsGroup(content));
  },
  actNewAddStateNext: (content) => {
    dispatch(actAddStateNext(ElementTypes.nextButton, content));
  },
});

const mapStateToProps = ({ trans, bookPages }) => ({
  trans,
  bookPages,
});

import QuestionForm from './QuestionForm/QuestionForm.tsx';
import NextButton from './NextButton/NextButton';
import IconButton from '../MenuItems/IconButton';
import Interactive_TextUpload from './Interactive_TextUpload.png';
import './InteractiveQuestionMenu.css';

const InteractiveQuestionMenu = (props) => {
  const {
    trans,
    addChoiceQuestion,
    addNewChoiceQuestion,
    actNewAddStateNext,
    setQuestionsGroup,
  } = props;

  const [state, setState] = useState({
    visible: false,
    modalTitle: '',
  });
  const [questionType, setQuestionType] = useState(0);
  const [nextButtonVisible, setNextButtonVisible] = useState(false);

  const showQuestionModal = (questionType) => {
    setState({
      visible: true,
      modalTitle: '创建题目',
    });
    setQuestionType(questionType);
  };

  const handleCancel = (e) => {
    setState({
      visible: false,
    });
  };

  const handleOk = ({ dom, isGroup }) => {
    if (!isGroup) {
      addNewChoiceQuestion(dom);
    } else {
      setQuestionsGroup(dom);
    }
  };

  return (
    <div>
      <IconButton
        text={trans.InteractiveQuestionMenu.choices}
        onClickCallback={() => showQuestionModal(0)}
      >
        <img
          src={Interactive_TextUpload}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton>
      <IconButton
        text={trans.InteractiveQuestionMenu.fillBlank}
        onClickCallback={() => showQuestionModal(1)}
      >
        <img
          src={Interactive_TextUpload}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton>
      <IconButton
        text={trans.InteractiveQuestionMenu.arrays}
        onClickCallback={() => showQuestionModal(2)}
      >
        <img
          src={Interactive_TextUpload}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton>
      <IconButton
        text={trans.InteractiveQuestionMenu.lines}
        onClickCallback={() => showQuestionModal(3)}
      >
        <img
          src={Interactive_TextUpload}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton>
      <IconButton text={trans.InteractiveQuestionMenu.pic} onClickCallback={() => showQuestionModal(4)}>
        <img
          src={Interactive_TextUpload}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton>

      <IconButton text={trans.InteractiveQuestionMenu.sort}  onClickCallback={() => showQuestionModal(5)}>
        <img
          src={Interactive_TextUpload}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton>

      <IconButton text={trans.InteractiveQuestionMenu.audio}  onClickCallback={() => showQuestionModal(6)}>
        <img
          src={Interactive_TextUpload}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton>

      <IconButton text={trans.InteractiveQuestionMenu.writing}  onClickCallback={() => showQuestionModal(7)}>
        <img
          src={Interactive_TextUpload}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton>

      <IconButton
        text={trans.InteractiveQuestionMenu.nextButton}
        onClickCallback={() => setNextButtonVisible(true)}
      >
        <img
          src={Interactive_TextUpload}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton>

      <QuestionForm
        trans={trans}
        onCancel={handleCancel}
        visible={state.visible}
        questionType={questionType}
        onOk={handleOk}
      ></QuestionForm>

      <NextButton
        trans={trans}
        onCancel={setNextButtonVisible.bind(null, false)}
        visible={nextButtonVisible}
        actNewAddStateNext={actNewAddStateNext}
      />
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InteractiveQuestionMenu);
