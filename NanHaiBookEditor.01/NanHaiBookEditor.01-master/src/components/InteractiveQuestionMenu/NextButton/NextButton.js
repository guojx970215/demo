import React, { useState } from 'react';
import { Modal, InputNumber } from 'antd';

const NextButton = (props) => {
  const {
    trans, // i18n
    visible, // modal 框的显隐藏
    onCancel, // 关闭的回调
    actNewAddStateNext, // 在redux state树中添加NextButton
  } = props;

  const [jumpBackPage, setJumpBackPage] = useState(1);
  const [jumpToPage, setJumpToPage] = useState(1);

  const onFinished = () => {
    const buttonContent = `<div class='question-next-button' 
    onclick='showNextStepModal(${jumpBackPage},${jumpToPage})'>NEXT</div>`;
    actNewAddStateNext(buttonContent);
    onCancel();
  };

  return (
    <Modal
      title={trans.InteractiveQuestionMenu.nextButton}
      visible={visible}
      width="400px"
      onCancel={onCancel}
      onOk={onFinished}
    >
      <span>返回页码：</span>
      <InputNumber
        value={jumpBackPage}
        min={1}
        onChange={(value) => setJumpBackPage(value)}
        style={{ width: 260, marginLeft: 16, marginBottom: 16 }}
      />

      <span>跳转页码：</span>
      <InputNumber
        value={jumpToPage}
        min={1}
        onChange={(value) => setJumpToPage(value)}
        style={{ width: 260, marginLeft: 16 }}
      />
    </Modal>
  );
};

export default NextButton;
