import React from 'react';
import './TypingBox.css';

class TypingBox extends React.Component {
  state = {
  }
  componentDidMount() {
  }

  render() {

    return (
      <div style={{textAlign: 'center',padding:'45px'}}>
        <canvas id="drawing_canvas" width='1000' height='500'></canvas>
        <div className="drawing-footer">
          <div className="drawing-button drawing-confirm" onClick={this.saveDrawing}>保存</div>
          <div className="drawing-button drawing-cancel" onClick={this.props.closeDialog}>取消</div>
        </div>
      </div>
    )
  }
}

export default TypingBox;