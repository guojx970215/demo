import React from 'react';
import $ from 'jquery';

import './styles.css';

const drawTicks = ($ruler, n, direction, scale,size) => {
  // let size = direction === 'horizontal' ? $ruler.width() : $ruler.height();
  size = size * scale;
  let ticksNumber = Math.round(size/(n*scale));
  if(ticksNumber !== ticksNumber){
    ticksNumber = 0
  }
  $ruler.empty();

  Array.apply(null, new Array(ticksNumber)).forEach((item, i) => {
    let $tick = $('<div class="tick"></div>');
    let index = i - Math.round(ticksNumber/2);
    if(index%10 === 0) {
      $tick.addClass('major');
      $tick.append(`<span>${Math.abs(index)}</span>`);
    } else if(index % 5 === 0) {
      $tick.addClass('semi');
    }
    // else {
    //   $tick.addClass('minor')
    // }
    if(direction === 'horizontal') {
      $tick.css({
        left: index * n * scale + size/2
      });
    } else if (direction === 'vertical') {
      $tick.css({
        top: index * n * scale + size/2
      });
    }

    $ruler.append($tick);
  });
}

class ScaleRuler extends React.Component {

  componentWillReceiveProps(nextProps){
    // console.log(nextProps)
    drawTicks($('.ruler.horizontal'), 5, 'horizontal',nextProps.scale, nextProps.portraitLayout.width);
    drawTicks($('.ruler.vertical'), 5, 'vertical',nextProps.scale, nextProps.portraitLayout.height);
  }

  render(){
    let translateInfo = JSON.parse(localStorage.getItem('translateInfo'));
    if(!translateInfo){
      translateInfo = {x:0,y:0}
    }
    let horizontalStyle = {
      width: `${this.props.portraitLayout.width*this.props.scale}px`,
      left: `${(translateInfo.x-105) * this.props.scale}px`,
    }
    let verticalStyle = {
      height:`${this.props.portraitLayout.height*this.props.scale}px`,
      top: `${(translateInfo.y-30) * this.props.scale}px`
    }
    return (
      <div className="ruler_wrapper" style={{visibility:`${this.props.show ? 'visible' : 'hidden'}`}}>
        <div className="ruler horizontal" style={horizontalStyle}>
        </div>
        <div className="ruler vertical" style={verticalStyle}>
        </div>
      </div>
    )
  }
}

export default ScaleRuler;