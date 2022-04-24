import React, { useState, useEffect} from 'react';
import { InputNumber, Checkbox, Button } from 'antd';
import { connect } from 'react-redux';

const TextStyle = props => {
  const trans = props.trans;
  
  return (<div>
    <div className="lineHeightList">
              <span>{trans.UEditor.lineHeight}</span>
              <InputNumber
                value={props.lineHeight}
                style={{ width: 126 }}
                onChange={value => props.changeLineHeight(value)}
                step={0.5}
                min={0}
              />
            </div>
            <div className="lineHeightList">
              <span>{trans.UEditor.letterSpacing}</span>
              <InputNumber
                value={props.letterSpacing}
                style={{ width: 102, marginRight: 8 }}
                min={0}
                step={0.1}
                onChange={value => props.changeLetterSpacing(value)}
              />
              px
            </div>
            <div className="lineHeightList">
              <span />
              <Checkbox
                checked={props.vertical}
                onChange={e => props.changeVertical(e)}
              >
                {trans.UEditor.vertical}
              </Checkbox>
            </div>
            <Button
              onClick={() => {
                props.closeModal();
              }}
              style={{ width: '100%' }}
            >
              {trans.UEditor.cancel}
            </Button>
         
  </div>)
}


const mapStateToProps = ({ trans}) => ({
  trans
});
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TextStyle);