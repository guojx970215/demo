import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './anidialog.css';
import 'animate.css';
import store from '../../store';
import { Provider } from 'react-redux';
import MusicCard from './musicCard';
import {
  Tabs,
  Button,
  Select,
  Checkbox,
  InputNumber,
  Icon,
  Divider,
  Collapse,
} from 'antd';
const { TabPane } = Tabs;
const { Option, OptGroup } = Select;
const { Panel } = Collapse;

let defaultState = {
  groups: [],
  elements: [],
  tabKey: 'ani',
  alertStatus: false,
  alertTip: '提示',
  aniclass: '',
  animeaning: '',
  // aniTimes: 1, // 动画次数
  // aniLoop: false, // 动画循环
  // aniDuration: 1, // 动画时长
  // aniDelay: 0, //动画延时
  rotateDeg: 0,
  duration: 1,
  isloop: false,
  showState: false,
  aniIndex: undefined,
  hideDelay: 0,
  closeDialog: function () {},
  confirmAniset: function () {},
  confirmTriset: function () {}, // 确认设定触发效果
  previewAni: function () {}, // 动画live演示
  musicList: function () {}, // 音乐列表
  lang: { AniDialog: {} },
  triggerElId: undefined,

  // trigger: undefined, // 触发方式 1:单击 2:双击
  // triggerType: undefined, // 触发效果 1:播放声音 2:播放动画 3:插入新图片
  // triggerAniName: undefined, // 触发动画名称
  // triggerAniTimes: 1, // 触发动画次数
  // triggerAniLoop: false, // 触发动画循环
  // triggerAniDuration: 1, // 触发动画时长
  // triggerAniDelay: 0, //触发动画延时

  // triggerMusicName: undefined, // 触发音乐的名称
  // triggerAudio: undefined, // 触发音乐的链接
  musicLayoutVisible: false, // 音乐列表显隐
  aniAudioVisible: false,
  chooseType: 'ani',
  // triggerPicName: undefined, // 触发图片的名称
  // triggerPicUrl: undefined // 触发图片的连接
  // triggerPicAni: undefined // 触发图片的特效
  // triggerPicW: undefined // 触发图片的长
  // triggerPicH: undefined // 触发图片的宽
  // triggerPicX: undefined // 触发图片的Left
  // triggerPicY: undefined // 触发图片的Top

  // triggerElId // 触发隐藏的元素
};

const anilist = [
  {
    label: 'Attention Seekers',
    meaning: '吸引注意',
    children: [
      { label: 'bounce', meaning: '弹跳' },
      { label: 'flash', meaning: '闪现' },
      { label: 'pulse', meaning: '脉搏' },
      { label: 'rubberBand', meaning: '橡皮筋' },
      { label: 'shake', meaning: '摇晃' },
      { label: 'swing', meaning: '摇摆' },
      { label: 'tada', meaning: '嗒哒' },
      { label: 'wobble', meaning: '晃动' },
      { label: 'jello', meaning: '果冻' },
      { label: 'heartBeat', meaning: '心跳' },
    ],
  },
  {
    label: 'Bouncing Entrances',
    meaning: '弹跳入场',
    children: [
      { label: 'bounceIn', meaning: '进场' },
      { label: 'bounceInDown', meaning: '上进场' },
      { label: 'bounceInLeft', meaning: '左进场' },
      { label: 'bounceInRight', meaning: '右进场' },
      { label: 'bounceInUp', meaning: '下进场' },
    ],
  },
  {
    label: 'Fading Entrances',
    meaning: '渐显入场',
    children: [
      { label: 'fadeIn', meaning: '入场' },
      { label: 'fadeInDown', meaning: '上入场' },
      { label: 'fadeInDownBig', meaning: '大上入场' },
      { label: 'fadeInLeft', meaning: '左入场' },
      { label: 'fadeInLeftBig', meaning: '大左入场' },
      { label: 'fadeInRight', meaning: '右入场' },
      { label: 'fadeInRightBig', meaning: '大右入场' },
      { label: 'fadeInUp', meaning: '上入场' },
      { label: 'fadeInUpBig', meaning: '大上入场' },
    ],
  },
  {
    label: 'Flippers Entrances',
    meaning: '翻转',
    children: [
      { label: 'flip', meaning: '翻转' },
      { label: 'flipInX', meaning: '垂直翻转进场' },
      { label: 'flipInY', meaning: '水平翻转进场' },
    ],
  },
  {
    label: 'Rotating Entrances',
    meaning: '旋转入场',
    children: [
      { label: 'rotateIn', meaning: '旋转入场' },
      { label: 'rotateInDownLeft', meaning: '左下旋转入场' },
      { label: 'rotateInDownRight', meaning: '右下旋转入场' },
      { label: 'rotateInUpLeft', meaning: '左上旋转入场' },
      { label: 'rotateInUpRight', meaning: '右上旋转入场' },
    ],
  },
  {
    label: 'Sliding Entrances',
    meaning: '滑动入场',
    children: [
      { label: 'slideInUp', meaning: '上滑动入场' },
      { label: 'slideInDown', meaning: '下滑动入场' },
      { label: 'slideInLeft', meaning: '左滑动入场' },
      { label: 'slideInRight', meaning: '右滑动入场' },
    ],
  },
  {
    label: 'Zoom Entrances',
    meaning: '缩放入场',
    children: [
      { label: 'zoomIn', meaning: '缩放入场' },
      { label: 'zoomInDown', meaning: '下缩放入场' },
      { label: 'zoomInLeft', meaning: '左缩放入场' },
      { label: 'zoomInRight', meaning: '右缩放入场' },
      { label: 'zoomInUp', meaning: '上缩放入场' },
    ],
  },
  {
    label: 'Specials Entrances',
    meaning: '特殊',
    children: [
      { label: 'rollIn', meaning: '翻滚入场' },
      { label: 'lightSpeedIn', meaning: '光速进场' },
      { label: 'jackInTheBox', meaning: '弹出' },
    ],
  },
];

