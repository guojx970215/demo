
import React from "react";
import { connect } from "react-redux";
import {
  Input,
  InputNumber,
  Button
} from 'antd';
import "./ThemePanel.css";
import { reSetColor, addPureColor, setColor, deleteColor } from "../../store/userColor/userColor";
import { actSetPageColor } from "../../store/bookPages/actions";
import { SketchPicker, ChromePicker } from 'react-color'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import img from './addcolor.png'
import deleteImg from './delete.png'
import colorbak from './colorbak.png'
import { cancel } from "redux-saga/effects";

class ThemePanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      navIndex: 0,
      color: {},
      textareaValue: '',
      isDelete: false,
      showGradientPanel: false,
      displayColorPicker: false,
      navList: ['', ''],
      colorStyle: {
        backgroundColor: 'none'
      },
      bakStyle: {
        background: `url(${img}) no-repeat center center`,
      },
      colors: ['', '', ''],
      angle: 0,
      backgroundImage: '',
      pickerVisible: false,
      colorIndex: 0
    }
    ThemePanel._this = this;
  }
  handleClick = () => {
    if (this.state.navIndex == 0) {
      this.setState({ displayColorPicker: !this.state.displayColorPicker, isDelete: false })
    } else {
      this.setState({
        showGradientPanel: !this.state.showGradientPanel,
        isDelete: false,
        colors: ['', '', ''],
        angle: 0,
        backgroundImage: ''
      })
    }
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  cancel = (e) => {
    this.setState({ showGradientPanel: false, textareaValue: '' })
  }

  handleChange = (color) => {
    this.setState({
      color: color.rgb,
      colorStyle: {
        backgroundColor: `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`
      },
      bakStyle: {
        background: `url(${colorbak})`,
      }

    })
  };

  handleClickNav(index, e) {
    this.setState({
      navIndex: index,
      displayColorPicker: false,
      showGradientPanel: false,
      isDelete: false,
      colorStyle: {
        backgroundColor: 'transparent'
      },
      bakStyle: {
        background: `url(${img}) no-repeat center center`,
      }
    })
  }

  deleteClick(e) {
    this.setState({
      isDelete: !this.state.isDelete
    })
  }

  handleTextareaChange(e) {
    this.setState({
      textareaValue: e.target.value
    })

  }

  setColorGrent = (color) => {
    // console.log('setColorGrent', color)
    let colors = this.state.colors
    let index = this.state.colorIndex
    // 透明度为 1
    let a = 0xff
    // 当前选择度透明度
    let b = parseInt(a * color.rgb.a)
    // 将当前值转为16进制度
    let bStr = b.toString(16)
    colors[index] = color.hex + bStr

    // colors[index] = JSON.stringify(color.rgb)

    this.setState({
      colors: colors
    })
    this.setBackgroundImage()
  }
  setAngle = (number) => {
    // console.log('setAngle', number)
    this.setState({
      angle: number
    })
    this.setBackgroundImage()
  }
  setBackgroundImage () {
    let backgroundImage = `linear-gradient(${this.state.angle}deg`
    let colors = this.state.colors
    for (let i = 0; i < colors.length; i++) {
      let color = colors[i]
      if (!color) {
        continue
      }
      backgroundImage = backgroundImage + ',' + color
    }
    backgroundImage = backgroundImage + ')'
    this.setState({
      backgroundImage: backgroundImage
    })
  }
  // 切换颜色选择框的显示隐藏
  setPickerVisible = (value, colorIndex) => {
    console.log('切换颜色选择框的显示隐藏', value, colorIndex)
    this.setState({
      pickerVisible: value,
      colorIndex: colorIndex
    })
  }

  changeHandler(colors) {
    // dispatch(addPureColor(colors));
  }
  onClose(val) {

  }
  render() {
    const { backgroundImage, colors, angle, pickerVisible } = this.state
    const { isAll, text, onClickCallback, addPureColor, reSetColor, setColor, deleteColor, theme, bookPages } = this.props
    const { Theme } = this.props.trans
    const { showPanel, displayColorPicker, pureColorList, graduatedColorList, selectColor } = this.props.userColor

    let localPureColorList = [];
    let localGraduatedColorList = [];
    let colorStyle = {};

    if(isAll) {
      if(bookPages.present.config && bookPages.present.config.color) {
        colorStyle = bookPages.present.config.color.type == 0 ? {
          backgroundColor: bookPages.present.config.color.color
        } : {
            'background': `${bookPages.present.config.color.color}`
          }
      }
    }else {
      let currentPage = bookPages.present.pages.find(item => {
        return item.id === bookPages.showingPageId;
      });
      if (currentPage.config && currentPage.config.color) {
        colorStyle = currentPage.config.color.type == 0 ? {
          backgroundColor: currentPage.config.color.color
        } : {
            'background': `${currentPage.config.color.color}`
          }
      }
    }
    if (localStorage.getItem('pureColorList')) {
      localPureColorList = JSON.parse(localStorage.getItem('pureColorList'))
    }
    if (localStorage.getItem('graduatedColorList')) {
      localGraduatedColorList = JSON.parse(localStorage.getItem('graduatedColorList'))
    }
    return (
      <div className="stdMenuItemOuter">
        <div className="stdMenuItem">
          <div className="stdMenuItemButton" onClick={onClickCallback}>
            <span className="stdMenuIcon ThemeIcon"><span className="ThemeIconChild" style={colorStyle}></span></span>
            <span style={{position:'relative','top':'5px'}}>{text}</span>
          </div>
          <div className="ThemePanelBox">
            <div className="ThemePanel" style={{ display: showPanel ? 'block' : 'none',left:'180px' }}>
              <div className="NavList">
                <ul>
                  {
                    this.state.navList.map((item, index) => {
                      return (
                        <li className={this.state.navIndex === index ? 'active' : ''} key={index} onClick={(e) => this.handleClickNav(index, e)}>
                          {index == 0 ? Theme.menupure : Theme.menugradients}
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
              <div className="ColorTips">{Theme.logintips}</div>
              <ColorHtml colorList={this.state.navIndex == 0 ? localPureColorList.length ? localPureColorList : pureColorList : localGraduatedColorList.length ? localGraduatedColorList : graduatedColorList} Theme={Theme} isDelete={this.state.isDelete} navIndex={this.state.navIndex} clickCallback={setColor} deleteCallback={deleteColor} isAll={isAll}/>
              <div className="ActionArea">
                <span onClick={(e) => this.deleteClick(e)}>{this.state.isDelete ? Theme.cancel : Theme.deletetxt}</span>
                <span onClick={(e) => reSetColor(this.state.navIndex, Theme)}>{Theme.resetcolor}</span>
                <span className="rc-color-picker-wrap" style={this.state.bakStyle} onClick={this.handleClick}>
                  <span className="SelectColor" style={this.state.colorStyle}></span>
                </span>
                {this.state.displayColorPicker ?
                  <div className="SketchPicker">
                    <SketchPicker color={this.state.color} onChange={this.handleChange} />
                    <div className="FixedBottom"><span onClick={(e) => addPureColor(this.state.navIndex, this.state.color, Theme)}>{Theme.addcolor}</span><Button onClick={(e) => setColor(this.state.navIndex, this.state.color, true, isAll)}>{Theme.usecolor}</Button></div>
                  </div> : null}
              </div>
              <div className="GradientPanel" style={{ display: this.state.showGradientPanel ? 'block' : 'none' }}>
                <a href="http://www.baidu.com" target="_blank">{Theme.tutorial}</a>
                {/* <textarea className="TxtBox" value={this.state.textareaValue} onChange={(e) => this.handleTextareaChange(e)} /> */}
                <div className="set-item">
                  <span className="name">颜色</span>
                  <div className="value">
                    <span
                      className="value-item-text"
                      onClick={() => {this.setPickerVisible(true, 0)}}>
                      {colors[0] ? colors[0] : '选择颜色'}
                    </span>
                    <span
                      className="value-item-text"
                      onClick={() => {this.setPickerVisible(true, 1)}}>
                      {colors[0] ? colors[1] : '选择颜色'}
                    </span>
                    <span
                      className="value-item-text"
                      onClick={() => {this.setPickerVisible(true, 2)}}>
                      {colors[0] ? colors[2] : '选择颜色'}
                    </span>
                    <div
                      className="color-picker"
                      style={{ display: pickerVisible ? 'block' : 'none' }}>
                      <ChromePicker
                        color={this.state.colors[this.state.colorIndex]}
                        onChange={this.setColorGrent}/>
                      <span
                        style={{ margin: '8px 16px', width: 196 }}
                        onClick={() => {this.setPickerVisible(false)}}>
                        关闭
                      </span>
                    </div>
                  </div>
                </div>
                <div className="set-item">
                  <span className="name">角度</span>
                  <div className="value">
                    <InputNumber className="value-item"
                      value={angle}
                      onChange={(e) => {this.setAngle(e)}} />
                    <span className="value-item" style={{textAlign: 'left'}}>deg</span>
                  </div>
                </div>
                <div className="set-item">
                  <span className="name">预览</span>
                  <div className="value">
                    <span className="preview-item"
                      style={{backgroundImage: backgroundImage}}></span>
                  </div>
                </div>
                <div>
                  <Button type="primary" onClick={(e) => addPureColor(this.state.navIndex, this.state.backgroundImage, Theme)}>{Theme.ok}</Button>&nbsp;
                  <Button type="primary" onClick={(e) => this.cancel(e)}>{Theme.cancel}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

const ColorHtml = (props) => {
  let { colorList, navIndex, clickCallback, deleteCallback, isDelete, Theme,isAll } = props
  return (
    <ul className="ColorList">
      {
        colorList.length && colorList.map((item, index) => {
          let style = navIndex == 0 ? {
            'backgroundColor': item
          } : {
              'background': `${item}`
            }
          return (
            <li className="ColorItem" key={index}>
              <img src={deleteImg} style={{ display: isDelete ? 'block' : 'none' }} onClick={(e) => deleteCallback(navIndex, index, Theme)} />
              <span className="ColorCircleBox" onClick={(e) => clickCallback(navIndex, item,false,isAll)}>
                <span className="ColorCircle" style={style}></span>
              </span>
            </li>
          )
        })
      }
    </ul>
  )
}

const mapStateToProps = ({ trans, userColor, bookPages }) => ({
  trans,
  userColor,
  bookPages
})


const mapDispatchToProps = dispatch => ({
  addPureColor: (index, colors, Theme) => {
    if (index == 0) {
      ThemePanel._this.setState({
        displayColorPicker: false,
        colorStyle: {
          backgroundColor: 'transparent'
        },
        bakStyle: {
          background: `url(${img}) no-repeat center center`,
        }
      })
      dispatch(addPureColor(colors));
    } else {
      if (colors == '') {
        alert(Theme.entertips)
        return
      } else if (colors.indexOf("linear-gradient") === -1) {
        alert(Theme.entertipserror)
        ThemePanel._this.setState({
          textareaValue: ''
        })
        return;
      }
      dispatch(addPureColor(colors));
      ThemePanel._this.setState({
        textareaValue: '',
        showGradientPanel: false,
      })
    }
  },
  reSetColor: (type, Theme) => {
    ThemePanel._this.setState({
      isDelete: false
    })
    confirmAlert({
      title: Theme.tips,
      message: Theme.resettips,
      buttons: [
        {
          label: Theme.yes,
          onClick: () => {
            dispatch(reSetColor(type));
          }
        },
        {
          label: Theme.no,
          onClick: () => {

          }
        }
      ]
    });
  },
  setColor: (type, color, isUse, isAll) => {
    if (isUse) {
      ThemePanel._this.setState({
        displayColorPicker: false,
        showGradientPanel: false,
        colorStyle: {
          backgroundColor: 'transparent'
        },
        bakStyle: {
          background: `url(${img}) no-repeat center center`,
        }
      })
    }
    dispatch(actSetPageColor(
      {
        color: isUse ? `rgba(${color.r},${color.g},${color.b},${color.a})` : color,
        type
      },
      isAll
    ));
    dispatch(setColor(
      {
        type,
        color: isUse ? `rgba(${color.r},${color.g},${color.b},${color.a})` : color
      }
  ));

  },
  deleteColor: (type, index, Theme) => {
    confirmAlert({
      title: Theme.tips,
      message: Theme.deletetips,
      buttons: [
        {
          label: Theme.yes,
          onClick: () => {
            ThemePanel._this.setState({
              isDelete: false
            })
            dispatch(deleteColor({
              type,
              index
            }));
          }
        },
        {
          label: Theme.no,
          onClick: () => {
          }
        }
      ]
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemePanel);
