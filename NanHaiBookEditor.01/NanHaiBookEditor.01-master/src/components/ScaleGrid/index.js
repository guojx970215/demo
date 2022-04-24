import React from 'react';
import './styles.css';
import $ from "jquery";

const gridLine = ($grid, n, size) => {

  const xLineNumber = Math.round(size.width/n);
  const yLineNumber = Math.round(size.height/n);
  let canvas= $grid[0];
  canvas.width = size.width;
  canvas.height = size.height;
  let ctx=canvas.getContext("2d");
  ctx.beginPath();
  ctx.setLineDash([3, 8]);
  Array.apply(null, new Array(xLineNumber)).forEach((item, i) => {
    let index = i - Math.round(xLineNumber/2);
    ctx.moveTo(index * n  + size.width/2, 0);
    ctx.lineTo(index * n  + size.width/2, size.height);
  });
  Array.apply(null, new Array(yLineNumber)).forEach((item, i) => {
    let index = i - Math.round(yLineNumber/2);
    ctx.moveTo(0, index * n  + size.height/2);
    ctx.lineTo(size.width, index * n  + size.height/2);
  });
  ctx.stroke()
}

class ScaleGrid extends React.Component {

  componentWillReceiveProps(nextProps){
    gridLine($('#grid_canvas'),50, this.props.portraitLayout);
  }

  render() {
    return (
      <div className="grid_line_box" style={{visibility:`${this.props.show ? 'visible' : 'hidden'}`}}>
        <canvas id="grid_canvas"></canvas>
      </div>
    )
  }
}

export default ScaleGrid;