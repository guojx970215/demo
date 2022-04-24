import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './ElementStyle.css';
import { InputNumber, Icon, message } from 'antd';
import {
  actSetElementPosition,
  actSetGroupStyle,
  actSetGroupAni,
  actSetGroupTri,
} from '../../store/bookPages/actions';

const GroupStyle = (props) => {
  const {
    bookPages,
    actSetElementPosition,
    actSetGroupStyle,
    actSetGroupAni,
    actSetGroupTri,
    ui,
  } = props;
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    if (
      bookPages.selectElementId &&
      bookPages.selectElementId.includes('group:')
    ) {
      const left = [],
        top = [];
      const groupName = bookPages.selectElementId.replace('group:', '');
      setName(groupName);
      let currentPage = bookPages.present.pages.find(
        (value) => value.id === bookPages.showingPageId
      );

      currentPage.elements.forEach((element) => {
        if (element.config.groupName === groupName) {
          left.push(element.config.x);
          top.push(element.config.y);
        }
      });

      let newX = Math.min(...left);
      let newY = Math.min(...top);

      if (x !== newX) setX(newX);
      if (y !== newY) setY(newY);
    }

    return () => {
      setName('');
    };
  }, [bookPages.selectElementId, bookPages.showingPageId, bookPages.present]);

  const pasteStyle = () => {
    if (ui.copyStyle) {
      actSetGroupStyle(ui.copyStyle, name);
      message.success('Paste style successfully!');
    }
  };

  const pasteAni = () => {
    if (ui.copyAni) {
      actSetGroupAni({ ...ui.copyAni }, name);

      const config = { ...props.ui.copyTri };
      delete config.showingPageId;
      delete config.originalId;
      delete config.originalGroupId;

      const originalId = props.ui.copyTri.originalId;
      const isSamePage =
        props.ui.copyTri.showingPageId === props.bookPages.showingPageId;

      // 被触发元素是self，复制后也是self。
      // 被触发元素和目标不是同一个page不复制。
      if (originalId === config.triggerElId) {
        config.triggerElId = 'paste self';
      } else if (!isSamePage) {
        delete config.triggerElId;
      }

      if (originalId === config.triggerHideElId) {
        config.triggerHideElId = 'paste self';
      } else if (!isSamePage) {
        delete config.triggerHideElId;
      }

      actSetGroupTri(config, name);
      message.success('Paste style successfully!');
    }
  };

  return (
    <div
      className="element-style-panel"
      style={{
        transform: props.showThumb ? 'translateX(254px)' : 'translateX(0)',
        display: name ? 'block' : 'none',
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <div>
        <span>x:</span>

        <InputNumber
          precision={0}
          style={{ width: 60 }}
          value={x}
          onChange={(value) => {
            value = value || 0;
            actSetElementPosition({ x: parseInt(value) - x, y: 0, name });
            setX(parseInt(value));
          }}
        />

        <span>y:</span>

        <InputNumber
          precision={0}
          style={{ width: 60 }}
          value={y}
          onChange={(value) => {
            value = value || 0;
            actSetElementPosition({ x: 0, y: parseInt(value) - y, name });
            setY(parseInt(value));
          }}
        />

        <span>style: </span>

        <Icon
          type="diff"
          style={{
            cursor: ui.copyStyle ? 'pointer' : 'not-allowed',
            marginLeft: 8,
            color: ui.copyStyle ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.3)',
          }}
          onClick={pasteStyle}
        />

        <span>ani: </span>

        <Icon
          type="diff"
          style={{
            cursor: ui.copyAni ? 'pointer' : 'not-allowed',
            marginLeft: 8,
            color: ui.copyAni ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.3)',
          }}
          onClick={pasteAni}
        />
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actSetElementPosition: (position) => {
    dispatch(actSetElementPosition(position));
  },
  actSetGroupStyle: (style, name) => {
    dispatch(actSetGroupStyle(style, name));
  },
  actSetGroupAni: (ani, name) => {
    dispatch(actSetGroupAni(ani, name));
  },
  actSetGroupTri: (tri, name) => {
    dispatch(actSetGroupTri(tri, name));
  },
});

const mapStateToProps = ({ bookPages, ui }) => ({
  bookPages,
  ui,
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupStyle);
