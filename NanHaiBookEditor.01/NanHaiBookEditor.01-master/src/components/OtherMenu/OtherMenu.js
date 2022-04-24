import React, { useState } from 'react';
import Dialog from '../Dialog/Dialog';
import MyLeaflet from '../MyLeaflet/MyLeaflet';
import ColorFillGame from '../ColorFillGame/ColorFillGame';
import Atlas from '../Atlas/Atlas';
import { ElementTypes } from '../../constants';
import { actAddElement } from '../../store/bookPages/actions';
import Elements_Map from './Elements_Map.png';
import Elements_Drawing from './Elements_Drawing.png';
import Elements_Code from './code.png';
import Elements_ColorFill from './colorFill.png';
import Elements_Atlas from './atlas.png';
import Elements_TypingBox from './typingBox.png';

import { connect } from 'react-redux';
import { Select, Icon, Modal, InputNumber, Row, Col } from 'antd';
import TimerPanel from '../Timer/TimrtPanel';

import { actSetPaginate } from '../../store/bookPages/actions';
import IconButton from '../MenuItems/IconButton';

import styles from './OtherMenu.module.css';
import ColorPicker from '../HomeMenu/PhotoGallery/ColorPicker';
import Drawing from '../Drawing';

class OtherMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timerVisible: false,
      ColorFillGameShow: false,
      AtlasShow: false,
      DrawingShow: false,
      inputTextAreaMaxLShow: false,
      inputTextAreaMaxL: 145,
      inputTextAreaFontSize: 14,
      inputTextAreaColor: '#000',
      inputTextAreaLineHeight: 14
    };
  }

  cancelColorFillGame = () => {
    this.setState({
      ColorFillGameShow: false
    })
  }
  cancelAtlas = () => {
    this.setState({
      AtlasShow: false
    })
  }
  cancelDrawing = () => {
    this.setState({
      DrawingShow: false
    })
  }

  render() {
    const {
      trans,
      bookPages,
      openMapDialog,
      addElement,
      setPaginate
    } = this.props;
    const { inputTextAreaMaxLShow, inputTextAreaMaxL, inputTextAreaFontSize,
      inputTextAreaColor,
      inputTextAreaLineHeight } = this.state
    return (
      <div>
        <IconButton
          text={trans.ElementsMenu.timer}
          onClickCallback={() => this.setState({ timerVisible: true })}
        >
          <Icon
            type="clock-circle"
            style={{ fontSize: 32, lineHeight: '34px' }}
          />
        </IconButton>
        <TimerPanel
          visible={this.state.timerVisible}
          onCancel={() => this.setState({ timerVisible: false })}
        />
        <IconButton
          text={trans.ElementsMenu.map}
          onClickCallback={openMapDialog()}
        >
          <img src={Elements_Map} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
        <IconButton
          text={trans.ElementsMenu.drawbox}
          // onClickCallback={addElement(ElementTypes.drawingBox)}
          onClickCallback={() => this.setState({ DrawingShow: true })}
        >
          <img
            src={Elements_Drawing}
            style={{ width: '36px', height: 'auto' }}
          />
        </IconButton>
        <IconButton
          text={trans.ElementsMenu.insertCode}
          onClickCallback={addElement(ElementTypes.insertCode)}
        >
          <img
            src={Elements_Code}
            style={{ width: '36px', height: 'auto' }}
          />
        </IconButton>
        <IconButton
          text={trans.OtherMenu.ColorFillGame}
          onClickCallback={() => this.setState({ ColorFillGameShow: true })}
        >
          <img
            src={Elements_ColorFill}
            style={{ width: '36px', height: 'auto' }}
          />
        </IconButton>
        <IconButton
          text={trans.OtherMenu.Atlas}
          onClickCallback={() => this.setState({ AtlasShow: true })}
        >
          <img
            src={Elements_Atlas}
            style={{ width: '36px', height: 'auto' }}
          />
        </IconButton>
        <ColorFillGame
          visible={this.state.ColorFillGameShow}
          trans={trans}
          // onRef={(ref)=>{ this.state.child = ref}}
          addElement={addElement}
          handleCancel={this.cancelColorFillGame}
        />
        <Atlas
          visible={this.state.AtlasShow}
          trans={trans}
          addElement={addElement}
          handleCancel={this.cancelAtlas}
        />
        <Drawing 
          visible={this.state.DrawingShow}
          handleCancel={this.cancelDrawing}
          trans={trans}
          addElement={addElement}
          />
        <IconButton
          text={trans.OtherMenu.typingBox}
          onClickCallback={() => {
            this.setState({ inputTextAreaMaxLShow: !inputTextAreaMaxLShow, inputTextAreaMaxL: 145 })
          }}
        >
          <img
            src={Elements_TypingBox}
            style={{ width: '36px', height: 'auto' }}
          />
        </IconButton>
        {inputTextAreaMaxLShow && <Modal visible title="Setting" onCancel={() => {
          this.setState({ inputTextAreaMaxLShow: false })
        }} onOk={() => {
          addElement(ElementTypes.typingBox, { maxLength: inputTextAreaMaxL,color:inputTextAreaColor,fontSize:inputTextAreaFontSize,lineHeight:inputTextAreaLineHeight })()
          this.setState({ inputTextAreaMaxLShow: false })
        }}>
          <Row style={{marginBottom:10}}>
            <Col span={6}>maxLength</Col>
            <Col span={18}>
              <InputNumber value={inputTextAreaMaxL} onChange={(e) => {
                this.setState({ inputTextAreaMaxL: e })
              }} />
            </Col>
          </Row>
          <Row style={{marginBottom:10}}>
            <Col span={6}>fontSize</Col>
            <Col span={18}>
              <InputNumber value={inputTextAreaFontSize} onChange={(e) => {
                this.setState({ inputTextAreaFontSize: e })
              }} />
            </Col>
          </Row>
          <Row style={{marginBottom:10}}>
            <Col span={6}>fontColor</Col>
            <Col span={18}>
              <ColorPicker color={inputTextAreaColor} change={(color) => {
                this.setState({ inputTextAreaColor: color })
              }} />
            </Col>
          </Row>
          <Row style={{marginBottom:10}}>
            <Col span={6}>lineHeight</Col>
            <Col span={18}>
              <InputNumber value={inputTextAreaLineHeight} onChange={(e) => {
                this.setState({ inputTextAreaLineHeight: e })
              }} />
            </Col>
          </Row>
        </Modal>}
      </div>
    );
  }
}

const mapStateToProps = ({ trans, bookPages }) => ({
  trans,
  bookPages
});

const mapDispatchToProps = dispatch => ({
  setPaginate: paginate => {
    dispatch(actSetPaginate(paginate));
  },
  addElement: (type, content) => {
    return e => {
      dispatch(actAddElement(type, content));
    };
  },
  openMapDialog: () => {
    return () => {
      Dialog.open({
        childrens: [MyLeaflet],
        props: {
          onSaveMap: dataUrl => {
            //
            dispatch(actAddElement(ElementTypes.leafletMap, dataUrl));
            Dialog.close();
          },
          closeDialog: () => {
            Dialog.close();
          }
        },
        closeDialog: () => {
          console.log('关闭了dialog');
        }
      });
    };
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OtherMenu);