const ExitsAni = [
  {
    label: 'Bouncing Exits',
    meaning: '弹跳出场',
    children: [
      { label: 'bounceOut', meaning: '出场' },
      { label: 'bounceOutDown', meaning: '上出场' },
      { label: 'bounceOutLeft', meaning: '左进场' },
      { label: 'bounceOutRight', meaning: '右进场' },
      { label: 'bounceOutUp', meaning: '下进场' },
    ],
  },
  {
    label: 'Flippers Exits',
    meaning: '翻转',
    children: [
      { label: 'flipOutX', meaning: '垂直翻转出场' },
      { label: 'flipOutY', meaning: '水平翻转出场' },
    ],
  },
  {
    label: 'Zoom Exits',
    meaning: '缩放出场',
    children: [
      { label: 'zoomOut', meaning: '缩放出场' },
      { label: 'zoomOutDown', meaning: '下缩放出场' },
      { label: 'zoomOutLeft', meaning: '左缩放出场' },
      { label: 'zoomOutRight', meaning: '右缩放出场' },
      { label: 'zoomOutUp', meaning: '上缩放出场' },
    ],
  },
  {
    label: 'Sliding Exits',
    meaning: '滑动出场',
    children: [
      { label: 'slideOutUp', meaning: '上滑动出场' },
      { label: 'slideOutDown', meaning: '下滑动出场' },
      { label: 'slideOutLeft', meaning: '左滑动出场' },
      { label: 'slideOutRight', meaning: '右滑动出场' },
    ],
  },
  {
    label: 'Rotating Exits',
    meaning: '旋转出场',
    children: [
      { label: 'rotateOut', meaning: '旋转出场' },
      { label: 'rotateOutDownLeft', meaning: '左下旋转出场' },
      { label: 'rotateOutDownRight', meaning: '右下旋转出场' },
      { label: 'rotateOutUpLeft', meaning: '左上旋转出场' },
      { label: 'rotateOutUpRight', meaning: '右上旋转出场' },
    ],
  },
  {
    label: 'Fading Exits',
    meaning: '渐显出场',
    children: [
      { label: 'fadeOut', meaning: '出场' },
      { label: 'fadeOutDown', meaning: '上出场' },
      { label: 'fadeOutDownBig', meaning: '大上出场' },
      { label: 'fadeOutLeft', meaning: '左出场' },
      { label: 'fadeOutLeftBig', meaning: '大左出场' },
      { label: 'fadeOutRight', meaning: '右出场' },
      { label: 'fadeOutRightBig', meaning: '大右出场' },
      { label: 'fadeOutUp', meaning: '上出场' },
      { label: 'fadeOutUpBig', meaning: '大上出场' },
    ],
  },
  {
    label: 'Specials Exits',
    meaning: '特殊',
    children: [
      { label: 'hinge', meaning: '悬挂掉落出场' },
      { label: 'rollOut', meaning: '翻滚出场' },
      { label: 'lightSpeedOut', meaning: '光速出场' },
    ],
  },
];

