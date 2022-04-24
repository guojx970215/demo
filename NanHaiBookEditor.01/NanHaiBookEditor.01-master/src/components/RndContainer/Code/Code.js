import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/neat.css';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/javascript/javascript.js';
import './Code.css';
import { Select, Modal, message, Button } from 'antd';
const { Option } = Select;

const prefix = '<!--data for code split in bookeditor';

class Code extends React.Component {
  state = {
    htmlTem: '',
    htmlValue: '',
    cssTem: '',
    cssValue: '',
    jsTem: '',
    jsValue: '',
    html: '',
  };

  componentDidMount() {
    let { element } = this.props;
    if (element.config.extends) {
      try {
        let html = JSON.parse(element.config.extends);
        const { htmlTem, cssTem, jsTem } = html;
        this.setState(
          {
            htmlTem: htmlTem,
            cssTem: cssTem,
            jsTem: jsTem,
          },
          this.runCode
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  runCode = () => {
    let html = this.createHtml();
    this.setState({
      html: html,
    });
  };

  createHtml = () => {
    let { htmlTem, cssTem, jsTem } = this.state;

    let html = `<script>${jsTem}</script><style>${cssTem}</style>${htmlTem}`;
    return html;
  };

  handleOk = (e) => {
    let { htmlTem, cssTem, jsTem } = this.state;
    let { element } = this.props;
    element.config = {
      ...element.config,
      extends: JSON.stringify({ htmlTem, cssTem, jsTem }),
    };
    // let html = this.createHtml();

    let jsonData = JSON.stringify({
      html: htmlTem,
      css: cssTem,
      js: jsTem,
    });
    jsonData = Base64.stringify(Utf8.parse(jsonData));
    this.props.saveCode(
      `<iframe class="insertcode-iframe" data-json='${jsonData}'></iframe>`,
      element.config
    );
    this.handleCancel();
  };

  handleCancel = (e) => {
    this.setState({
      htmlTem: '',
      htmlValue: '',
      cssTem: '',
      cssValue: '',
      jsTem: '',
      jsValue: '',
      html: '',
    });
    this.props.closeDialog();
  };

  render() {
    const { html, htmlTem, cssTem, jsTem } = this.state;
    const { trans } = this.props;

    return (
      <div className="codeModalMain">
        <div className="codeHeader">
          <Button type="primary" className="btn" onClick={this.runCode}>
            Run
          </Button>
        </div>
        <div className="mainBox">
          <div className="editArea">
            <div className="codeArea">
              <div className="title">HTML</div>
              <CodeMirror
                value={htmlTem}
                options={{
                  mode: 'xml',
                  theme: 'material',
                  lineNumbers: false,
                  lineWrapping: true,
                }}
                onBeforeChange={(editor, data, value) => {
                  this.setState({
                    htmlTem: value,
                  });
                }}
              />
            </div>
            <div className="codeArea">
              <div className="title">CSS</div>
              <CodeMirror
                value={cssTem}
                options={{
                  mode: 'css',
                  theme: 'material',
                  lineNumbers: false,
                  lineWrapping: true,
                }}
                onBeforeChange={(editor, data, value) => {
                  this.setState({
                    cssTem: value,
                  });
                }}
              />
            </div>
            <div className="codeArea">
              <div className="title">JS</div>
              <CodeMirror
                value={jsTem}
                options={{
                  mode: 'javascript',
                  theme: 'material',
                  lineNumbers: false,
                  lineWrapping: true,
                }}
                onBeforeChange={(editor, data, value) => {
                  this.setState({
                    jsTem: value,
                  });
                }}
              />
            </div>
          </div>
          <div className="previewCode">
            <iframe
              style={{
                border: 0,
                height: '100%',
                width: '100%',
              }}
              srcDoc={html}
            ></iframe>
          </div>
        </div>
        <div className="code-footer">
          <div
            onClick={() => {
              this.handleOk();
            }}
            className="ueditor-button ueditor-confirm"
          >
            {trans.UEditor.confirm}
          </div>
          <div
            onClick={this.handleCancel}
            className="ueditor-button ueditor-cancel"
          >
            {trans.UEditor.cancel}
          </div>
        </div>
      </div>
    );
  }
}

export default Code;
