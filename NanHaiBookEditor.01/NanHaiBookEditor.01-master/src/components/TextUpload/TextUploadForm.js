import React from 'react';
import { Button, Form, message, Upload, Icon } from 'antd';
import { connect } from 'react-redux';

const handleUpload = (res, act) => {
  let textObj;
  if (res.msg === 'ok' && res.result) {
    textObj = res.result;
    act(textObj);
    return true;
  }
  return false;
};

class UploadForm extends React.Component {
  render() {
    const { onSubmit } = this.props;
    const options = {
      name: 'file',
      action: '/api/pinyin',
      onChange(info) {
        if (info.file.status === 'done') {
          if (handleUpload(info.file.response, onSubmit)) {
            message.success(`${info.file.name} 上传成功。`);
          }
          else{
            if(info.file.response && info.file.response.msg){
              message.error(`${info.file.response.msg} 上传失败。`);
            }else{
              message.error(`上传失败。${JSON.stringify(info.file)}`);
            }
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败。`);
        }
      }
    };
    return (
      <Form>
        <Upload {...options}>
          <Button type="ghost">
            <Icon type="upload" /> 点击上传
          </Button>
        </Upload>
      </Form>
    );
  }
}

const TextUploadForm = Form.create({ name: 'register' })(UploadForm);

const mapDispatchToProps = dispatch => ({});

export default connect(
  null,
  mapDispatchToProps
)(TextUploadForm);