const AniSelect = ({ value, placeholder, onChange, exist, all }) => {
  const anis = all ? [...anilist, ...ExitsAni] : exist ? ExitsAni : anilist;

  return (
    <Select
      style={{ width: 'calc(100% - 62px)' }}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      allowClear
    >
      {anis.map((item) => (
        <OptGroup label={item.label} key={item.label}>
          {item.children.map((child) => (
            <Option value={child.label} key={child.label}>
              {placeholder === 'Please choose an animate'
                ? child.label.replace(/([A-Z])/g, ' $1').toLowerCase()
                : child.meaning}
            </Option>
          ))}
        </OptGroup>
      ))}
    </Select>
  );
};

const ElementSelect = ({
  value,
  placeholder,
  onChange,
  groups,
  elements,
  showElementOnWS,
}) => (
  <Select
    style={{ width: 'calc(100% - 62px)' }}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    allowClear
  >
    <OptGroup label="group">
      {groups.map((group) => (
        <Option value={`GroupName:${group}`} key={`GroupName:${group}`}>
          {group}
        </Option>
      ))}
    </OptGroup>

    <OptGroup label="element">
      {elements.map((value) => (
        <Option
          value={value.value}
          key={value.value}
          onMouseEnter={() => showElementOnWS(value.value, true)}
          onMouseLeave={() => showElementOnWS(value.value, false)}
        >
          {value.label}
        </Option>
      ))}
    </OptGroup>
  </Select>
);

class AniDialog extends Component {
  state = {
    ...defaultState,
  };

  // css动画组件设置为目标组件
  FirstChild = (props) => {
    const childrenArray = React.Children.toArray(props.children);
    return childrenArray[0] || undefined;
  };
  //打开弹窗
  open = (options) => {
    options = options || {};
    options.alertStatus = true;

    if (options.aniClassName) {
      let aniClassName = options.aniClassName;
      aniClassName = aniClassName.replace('animateElement ', '');
      defaultState.aniclass = aniClassName;
      delete options.aniClassName;
    }

    if (options.rotateDeg) {
      let rotateDeg = options.rotateDeg.replace('deg', '');
      rotateDeg = /^\d+$/.test(rotateDeg) ? Number(rotateDeg) : 0;
      defaultState.rotateDeg = rotateDeg;
      delete options.rotateDeg;
    }

    defaultState.lang = store.getState().trans.AniDialog;

    let stateObj = {
      ...defaultState,
      ...options,
    };

    this.setState({
      ...stateObj,
    });
  };
  //关闭弹窗
  close() {
    defaultState.rotateDeg = 0;
    defaultState.aniclass = '';
    defaultState.animeaning = '';
    this.setState({
      ...defaultState,
    });

    this.state.closeDialog();
  }

  //音乐列表
  showModal = (type) => {
    this.setState({
      musicLayoutVisible: true,
      chooseType: type,
    });
  };

  handleOk = (audio) => {
    if (this.state.chooseType === 'ani') {
      this.setState({
        musicLayoutVisible: false,
        aniAudioName: audio[0].name,
        aniAudioUrl: audio[0].url,
      });
    } else {
      this.setState({
        musicLayoutVisible: false,
        triggerMusicName: audio[0].name,
        triggerAudio: audio[0].url,
      });
    }
  };

  handleCancel = (e) => {
    this.setState({
      musicLayoutVisible: false,
    });
  };

  setAni = (value) => {
    // live animate
    this.state.previewAni({
      preAniClassName: `animateEle ${value}`,
    });

    setTimeout(() => {
      this.state.previewAni({
        preAniClassName: undefined,
      });
    }, 1000);
  };

  //设置触发动画名称
  setTriggerAniName = (value) => {
    this.setState({
      triggerAniName: value,
    });
    //live animate
    this.state.previewAni({
      preAniClassName: `animateEle ${value}`,
    });

    setTimeout(() => {
      this.state.previewAni({
        preAniClassName: undefined,
      });
    }, 3000);
  };

