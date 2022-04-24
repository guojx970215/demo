import React from 'react';

import ElementEditIcon from '../../icons/ElementEditIcon';
import AniBtnIcon from '../../icons/AnibtnIcon';

import './ElementNav.css';

// function getAniContent(options) {
//   let anilist = [
//     {
//       aniclass: 'bounce',
//       meaning: '弹跳'
//     },
//     {
//       aniclass: 'flash',
//       meaning: '闪动'
//     },
//     {
//       aniclass: 'pulse',
//       meaning: '脉冲'
//     },
//     {
//       aniclass: 'rubberBand',
//       meaning: '橡皮筋'
//     },
//     {
//       aniclass: 'shake',
//       meaning: '抖动'
//     },
//     {
//       aniclass: 'swing',
//       meaning: '摇摆'
//     },
//     {
//       aniclass: 'wobble',
//       meaning: '摇晃'
//     },
//     {
//       aniclass: 'jello',
//       meaning: '果冻'
//     },
//     {
//       aniclass: 'bounceInDown',
//       meaning: '上进场'
//     },
//     {
//       aniclass: 'bounceInLeft',
//       meaning: '左进场'
//     },
//     {
//       aniclass: 'bounceInRight',
//       meaning: '右进场'
//     },
//     {
//       aniclass: 'bounceInUp',
//       meaning: '下进场'
//     },
//     {
//       aniclass: 'bounceOutDown',
//       meaning: '下退场'
//     },
//     {
//       aniclass: 'bounceOutLeft',
//       meaning: '左退场'
//     },
//     {
//       aniclass: 'bounceOutRight',
//       meaning: '右退场'
//     },
//     {
//       aniclass: 'bounceOutUp',
//       meaning: '上退场'
//     },
//     {
//       aniclass: 'rotateInDownLeft',
//       meaning: '旋转进场'
//     },
//     {
//       aniclass: 'rotateInDownRight',
//       meaning: '旋转进场'
//     },
//     {
//       aniclass: 'rotateInUpLeft',
//       meaning: '旋转进场'
//     },
//     {
//       aniclass: 'rotateInUpRight',
//       meaning: '旋转进场'
//     },
//     {
//       aniclass: 'rotateOutDownLeft',
//       meaning: '旋转退场'
//     },
//     {
//       aniclass: 'rotateOutDownRight',
//       meaning: '旋转退场'
//     },
//     {
//       aniclass: 'rotateOutUpLeft',
//       meaning: '旋转退场'
//     },
//     {
//       aniclass: 'rotateOutUpRight',
//       meaning: '旋转退场'
//     }
//   ];
//   let outputAni = {};
//   // if (options.aniClassName) {
//   //   let aniClassName = options.aniClassName;
//   //   aniClassName = aniClassName.replace('animateElement ', '');
//   //   let ani = anilist.find(item => item.aniclass === aniClassName);
//   //   if (ani) {
//   //     outputAni.meaning = ani.meaning;
//   //   }
//   // }
//   // if (options.rotateDeg) {
//   //   let rotateDeg = options.rotateDeg.replace('deg', '');
//   //   rotateDeg = /^\d+$/.test(rotateDeg) ? Number(rotateDeg) : 0;
//   //   outputAni.rotateDeg = rotateDeg;
//   // }
//   return {
//     ...outputAni,
//     ...options
//   };
// }
const ElementNav = props => {
  const {
    focus,
    elementNavClickCallBack,
    openAniSet
    // showElementAni,
    // isShowAniContent,
    // aniContent
  } = props;
  // let contentObj = getAniContent(aniContent);
  return (
    <div className="navBox">
      <div
        onClick={event => {
          //event.preventDefault();
          //event.stopPropagation();
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
          elementNavClickCallBack();
        }}
        className="navList"
        style={{ display: focus ? 'block' : 'none', backgroundColor: '#fff' }}
      >
        <div>
          <ElementEditIcon width={36} height={36} />
        </div>
      </div>
      <div
        onClick={event => {
          //event.preventDefault();
          //event.stopPropagation();
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
          openAniSet();
        }}
        className="navList"
        style={{ display: focus ? 'block' : 'none', backgroundColor: '#fff' }}
      >
        <div
        // onMouseEnter={() => {
        //   showElementAni(true);
        // }}
        // onMouseLeave={() => showElementAni(false)}
        >
          <AniBtnIcon />
          {/* <div
            className="aniContent"
            style={{
              display:
                isShowAniContent &&
                (aniContent.aniClassName || aniContent.rotateDeg)
                  ? 'block'
                  : 'none'
            }}
          >
            {contentObj.meaning?`动画:${contentObj.meaning},`:''}
            {contentObj.duration?`执行${contentObj.duration}s,`:''}
            {contentObj.anidelay?`延时${contentObj.anidelay}s,`:''}
            {contentObj.anitimes === 'infinite'
              ? '循环播放'
              : `执行${contentObj.anitimes}次`}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ElementNav;
