import React, { useEffect, useState, useRef } from 'react';
import './NewRnd.css';
import { Tag, Icon, Row, Col } from 'antd';
import { config } from 'react-transition-group';

const $ = window.$;

const NewRnd = (props) => {
  const [initialState, setInitialState] = useState(true);
  const [size, setSize] = useState(props.size || { width: 100, height: 100 });
  const position = props.position || { x: 0, y: 0 };
  const [rotate, setRotate] = useState(props.rotate || 0);
  const dragGrid = props.dragGrid; // 拖拽范围

  //drag and drop
  const [startPosition, setStartPosition] = useState('start'); // 开始位置
  const [translate, setTranslate] = useState({ x: 0, y: 0 }); // 用于拖拽时未更新到element config时的显示
  const [scale, setScale] = useState(0); // 图片类型的拖拽 比例锁

  const { element } = props;
  useEffect(() => {
    if (
      (props.size.width !== size.width || props.size.height !== size.height) &&
      !window.isStartDrag
    ) {
      setSize(props.size);
    }
  }, [props.size]);

  // 判断是否为pic
  useEffect(() => {
    setInitialState(false);
    if (element && element.type === 'ImageBox') {
      let imgDiv = document.createElement('div');
      imgDiv.innerHTML = element.content[0].value;
      let src = imgDiv.getElementsByTagName('img');
      if (src[0]) {
        let image = new Image();
        image.src = src[0].getAttribute('src');
        image.onload = () => {
          setScale((image.width / image.height).toFixed(2));
        };
      }
    } else {
      setScale(0);
    }
  }, []);

  useEffect(() => {
    if (props.disabled) {
      window.removeEventListener('mousemove', dragContainer);
      window.removeEventListener('mouseup', stopDragContainer);
    }
  }, [props.disabled]);

  useEffect(() => {
    if (initialState) return;
    if (startPosition === 'start') return;

    if (!startPosition) {
      // 停止拖拽
      if (props.onDragStop) {
          props.onDragStop({
            x: position.x + translate.x,
            y: position.y + translate.y,
          });
        
        setTranslate({ x: 0, y: 0 });
      }
      props.setFocus && props.setFocus(false);
      return;
    }
    window.addEventListener('mousemove', dragContainer);
    window.addEventListener('mouseup', stopDragContainer);

    if (props.setFocus) {
      props.setFocus(true);
    }

    return () => {
      window.removeEventListener('mousemove', dragContainer);
      window.removeEventListener('mouseup', stopDragContainer);
    };
  }, [startPosition]);

  const starDragContainer = (e) => {
    window.isMoved = false;
    if (props.disabled) return;
    setStartPosition({ x: e.pageX, y: e.pageY });
    e.stopPropagation();
    if (element && !element.config.select) {
      props.selectElement();
    } else if (props.grouped) {
      props.selectElement();
    }
  };

  const dragContainer = (e) => {
    if (props.disabled) return;

    e.preventDefault();
    window.isMoved = true;
    let width = size.width;
    let height = size.height;
    if (rotate) {
      height =
        size.height * Math.cos((Math.PI * rotate) / 180) +
        size.width * Math.sin((Math.PI * rotate) / 180);
      width =
        size.width * Math.cos((Math.PI * rotate) / 180) +
        size.height * Math.sin((Math.PI * rotate) / 180);

      width = Number.parseFloat(width).toFixed(1);
      height = Number.parseFloat(height).toFixed(1);
    }

    let x = translate.x + e.pageX - startPosition.x;
    let y = translate.y + e.pageY - startPosition.y;
    if (dragGrid) {
      if (x + position.x - width / 2 + size.width / 2 < 0) {
        x = 0 - position.x + width / 2 - size.width / 2;
      }
      if (y + position.y - height / 2 + size.height / 2 < 0) {
        y = 0 - position.y + height / 2 - size.height / 2;
      }
      if (x + position.x > dragGrid.x - width / 2 - size.width / 2) {
        x = dragGrid.x - position.x - width / 2 - size.width / 2;
      }
      if (y + position.y > dragGrid.y - height / 2 - size.height / 2) {
        y = dragGrid.y - position.y - height / 2 - size.height / 2;
      }
    }
    setTranslate({
      x: x,
      y: y,
    });
  };

  const stopDragContainer = (e) => {
    if (!window.isMoved) {
      window.isMoved = false;
    }
    e.preventDefault();
    window.removeEventListener('mousemove', dragContainer);
    window.removeEventListener('mouseup', stopDragContainer);
    setStartPosition(undefined);
  };

  //rotate
  const [startRotateP, setStartRotateP] = useState(undefined);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (initialState) return;
    if (!startRotateP) {
      if (props.onRotateStop) {
        props.onRotateStop(rotate);
      }
      props.setFocus && props.setFocus(false);
      return;
    }
    window.addEventListener('mousemove', dragRotate);
    window.addEventListener('mouseup', stopDragRotate);

    return () => {
      window.removeEventListener('mousemove', dragRotate);
      window.removeEventListener('mouseup', stopDragRotate);
    };
  }, [startRotateP]);

  useEffect(() => {
    setRotate(props.rotate);
  }, [props.rotate]);

  const starDragRotate = (e) => {
    if (props.disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setStartRotateP({ x: e.pageX, y: e.pageY });
    setShowTip(true);
    props.setFocus && props.setFocus(true);
  };

  const dragRotate = (e) => {
    e.preventDefault();
    const centerPoint = [
      position.x + translate.x + size.width / 2,
      position.y + translate.y + size.height / 2,
    ];
    const left = document
      .getElementById('CurrentWorkSpace')
      .getBoundingClientRect().left;
    const top = document
      .getElementById('CurrentWorkSpace')
      .getBoundingClientRect().top;
    const x = e.pageX - left - centerPoint[0];
    const y = e.pageY - top - centerPoint[1];
    if (y === 0 && x > 0) {
      setRotate(90);
      return;
    } else if (y === 0 && x < 0) {
      setRotate(270);
      return;
    } else if (x === 0 && y >= 0) {
      setRotate(180);
      return;
    } else if (x === 0 && y < 0) {
      setRotate(0);
      return;
    }
    const deg = Math.ceil(Math.atan(x / y) * (180 / Math.PI));

    if ((x > 0 && y > 0) || (x < 0 && y > 0)) {
      setRotate(180 - deg);
    } else if (x > 0 && y < 0) {
      setRotate(-deg);
    } else if (x < 0 && y < 0) {
      setRotate(360 - deg);
    }
  };

  const stopDragRotate = (e) => {
    e.preventDefault();
    window.removeEventListener('mousemove', dragRotate);
    window.removeEventListener('mouseup', stopDragRotate);
    setStartRotateP(undefined);
    setShowTip(false);
  };

  //resize
  const [handelName, setHandleName] = useState(undefined); // 拖拽的handle的名称
  const [startResizeP, setStartResizeP] = useState(undefined); // 初始拖拽位置

  useEffect(() => {
    if (initialState) return;
    if (!handelName && !startResizeP) {
      if (props.onResizeStop && !window.isStartDrag) {
        props.onResizeStop({ width: size.width, height: size.height });
      }

      if (props.onDragStop) {
        props.onDragStop({
          x: position.x + translate.x,
          y: position.y + translate.y,
        });
        setTranslate({ x: 0, y: 0 });
      }
      props.setFocus && props.setFocus(false);
      return;
    }
    if (!startResizeP || !handelName) return;
    if (handelName === 'left') {
      window.isStartDrag = true;
      window.addEventListener('mousemove', dragLeft);
      window.addEventListener('mouseup', stopDragLeft);

      return () => {
        window.removeEventListener('mousemove', dragLeft);
        window.removeEventListener('mouseup', stopDragLeft);
      };
    } else if (handelName === 'right') {
      window.isStartDrag = true;
      window.addEventListener('mousemove', dragRight);
      window.addEventListener('mouseup', stopDragRight);

      return () => {
        window.removeEventListener('mousemove', dragRight);
        window.removeEventListener('mouseup', stopDragRight);
      };
    } else if (handelName === 'top') {
      window.isStartDrag = true;
      window.addEventListener('mousemove', dragTop);
      window.addEventListener('mouseup', stopDragTop);

      return () => {
        window.removeEventListener('mousemove', dragTop);
        window.removeEventListener('mouseup', stopDragTop);
      };
    } else if (handelName === 'bottom') {
      window.isStartDrag = true;
      window.addEventListener('mousemove', dragBottom);
      window.addEventListener('mouseup', stopDragBottom);

      return () => {
        window.removeEventListener('mousemove', dragBottom);
        window.removeEventListener('mouseup', stopDragBottom);
      };
    } else if (handelName === 'topLeft') {
      window.isStartDrag = true;
      window.addEventListener('mousemove', dragTopLeft);
      window.addEventListener('mouseup', stopDragTopLeft);

      return () => {
        window.removeEventListener('mousemove', dragTopLeft);
        window.removeEventListener('mouseup', stopDragTopLeft);
      };
    } else if (handelName === 'bottomLeft') {
      window.isStartDrag = true;
      window.addEventListener('mousemove', dragBottomLeft);
      window.addEventListener('mouseup', stopDragBottomLeft);

      return () => {
        window.removeEventListener('mousemove', dragBottomLeft);
        window.removeEventListener('mouseup', stopDragBottomLeft);
      };
    } else if (handelName === 'topRight') {
      window.isStartDrag = true;
      window.addEventListener('mousemove', dragTopRight);
      window.addEventListener('mouseup', stopDragTopRight);

      return () => {
        window.removeEventListener('mousemove', dragTopRight);
        window.removeEventListener('mouseup', stopDragTopRight);
      };
    } else if (handelName === 'bottomRight') {
      window.isStartDrag = true;
      window.addEventListener('mousemove', dragBottomRight);
      window.addEventListener('mouseup', stopDragBottomRight);

      return () => {
        window.removeEventListener('mousemove', dragBottomRight);
        window.removeEventListener('mouseup', stopDragBottomRight);
      };
    }
  }, [startResizeP, handelName]);

  const startDragHandle = (e, name) => {
    e.stopPropagation();
    if (element && !element.config.select) {
      props.selectElement();
    }
    setStartResizeP({ x: e.pageX, y: e.pageY });
    setHandleName(name);

    props.setFocus && props.setFocus(true);
  };

  //drag left
  const dragLeft = (e) => {
    e.preventDefault();

    let width = size.width - e.pageX + startResizeP.x;
    let x = translate.x + e.pageX - startResizeP.x;

    // 判断左边是否出边框
    if (x + position.x < 0) {
      x = -position.x;
      width = size.width + position.x;
    }
    width = width < 0 ? 0 : width;
    setSize({
      width: width,
      height: size.height,
    });

    setTranslate({ x: x, y: translate.y });
  };

  const stopDragLeft = (e) => {
    e.preventDefault();
    window.isStartDrag = false;
    window.removeEventListener('mousemove', dragLeft);
    window.removeEventListener('mouseup', stopDragLeft);
    setStartResizeP(undefined);
    setHandleName(undefined);
  };

  // drag right
  const dragRight = (e) => {
    e.preventDefault();

    let width = size.width + e.pageX - startResizeP.x;

    // 判断右边是否出围栏
    if (width + position.x > dragGrid.x) {
      width = props.dragGrid.x - position.x;
    }

    width = width < 0 ? 0 : width;
    setSize({
      width: width,
      height: size.height,
    });
  };

  const stopDragRight = (e) => {
    e.preventDefault();
    window.isStartDrag = false;
    window.removeEventListener('mousemove', dragRight);
    window.removeEventListener('mouseup', stopDragRight);
    setStartResizeP(undefined);
    setHandleName(undefined);
  };

  // drag top
  const dragTop = (e) => {
    e.preventDefault();

    let height = size.height - e.pageY + startResizeP.y;
    let y = translate.y + e.pageY - startResizeP.y;

    // 判断顶边是否出围栏
    if (y + position.y < 0) {
      y = -position.y;
      height = size.height + position.y;
    }

    height = height < 0 ? 0 : height;
    setSize({
      width: size.width,
      height: height,
    });

    setTranslate({ x: translate.x, y: y });
  };

  const stopDragTop = (e) => {
    e.preventDefault();
    window.isStartDrag = false;
    window.removeEventListener('mousemove', dragTop);
    window.removeEventListener('mouseup', stopDragTop);
    setStartResizeP(undefined);
    setHandleName(undefined);
  };

  // drag bottom
  const dragBottom = (e) => {
    e.preventDefault();

    let height = size.height + e.pageY - startResizeP.y;

    // 判断底边是否出围栏
    if (height + position.y > dragGrid.y) {
      height = dragGrid.y - position.y;
    }

    height = height < 0 ? 0 : height;
    setSize({
      width: size.width,
      height: height,
    });
  };

  const stopDragBottom = (e) => {
    e.preventDefault();
    window.isStartDrag = false;
    window.removeEventListener('mousemove', dragBottom);
    window.removeEventListener('mouseup', stopDragBottom);
    setStartResizeP(undefined);
    setHandleName(undefined);
  };

  //drag Top Left
  const dragTopLeft = (e) => {
    e.preventDefault();

    let height = size.height - e.pageY + startResizeP.y;
    let width = size.width - e.pageX + startResizeP.x;
    let x = translate.x + e.pageX - startResizeP.x;
    let y = translate.y + e.pageY - startResizeP.y;

    // 判断顶边是否出围栏
    if (y + position.y < 0) {
      y = -position.y;
      height = size.height + position.y;
    }

    if (scale !== 0) {
      width = height * scale;
      width = parseInt(width);
      x = translate.x - width + size.width;
    }

    // 判断左边是否出边框
    if (x + position.x < 0) {
      x = -position.x;
      width = size.width + position.x;
      if (scale !== 0) {
        height = width / scale;
        height = parseInt(height);
        y = translate.y - height + size.height;
      }
    }

    height = height < 0 ? 0 : height;
    width = width < 0 ? 0 : width;
    setSize({
      width: width,
      height: height,
    });

    setTranslate({
      x: x,
      y: y,
    });
  };

  const stopDragTopLeft = (e) => {
    e.preventDefault();
    window.isStartDrag = false;
    window.removeEventListener('mousemove', dragTopLeft);
    window.removeEventListener('mouseup', stopDragTopLeft);
    setHandleName(undefined);
    setStartResizeP(undefined);
  };

  //drag Bottom Left
  const dragBottomLeft = (e) => {
    e.preventDefault();

    let height = size.height + e.pageY - startResizeP.y;
    let width = size.width - e.pageX + startResizeP.x;
    let x = translate.x + e.pageX - startResizeP.x;

    // 判断左边是否出边框
    if (x + position.x < 0) {
      x = -position.x;
      width = size.width + position.x;
    }

    if (scale !== 0) {
      height = width / scale;
      height = parseInt(height);
    }

    // 判断底边是否出围栏
    if (height + position.y > dragGrid.y) {
      height = dragGrid.y - position.y;
      if (scale !== 0) {
        width = height * scale;
        width = parseInt(width);
        x = translate.x - width + size.width;
      }
    }

    height = height < 0 ? 0 : height;
    width = width < 0 ? 0 : width;
    setSize({
      width: width,
      height: height,
    });

    setTranslate({
      x: x,
      y: translate.y,
    });
  };

  const stopDragBottomLeft = (e) => {
    e.preventDefault();
    window.isStartDrag = false;
    window.removeEventListener('mousemove', dragBottomLeft);
    window.removeEventListener('mouseup', stopDragBottomLeft);
    setStartResizeP(undefined);
    setHandleName(undefined);
  };

  //drag Top Right
  const dragTopRight = (e) => {
    e.preventDefault();

    let height = size.height - e.pageY + startResizeP.y;
    let width = size.width + e.pageX - startResizeP.x;
    let y = translate.y + e.pageY - startResizeP.y;

    // 判断顶边是否出围栏
    if (y + position.y < 0) {
      y = -position.y;
      height = size.height + position.y;
    }

    if (scale !== 0) {
      width = height * scale;
      width = parseInt(width);
    }

    // 判断右边是否出围栏
    if (width + position.x > dragGrid.x) {
      width = props.dragGrid.x - position.x;
      if (scale !== 0) {
        height = width / scale;
        height = parseInt(height);
        y = translate.y - height + size.height;
      }
    }

    height = height < 0 ? 0 : height;
    width = width < 0 ? 0 : width;
    setSize({
      width: width,
      height: height,
    });

    setTranslate({
      x: translate.x,
      y: y,
    });
  };

  const stopDragTopRight = (e) => {
    e.preventDefault();
    window.isStartDrag = false;
    window.removeEventListener('mousemove', dragTopRight);
    window.removeEventListener('mouseup', stopDragTopRight);
    setStartResizeP(undefined);
    setHandleName(undefined);
  };

  //drag Bottom Right
  const dragBottomRight = (e) => {
    e.preventDefault();

    let height = size.height + e.pageY - startResizeP.y;
    let width = size.width + e.pageX - startResizeP.x;
    // 判断右边是否出围栏
    if (width + position.x > dragGrid.x) {
      width = props.dragGrid.x - position.x;
    }
    if (scale !== 0) {
      height = width / scale;
      height = parseInt(height);
    }
    // 判断底边是否出围栏
    if (height + position.y > dragGrid.y) {
      height = dragGrid.y - position.y;
      if (scale !== 0) {
        width = height * scale;
        width = parseInt(width);
      }
    }

    height = height < 0 ? 0 : height;
    width = width < 0 ? 0 : width;

    setSize({
      width: width,
      height: height,
    });

    setTranslate({
      x: translate.x,
      y: translate.y,
    });
  };

  const stopDragBottomRight = (e) => {
    e.preventDefault();
    window.isStartDrag = false;
    window.removeEventListener('mousemove', dragBottomRight);
    window.removeEventListener('mouseup', stopDragBottomRight);
    setStartResizeP(undefined);
    setHandleName(undefined);
  };

  const styleProp = props.style;

  return (
    <div
      id="new-rnd-container"
      className={`new-rnd-container ${props.show ? '' : 'hide'}`}
      onMouseDown={starDragContainer}
      onContextMenu={(e) => {
        e.preventDefault();
        props.contextMenu();
      }}
      style={{
        width: size.width,
        height: size.height,
        left: props.translate
          ? position.x - (props.translate.x || 0)
          : position.x,
        top: props.translate
          ? position.y - (props.translate.y || 0)
          : position.y,
        transform: `translate(${translate.x}px,${translate.y}px) rotate(${rotate}deg)`,
        zIndex: props.onSelect ? 9 : 'auto',
        pointerEvents: props.translate ? 'none' : 'auto',
        ...styleProp,
      }}
    >
      <div
        className={`new-rnd-inner-container ${props.innerClass || ''}`}
        style={{ ...props.innerStyle }}
      >
        {props.children}
      </div>
      {showTip ? (
        <Tag
          color="#2db7f5"
          className="new-rnd-rotate-tag"
          style={{
            transform: `translate(-50%, -50%) rotate(${-rotate}deg)`,
            zIndex: 100,
          }}
        >
          {rotate} deg
        </Tag>
      ) : (
        ''
      )}
      <div
        style={{
          display:
            props.disabled ||
            props.hideHandle ||
            !props.onSelect ||
            props.translate
              ? 'none'
              : 'block',
        }}
      >
        <div
          id="new-rnd-left-handle"
          className="new-rnd-handle-style-a"
          onMouseDown={(e) => startDragHandle(e, 'left')}
        ></div>
        <div
          id="new-rnd-right-handle"
          className="new-rnd-handle-style-a"
          onMouseDown={(e) => startDragHandle(e, 'right')}
        ></div>
        <div
          id="new-rnd-top-handle"
          className="new-rnd-handle-style-b"
          onMouseDown={(e) => startDragHandle(e, 'top')}
        ></div>
        <div
          id="new-rnd-bottom-handle"
          className="new-rnd-handle-style-b"
          onMouseDown={(e) => startDragHandle(e, 'bottom')}
        ></div>
        <div
          id="new-rnd-left-top-handle"
          className="new-rnd-handle-style-c"
          onMouseDown={(e) => startDragHandle(e, 'topLeft')}
        ></div>
        <div
          id="new-rnd-right-top-handle"
          className="new-rnd-handle-style-c"
          onMouseDown={(e) => startDragHandle(e, 'topRight')}
        ></div>
        <div
          id="new-rnd-left-bottom-handle"
          className="new-rnd-handle-style-c"
          onMouseDown={(e) => startDragHandle(e, 'bottomLeft')}
        ></div>
        <div
          id="new-rnd-right-bottom-handle"
          className="new-rnd-handle-style-c"
          onMouseDown={(e) => startDragHandle(e, 'bottomRight')}
        ></div>

        <div id="new-rnd-rotate-handle" onMouseDown={starDragRotate}>
          <Icon type="reload" />
        </div>
      </div>
      <div
        className={`new-rnd-container-hover${
          props.highlight ? ' highlight' : ''
        }`}
      ></div>
      <div
        className="move-tooltip"
        style={{
          opacity:
            (startPosition && startPosition !== 'start') || handelName
              ? '1'
              : '0',
        }}
      >
        <Row>
          <Col span={12}>X: {position.x + translate.x}</Col>
          <Col span={12}>Y: {position.y + translate.y}</Col>
        </Row>
        <Row>
          <Col span={12}>W: {size.width}</Col>
          <Col span={12}>H: {size.height}</Col>
        </Row>
      </div>
      {props.grouped && (
        <div
          className="group-selected"
          style={{ display: props.onSelect ? 'block' : 'none' }}
        ></div>
      )}
    </div>
  );
};

export default NewRnd;