  setTriggerHideAni = (value) => {
    this.setState({
      triggerHideAni: value,
    });
    //live animate
    this.state.previewAni({
      preAniClassName: `animateEle ${value}`,
    });

    setTimeout(() => {
      this.state.previewAni({
        preAniClassName: undefined,
      });
    }, 3000);
  };

  setRotateDeg = (e) => {
    let deg = Number(e);
    if (deg > 360) {
      deg = deg % 360;
    }
    if (deg < -360) {
      deg = deg % -360;
    }
    deg = deg >= 0 ? deg : 360 + deg;
    this.setState({
      rotateDeg: deg,
    });
  };

  cancelSet = () => {
    if (this.state.tabKey === 'ani') {
      this.setState({
        rotateDeg: 0,
        aniTimes: 1,
        hideDelay: 0,
        aniIndex: undefined,
        aniDuration: 1,
        aniDelay: 0,
        aniLoop: false,
        aniclass: '',
        animeaning: '',
        aniAudioName: '',
        aniAudioUrl: '',
      });
    } else {
      this.setState({
        trigger: 0,
        triggerType: 0,
        triggerAniTimes: 1,
        triggerAniDelay: 0,
        triggerAniLoop: false,
        triggerAniName: '',
        triggerAniDuration: 1,
        triggerAudio: undefined,
        triggerMusicName: undefined,
        triggerMusicTimes: 1,
        triggerMusicLoop: false,
        triggerElId: undefined,
        triggerHideElId: undefined,
        triggerHideAni: '',
        triggerHideDelay: 0, // 动画持续时长 , 命名错了
        bringToFront: false,
        bringToBack: false,
      });
    }
  };

  confirmAniset = () => {
    if (!this.state.group) {
      let obj = {
        triggerAniTimes: 1,
        triggerAniDelay: 0,
        triggerAniLoop: false,
        triggerAniName: '',
        triggerAniDuration: 1,
        triggerAudio: undefined,
        triggerMusicName: undefined,
        triggerMusicTimes: 1,
        triggerMusicLoop: false,
        triggerElId: undefined,
        triggerHideElId: undefined,
        triggerHideAni: '',
        triggerHideDelay: 0, // 动画持续时长 , 命名错了
        bringToFront: false,
        bringToBack: false,
      };

      if (this.state.trigger && this.state.triggerAudio) {
        obj = {
          ...obj,
          triggerAudio: this.state.triggerAudio,
          triggerMusicName: this.state.triggerMusicName,
          triggerMusicTimes: this.state.triggerMusicTimes || 1,
          triggerMusicLoop: this.state.triggerMusicLoop || false,
        };
      }

      if (this.state.trigger && this.state.triggerAniName) {
        obj = {
          ...obj,
          triggerAniName: this.state.triggerAniName,
          triggerAniTimes: this.state.triggerAniTimes || 1,
          triggerAniLoop: this.state.triggerAniLoop || false,
          triggerAniDuration: this.state.triggerAniDuration || 1,
          triggerAniDelay: this.state.triggerAniDelay || 0,
        };
      }
      if (this.state.trigger && this.state.triggerElId) {
        obj = {
          ...obj,
          triggerElId: this.state.triggerElId,
          bringToFront: this.state.bringToFront,
        };
      }

      if (this.state.trigger && this.state.triggerHideElId) {
        obj = {
          ...obj,
          triggerHideElId: this.state.triggerHideElId,
          triggerHideAni: this.state.triggerHideAni,
          triggerHideDelay: this.state.triggerHideDelay || 1, // 动画持续时长 , 命名错了
          bringToBack: this.state.bringToBack,
        };
      }

      if (this.state.trigger) {
        // 确定触发效果,提交到redux
        this.state.confirmTriset({
          trigger: this.state.trigger,
          ...obj,
        });
      } else if (!this.state.trigger) {
        this.state.confirmTriset({
          trigger: 0,
          ...obj,
        });
      }
    }

    let confirmRotate = this.state.rotateDeg ? this.state.rotateDeg : 0;
    let aniObj = {
      rotateDeg: `${confirmRotate}deg`,
      aniClassName: `animateElement ${this.state.aniclass || ''}`,
      aniTimes: this.state.aniTimes || 1,
      aniDelay: this.state.aniDelay || 0,
      aniDuration: this.state.aniDuration || 1,
      aniLoop: this.state.aniLoop || false,
      showState: this.state.hideDelay && this.state.hideDelay > 0,
      hideDelay: this.state.hideDelay || 0,
      aniAudioName: this.state.aniAudioName || '',
      aniAudioUrl: this.state.aniAudioUrl || '',
    };
    this.state.confirmAniset(aniObj);

    this.close();
  };

