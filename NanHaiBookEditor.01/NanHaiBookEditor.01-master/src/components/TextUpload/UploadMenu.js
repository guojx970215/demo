import React, { useState } from 'react';

import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import TextUploadForm from './TextUploadForm';
import IconButton from '../MenuItems/IconButton';
import ChoiceQuestionIcon from '../../icons/ChoiceQuestion';
import { actInsertUploadedText } from '../../store/bookPages/actions';
import Interactive_TextUpload from './Interactive_TextUpload.png'

const { confirm } = Modal;

const UploadMenu = ({ trans, actInsertUploadedText }) => {
  const [state, setState] = useState({
    visible: false,
    action: 0,
    modalTitle: '',
    width: '50%',
    editRecord: {}
  });

  const showUploadModal = () => {
    setState({
      visible: true,
      action: 0,
      modalTitle: 'Upload Text'
    });
  };

  const handleCancel = e => {
    console.log(e);
    setState({
      visible: false
    });
  };
  return (
    <div>
      <IconButton
        text={trans.Uploaded.textupload}
        onClickCallback={showUploadModal}
      >
        <img src={Interactive_TextUpload} style={{ width: '36px', height: 'auto' }} />
      </IconButton>

      <Modal
        title={state.modalTitle}
        visible={state.visible}
        width={state.width}
        footer={null}
        onCancel={handleCancel}
      >
        {state.action === 0 ? (
          <TextUploadForm
            onCancal={handleCancel}
            onSubmit={actInsertUploadedText}
          ></TextUploadForm>
        ) : (
          ''
        )}
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ trans, bookPages }) => ({
  trans,
  bookPages
});

const mapDispatchToProps = dispatch => ({
  actInsertUploadedText: textObj => {
    dispatch(actInsertUploadedText(textObj));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadMenu);