  setAniDealay = (e) => {
    let anidelay = Number(e.target.value);
    anidelay = anidelay <= 0 ? 0 : anidelay;
    this.setState({
      anidelay,
    });
  };

  setAniTimes = (e) => {
    let anitimes = Number(e.target.value);
    anitimes = anitimes <= 1 ? 1 : anitimes;
    this.setState({
      anitimes,
    });
  };

  setAniDuration = (e) => {
    let duration = Number(e.target.value);
    duration = duration <= 0 ? 0 : duration;
    this.setState({
      duration,
    });
  };

  setAniLoop = (e) => {
    this.setState({
      isloop: !this.state.isloop,
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !is(fromJS(this.props), fromJS(nextProps)) ||
      !is(fromJS(this.state), fromJS(nextState))
    );
  }

  showElementOnWS = (id, show) => {
    let target = document.getElementById(id).getElementsByClassName('trigger-cover')[0];
    if (target) {
      target.style.display = show ? 'block' : 'none';
    }
  };

  render() {
    return (
      <Provider store={store}>
        <ReactCSSTransitionGroup
          component={this.FirstChild}
          transitionName="hide"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          <div
            className="anidialog"
            style={
              this.state.alertStatus
                ? { display: 'block' }
                : { display: 'none' }
            }
          >
            {this.state.alertStatus ? (
              // 只有显示的时候渲染，防止渲染不出
              <MusicCard
                visible={this.state.musicLayoutVisible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                onEffect={
                  this.state.chooseType === 'ani'
                    ? this.state.aniAudioUrl
                    : this.state.triggerAudio
                }
              />
            ) : (
              ''
            )}
            <Tabs
              defaultActiveKey="ani"
              activeKey={this.state.tabKey}
              animated={false}
              onChange={(value) => this.setState({ tabKey: value })}
            >
              <TabPane tab={this.state.lang.tab1} key="ani">
                <div className="rotateDeg trigger-list">
                  <span>{this.state.lang.rotate}:</span>
                  <InputNumber
                    type="number"
                    max={360}
                    min={0}
                    placeholder="0～360的角度值"
                    value={this.state.rotateDeg}
                    onChange={this.setRotateDeg}
                    style={{ width: 'calc(100% - 62px)' }}
                  />
                </div>

                <div className="trigger-list" style={{ marginTop: 16 }}>
                  <span>{this.state.lang.times}:</span>
                  <InputNumber
                    min={1}
                    value={this.state.aniTimes || 1}
                    style={{ width: 120, marginRight: 6 }}
                    disabled={this.state.aniLoop}
                    onChange={(value) => {
                      this.setState({ aniTimes: value });
                    }}
                  />

                  <Checkbox
                    className="trigger-loop"
                    checked={this.state.aniLoop}
                    onChange={(value) => {
                      this.setState({
                        aniLoop: value.target.checked,
                      });
                    }}
                  >
                    {this.state.lang.loop}
                  </Checkbox>
                </div>

                <div className="trigger-list">
                  <span>{this.state.lang.duration}:</span>
                  <InputNumber
                    min={0}
                    step={0.1}
                    value={this.state.aniDuration || 1}
                    onChange={(value) => {
                      this.setState({ aniDuration: value });
                    }}
                    style={{ width: 60, marginRight: 15 }}
                  />
                  {/* {this.state.lang.second} */}

                  <span>{this.state.lang.delay}:</span>
                  <InputNumber
                    min={0}
                    step={0.1}
                    value={this.state.aniDelay || 0}
                    onChange={(value) => {
                      this.setState({ aniDelay: value });
                    }}
                    style={{ width: 60 }}
                  />
                  {/* {this.state.lang.second} */}
                </div>

                <div className="trigger-list">
                  <span style={{ width: 100 }}>Hide duration : </span>

                  <InputNumber
                    min={0}
                    step={0.1}
                    value={this.state.hideDelay || 0}
                    onChange={(value) => {
                      this.setState({ hideDelay: value });
                    }}
                    style={{ width: 'calc(100% - 102px)' }}
                  />
                </div>

                <div className="trigger-list">
                  <span>{this.state.lang.animate}:</span>

                  <AniSelect
                    value={this.state.aniclass || undefined}
                    placeholder={this.state.lang.animatePlaceholder}
                    onChange={(value) => {
                      this.setState({ aniclass: value });
                      this.setAni(value);
                    }}
                    all={true}
                  ></AniSelect>
                </div>

                <div className="trigger-list">
                  <span>{this.state.lang.audio}</span>
                  <div
                    className="music-selector"
                    onClick={() => this.showModal('ani')}
                  >
                    {this.state.aniAudioName ? (
                      <>
                        {this.state.aniAudioName}
                        <span
                          className="clear-music"
                          onClick={(e) => {
                            e.stopPropagation();
                            this.setState({
                              aniAudioName: undefined,
                              aniAudioUrl: undefined,
                            });
                          }}
                        >
                          <Icon type="close-circle" theme="filled" />
                        </span>
                      </>
                    ) : (
                      <span style={{ color: '#BFBFBF' }}>
                        {this.state.lang.audioButton}
                      </span>
                    )}
                  </div>
                </div>
              </TabPane>

              {this.state.group ? (
                ''
              ) : (
                <TabPane tab={this.state.lang.tab2} key="tri">
                  <div className="trigger-list">
                    <span>{this.state.lang.trigger}</span>
                    <Select
                      placeholder={this.state.lang.triggerPlaceholder}
                      value={this.state.trigger || undefined}
                      style={{ width: 'calc(100% - 62px)' }}
                      onChange={(value) => {
                        this.setState({ trigger: value });
                      }}
                      allowClear
                    >
                      <Option value={1}>{this.state.lang.click}</Option>
                      <Option value={2}>{this.state.lang.dblclick}</Option>
                    </Select>
                  </div>

                  <Divider orientation="left">
                    {this.state.lang.playAudio}
                  </Divider>
                  <div>
                    <div className="trigger-list">
                      <span>{this.state.lang.audio}</span>
                      <div
                        className="music-selector"
                        onClick={() => this.showModal('tri')}
                      >
                        {this.state.triggerMusicName ? (
                          <>
                            {this.state.triggerMusicName}
                            <span
                              className="clear-music"
                              onClick={(e) => {
                                e.stopPropagation();
                                this.setState({
                                  triggerMusicName: undefined,
                                  triggerAudio: undefined,
                                });
                              }}
                            >
                              <Icon type="close-circle" theme="filled" />
                            </span>
                          </>
                        ) : (
                          <span style={{ color: '#BFBFBF' }}>
                            {this.state.lang.audioButton}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="trigger-list">
                      <span>{this.state.lang.times}:</span>
                      <InputNumber
                        min={0}
                        value={
                          this.state.triggerMusicTimes
                            ? this.state.triggerMusicTimes
                            : 1
                        }
                        style={{ width: 110, marginRight: 6 }}
                        disabled={this.state.triggerMusicLoop}
                        onChange={(value) => {
                          this.setState({ triggerMusicTimes: value });
                        }}
                      />

                      <Checkbox
                        className="trigger-loop"
                        checked={this.state.triggerMusicLoop}
                        onChange={(value) => {
                          this.setState({
                            triggerMusicLoop: value.target.checked,
                          });
                        }}
                      >
                        {this.state.lang.loop}
                      </Checkbox>
                    </div>
                  </div>

                  <Divider orientation="left">
                    {this.state.lang.addAnimate}
                  </Divider>
                  <div>
                    <div className="trigger-list">
                      <span>{this.state.lang.animate}:</span>

                      <AniSelect
                        value={this.state.triggerAniName || undefined}
                        placeholder={this.state.lang.animatePlaceholder}
                        onChange={this.setTriggerAniName}
                      ></AniSelect>
                    </div>

                    <div className="trigger-list">
                      <span>{this.state.lang.times}:</span>
                      <InputNumber
                        min={1}
                        value={this.state.triggerAniTimes || 1}
                        style={{ width: 120, marginRight: 6 }}
                        disabled={this.state.triggerAniLoop}
                        onChange={(value) => {
                          this.setState({ triggerAniTimes: value });
                        }}
                      />
                      <Checkbox
                        className="trigger-loop"
                        checked={this.state.triggerAniLoop}
                        onChange={(value) => {
                          this.setState({
                            triggerAniLoop: value.target.checked,
                          });
                        }}
                      >
                        {this.state.lang.loop}
                      </Checkbox>
                    </div>

                    <div className="trigger-list">
                      <span>{this.state.lang.duration}:</span>
                      <InputNumber
                        min={0}
                        step={0.1}
                        value={this.state.triggerAniDuration || 1}
                        onChange={(value) => {
                          this.setState({ triggerAniDuration: value });
                        }}
                        style={{ width: 175, marginRight: 6 }}
                      />
                      {this.state.lang.second}
                    </div>

                    <div className="trigger-list">
                      <span>{this.state.lang.delay}:</span>
                      <InputNumber
                        min={0}
                        step={0.1}
                        value={
                          this.state.triggerAniDelay
                            ? this.state.triggerAniDelay
                            : 0
                        }
                        onChange={(value) => {
                          this.setState({ triggerAniDelay: value });
                        }}
                        style={{ width: 175, marginRight: 6 }}
                      />
                      {this.state.lang.second}
                    </div>
                  </div>
                  <Divider orientation="left">
                    {this.state.lang.showElement}
                  </Divider>
                  <div className="trigger-list">
                    <span>{this.state.lang.element}:</span>

                    <ElementSelect
                      placeholder={this.state.lang.elementPH}
                      value={this.state.triggerElId || undefined}
                      onChange={(value) =>
                        this.setState({ triggerElId: value })
                      }
                      groups={this.state.groups}
                      elements={this.state.elements}
                      showElementOnWS={this.showElementOnWS}
                    ></ElementSelect>
                  </div>

                  <div className="trigger-list">
                    <span></span>
                    <Checkbox
                      style={{ width: 'calc(100% - 62px)' }}
                      checked={this.state.bringToFront}
                      onChange={(value) => {
                        this.setState({ bringToFront: value.target.checked });
                      }}
                    >
                      bring to front
                    </Checkbox>
                  </div>

                  <Divider orientation="left">
                    {this.state.lang.hideElement}
                  </Divider>
                  <div className="trigger-list">
                    <span>{this.state.lang.element}:</span>

                    <ElementSelect
                      placeholder={this.state.lang.elementPH}
                      value={this.state.triggerHideElId || undefined}
                      onChange={(value) =>
                        this.setState({ triggerHideElId: value })
                      }
                      groups={this.state.groups}
                      elements={this.state.elements}
                      showElementOnWS={this.showElementOnWS}
                    ></ElementSelect>
                  </div>

                  <div className="trigger-list">
                    <span>{this.state.lang.animate}:</span>

                    <AniSelect
                      value={this.state.triggerHideAni || undefined}
                      placeholder={this.state.lang.animatePlaceholder}
                      onChange={this.setTriggerHideAni}
                      exist={true}
                    ></AniSelect>
                  </div>

                  <div className="trigger-list">
                    <span>{this.state.lang.duration}:</span>
                    <InputNumber
                      min={0}
                      step={0.1}
                      value={this.state.triggerHideDelay || 1}
                      onChange={(value) => {
                        this.setState({ triggerHideDelay: value });
                      }}
                      style={{ width: 'calc(100% - 62px)' }}
                    />
                  </div>

                  <div className="trigger-list">
                    <span></span>
                    <Checkbox
                      style={{ width: 'calc(100% - 62px)' }}
                      checked={this.state.bringToBack}
                      onChange={(value) => {
                        this.setState({ bringToBack: value.target.checked });
                      }}
                    >
                      bring to back
                    </Checkbox>
                  </div>
                </TabPane>
              )}
            </Tabs>

            <div className="dilogfooter">
              <Button onClick={this.cancelSet.bind(this)}>
                <Icon type="retweet" />
                {this.state.lang.reset}
              </Button>

              <Button
                type="primary"
                className="confirmAniSet"
                onClick={this.confirmAniset.bind(this)}
              >
                {this.state.lang.confirm}
              </Button>

              <Button
                className="cancleSetAni"
                type="link"
                onClick={this.close.bind(this)}
              >
                {this.state.lang.cancel}
              </Button>
            </div>
          </div>
        </ReactCSSTransitionGroup>
      </Provider>
    );
  }
}

let div = document.createElement('div');
let props = {};
document.body.appendChild(div);

let Box = ReactDOM.render(React.createElement(AniDialog, props), div);

export default Box;
