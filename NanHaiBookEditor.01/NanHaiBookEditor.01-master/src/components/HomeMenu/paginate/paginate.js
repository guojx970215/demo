import React from 'react'
import domtoimage from 'dom-to-image-more';
import styles from './paginate.module.css'
import { ChromePicker } from 'react-color';
import bold_icon from './bold.png'
import italic_icon from './italic.png'
import { Select, Modal, message, Button, InputNumber, Input, Switch } from 'antd'
const { Option } = Select

class Paginate extends React.Component {
  state = {
    modalTitle:"插入页码",
    width: 730,
    paginatShow: false,
    familyList: [
      {
        ch: '宋体',
        en: '宋体, SimSun'
      }, 
      {
        ch: '微软雅黑',
        en: '微软雅黑, "Microsoft YaHei"'
      }, 
      {
        ch: '楷体',
        en: '楷体, 楷体_GB2312, SimKai'
      },
      {
        ch: '黑体',
        en: '黑体, SimHei'
      },
      {
        ch: '隶书',
        en: '隶书, SimLi'
      },
      {
        ch: 'andale mono',
        en: 'andale mono'
      },
      {
        ch: 'arial',
        en: 'arial, helvetica, sans-serif'
      },
      {
        ch: 'arial black',
        en: '"arial black", "avant garde"'
      },
      {
        ch: 'comic sans ms',
        en: 'comic sans ms'
      },
      {
        ch: 'impact',
        en: 'impact, chicago'
      },
      {
        ch: 'times new roman',
        en: 'times new roman'
      }
    ],
    fontFamily: 'arial',
    fontSizeList: [12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72],
    fontSize: 14,
    color: '#000000',
    isBold: false,
    isItalic: false,
    pickerVisible: false,
    positionType: '',
    positionAlign: '',
    position: {
      align: '',
      header: '',
      bottom: ''
    },
    margin: {
      left: 80,
      right: 80,
      top: 40,
      bottom: 40
    },
    isLineMouseDown: false,
    isItemMouseDown: false,
    startX: 0,
    startY: 0,
    movePosition: 'left',
    thumb: '',
    // 第几页开始插入页码
    insertPage: 1,
    pageContent: '',
    currPage: 1
  }
  componentDidMount () {
    this.props.onRef(this)
  }
  init () {
    let { currPage, pageContent } = this.state
    let { showingPageId, present } = this.props.bookPages
    let paginate = present.paginate
    for (let i = 0; i < present.pages.length; i++) {
      let page = present.pages[i]
      if (page.id === showingPageId) {
        currPage = i + 1
        pageContent = page.pageContent
        // console.log('pageContentpageContent', pageContent, page)
      }
    }
    // console.log('paginate init', this.props)
    if (paginate && paginate.paginatShow) {
      document.querySelectorAll('.paginatcenter')[0].style.display = 'none'
      document.querySelectorAll('.paginatcenter')[1].style.display = 'none'
    }
    const workSpaceDom = document.getElementById('workspaceBox');
    // let workspaceContStyle = workSpaceDom.style.transform
    // workSpaceDom.style.transform = ''
    domtoimage
      .toPng(workSpaceDom, {
        scale: 0.6
      })
      .then(dataUrl => {
        // console.log('domtoimagedomtoimagedomtoimage', dataUrl)
        this.setState({
          thumb: dataUrl
        })
        if (paginate && paginate.paginatShow) {
          document.querySelectorAll('.paginatcenter')[0].style.display = 'block'
          document.querySelectorAll('.paginatcenter')[1].style.display = 'block'
        }
        // workSpaceDom.style.transform = workspaceContStyle
      });
    if (paginate) {
      this.setState({
        paginatShow: paginate.paginatShow,
        fontSize: paginate.fontSize,
        color: paginate.color,
        position: paginate.position,
        margin: paginate.margin,
        fontFamily: paginate.fontFamily,
        isBold: paginate.isBold,
        isItalic: paginate.isItalic,
        insertPage: paginate.insertPage,
        pageContent: pageContent,
        currPage: currPage
      })
    } else {
      this.setState({
        paginatShow: false,
        fontSize: 14,
        color: '#000000',
        position: {
          align: '',
          header: '',
          bottom: ''
        },
        margin: {
          left: 80,
          right: 80,
          top: 40,
          bottom: 40
        },
        fontFamily: 'arial',
        isBold: false,
        isItalic: false,
        insertPage: 1,
        pageContent: '',
        currPage: currPage
      })
    }
  }
  // 控制页码显示/隐藏
  togglePaginatShow = () => {
    let paginatShow = this.state.paginatShow
    this.setState({
      paginatShow: !paginatShow
    })
    // console.log('控制页码显示', this.state)
  }
  // 切换颜色选择框的显示隐藏
  setPickerVisible = (value) => {
    // console.log('切换颜色选择框的显示隐藏', value)
    this.setState({
      pickerVisible: value
    })
  }
  familyChange = (value) => {
    // console.log('familyChange', value)
    this.setState({
      fontFamily: value
    })
  }
  // 设置字体大小
  setFontSize = (value) => {
    // console.log('设置字体大小', value)
    this.setState({
      fontSize: value
    })
  }
  setFontBold = () => {
    let isBold = this.state.isBold
    this.setState({
      isBold: !isBold
    })
  }
  setFontItalic = () => {
    let isItalic = this.state.isItalic
    this.setState({
      isItalic: !isItalic
    })
  }
  // 设置颜色
  setColor = (color) => {
    // console.log('设置颜色', color)
    this.setState({
      color: color.hex
    })
  }
  // 设置margin
  setMargin = (number, value) => {
    // console.log('设置margin', number, value)
    let margin = this.state.margin
    margin[value] = Math.round(number * 80)
    this.setState({
      margin: margin
    })
  }
  setPosition = (e, type, align) => {
    let position = this.state.position
    // console.log('setPosition', type, position[type])
    if (align !== position.align || !position[type]) {
      return false
    }
    position[type] = e.target.value
    this.setState({
      position: position
    })
  }
  // 位置框获得焦点
  positionFocus = (e, type, align) => {
    // console.log('位置框获得焦点', type, align)
    this.setState({
      positionType: type,
      positionAlign: align
    })
  }
  // 插入页码
  insertPageNumber = (event) => {
    // console.log('插入页码', event)
    let position = this.state.position
    let positionType = this.state.positionType
    let positionAlign = this.state.positionAlign
    if (!positionType) {
      return false
    }
    position.header = ''
    position.bottom = ''
    position[positionType] = '<<1>>'
    position.align = positionAlign
    this.setState({
      position: position,
      positionType: '',
      positionAlign: '',
      insertPage: this.state.currPage,
      pageContent: '1'
    })
  }
  // 从当前页插入
  insertFromCurrentPage = () => {
    // console.log('从当前页插入')
    this.setState({
      pageContent: '1',
      insertPage: this.state.currPage
    })
  }
  handleOk = e => {
    const {paginatShow, fontSize, color, position, margin, fontFamily, isBold, isItalic, insertPage} = this.state
    this.props.setPaginate({
      paginatShow: paginatShow,
      fontSize: fontSize,
      color: color,
      position: position,
      margin: margin,
      fontFamily: fontFamily,
      isItalic: isItalic,
      isBold: isBold,
      insertPage: insertPage
    })
    this.handleCancel()
  }
  handleCancel = e => {
    this.props.handleCancel()
  };

  reviewLineMove = (e, position) => {
    console.log('reviewLineMove', e.clientX, e.clientY)
    this.setState({
      startX: e.clientX,
      startY: e.clientY,
      movePosition: position,
      isLineMouseDown: true
    })
  }
  previewMove = (e) => {
    let { isLineMouseDown, startX, startY, margin, movePosition } = this.state;
    if (isLineMouseDown) {
      let nx = e.clientX - startX;
      let ny = e.clientY - startY;
      if (movePosition === 'left') {
        margin[movePosition] = Number(margin[movePosition]) + nx
      } else if (movePosition === 'right') {
        margin[movePosition] = Number(margin[movePosition]) - nx
      } else if (movePosition === 'top') {
        margin[movePosition] = Number(margin[movePosition]) + ny
      } else if (movePosition === 'bottom') {
        margin[movePosition] = Number(margin[movePosition]) - ny
      }
      this.setState({
        startX: e.clientX,
        startY: e.clientY,
        margin: margin
      })
      console.log('previewMove', nx, margin[movePosition], e.clientX, movePosition)
    }
  }
  previewMoseUp =(e) => {
    let { isLineMouseDown, margin, movePosition } = this.state;
    if (isLineMouseDown) {
      let diff = margin[movePosition];
      // diff = ((diff / 80).toFixed(1)) * 80
      margin[movePosition] = diff
      this.setState({
        isLineMouseDown: false,
        margin: margin
      })
    }
  }

  render () {
    const { modalTitle, width, paginatShow, fontFamily, familyList, fontSize, fontSizeList, color, pickerVisible, margin, position, thumb, pageContent, isBold, isItalic } = this.state
    const {visible, trans, bookPages} = this.props
    this.props.onRef(this)
    return (
      <Modal
        title={modalTitle}
        visible={visible}
        width={width}
        onOk={this.handleOk}
        onCancel={this.handleCancel}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>show/hide</legend>
          <Switch
            checked={paginatShow}
            onChange={this.togglePaginatShow} />
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>font</legend>
          <div className={styles.fontMain}>
            <div className={styles.fontItem}>
              <span className={styles.fontName}>family: </span>
              <Select style={{width: 140}} className={styles.fontValue} value={fontFamily} onChange={this.familyChange}>
                {
                  familyList.map((ele, index) => (
                    <Option key={index} value={ele.en}>{ele.ch}</Option>
                  ))
                }
              </Select>
            </div>
            <div className={styles.fontItem}>
              <span className={styles.fontName}>size: </span>
              <Select className={styles.fontValue} value={fontSize} onChange={this.setFontSize}>
                {
                  fontSizeList.map((ele, index) => (
                    <Option key={index} value={ele}>{ele}</Option>
                  ))
                }
              </Select>
            </div>
            <div className={styles.fontItem}>
              <span className={styles.fontName}>color: </span>
              <Button
                className={styles.fontValue}
                style={{ width: 110, color: color ? color : '#8e8e8e' }}
                onClick={() => {this.setPickerVisible(true)}}>
                {color ? color : '选择颜色'}
              </Button>
              <div
                className="color-picker"
                style={{ display: pickerVisible ? 'block' : 'none' }}>
                <ChromePicker
                  color={color}
                  onChange={this.setColor}/>
                <Button
                  style={{ margin: '8px 16px', width: 196 }}
                  onClick={() => {this.setPickerVisible(false)}}>
                  关闭
                </Button>
              </div>
            </div>
            <div className={styles.fontItem}>
              <span className={styles.fontIcon}
                style={{
                  backgroundColor: isBold ? '#a8a8a8' : '#ffffff'
                }}
                onClick={() => {this.setFontBold()}}>
                <img src={bold_icon} />
              </span>
              <span className={styles.fontIcon}
                style={{
                  backgroundColor: isItalic ? '#a8a8a8' : '#ffffff'
                }}
                onClick={() => {this.setFontItalic(true)}}>
                <img src={italic_icon} />
              </span>
            </div>
          </div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Margin</legend>
          <div className={styles.fontMain}>
            <div className={styles.marginItem}>
              <span className={styles.fontName}>top: </span>
              <InputNumber value={margin.top / 80} type="number" className={styles.fontValue}
                step="0.1"
                min={0}
                onChange={(e) => {this.setMargin(e, 'top')}} />
            </div>
            <div className={styles.marginItem}>
              <span className={styles.fontName}>left: </span>
              <InputNumber value={margin.left / 80} type="number" className={styles.fontValue}
                step="0.1"
                min={0}
                onChange={(e) => {this.setMargin(e, 'left')}} />
            </div>
            <div className={styles.marginItem}>
              <span className={styles.fontName}>bottom: </span>
              <InputNumber value={margin.bottom / 80} type="number" className={styles.fontValue}
                step="0.1"
                min={0}
                onChange={(e) => {this.setMargin(e, 'bottom')}} />
            </div>
            <div className={styles.marginItem}>
              <span className={styles.fontName}>right: </span>
              <InputNumber value={margin.right / 80} type="number" className={styles.fontValue}
                step="0.1"
                min={0}
                onChange={(e) => {this.setMargin(e, 'right')}} />
            </div>
          </div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>position</legend>
          <h2 className={styles.positionTitle}>header</h2>
          <div className={styles.fontMain}>
            <div className={styles.positionItem}>
              <span className={styles.positionName}>left: </span>
              <Input
                value={position.header.length > 0 && position.align === 'left' ? pageContent : ''}
                className={styles.positionValue}
                onChange={(e) => {this.setPosition(e, 'header', 'left')}}
                onFocus={(e) => {this.positionFocus(e, 'header', 'left')}} />
            </div>
            <div className={styles.positionItem}>
              <span className={styles.positionName}>center: </span>
              <Input
                value={position.header.length > 0 && position.align === 'center' ? pageContent : ''}
                className={styles.positionValue}
                onChange={(e) => {this.setPosition(e, 'header', 'center')}}
                onFocus={(e) => {this.positionFocus(e, 'header', 'center')}} />
            </div>
            <div className={styles.positionItem}>
              <span className={styles.positionName}>right: </span>
              <Input
                value={position.header.length > 0 && position.align === 'right' ? pageContent : ''}
                className={styles.positionValue}
                onChange={(e) => {this.setPosition(e, 'header', 'right')}}
                onFocus={(e) => {this.positionFocus(e, 'header', 'right')}} />
            </div>
          </div>
          <h2 className={styles.positionTitle}>bottom</h2>
          <div className={styles.fontMain}>
            <div className={styles.positionItem}>
              <span className={styles.positionName}>left: </span>
              <Input
                value={position.bottom && position.align === 'left' ? pageContent : ''}
                className={styles.positionValue}
                onChange={(e) => {this.setPosition(e, 'bottom', 'left')}}
                onFocus={(e) => {this.positionFocus(e, 'bottom', 'left')}} />
            </div>
            <div className={styles.positionItem}>
              <span className={styles.positionName}>center: </span>
              <Input
                value={position.bottom && position.align === 'center' ? pageContent : ''}
                className={styles.positionValue}
                onChange={(e) => {this.setPosition(e, 'bottom', 'center')}}
                onFocus={(e) => {this.positionFocus(e, 'bottom', 'center')}} />
            </div>
            <div className={styles.positionItem}>
              <span className={styles.positionName}>right: </span>
              <Input
                value={position.bottom && position.align === 'right' ? pageContent : ''}
                className={styles.positionValue}
                onChange={(e) => {this.setPosition(e, 'bottom', 'right')}}
                onFocus={(e) => {this.positionFocus(e, 'bottom', 'right')}} />
            </div>
          </div>
          <Button size="small"
            className={styles.insertBtn}
            onClick={this.insertPageNumber}>Insert Page Number</Button>
          <Button size="small"
            className={styles.insertBtn}
            onClick={this.insertFromCurrentPage}>Insert from current page</Button>
        </fieldset>
        <fieldset className={styles.fieldset}
          onMouseMove={this.previewMove}
          onMouseUp={this.previewMoseUp}>
          <legend className={styles.legend}>预览</legend>
          <div className={styles.reviewMain}
            style={{
              background: `url(${thumb}) top left`
            }}>
            <div className={styles.previewItem}
              style={{height: margin.top}}>
              <div className={styles.left}
                style={{width: margin.left}}></div>
              <div className={styles.reviewLine}
                onMouseDown={(e) => this.reviewLineMove(e, 'left')}></div>
              <div className={styles.center}
                style={{textAlign: position.align}}></div>
              <div className={styles.reviewLine}
                onMouseDown={(e) => this.reviewLineMove(e, 'right')}></div>
              <div className={styles.right}
                style={{width: margin.right}}></div>
            </div>
            <div className={styles.reviewItemLine}
              onMouseDown={(e) => this.reviewLineMove(e, 'top')}></div>
            <div className={styles.previewItem}
              style={{height: 80 - margin.top}}>
              <div className={styles.left}
                style={{width: margin.left}}></div>
              <div className={styles.reviewLine}
                onMouseDown={(e) => this.reviewLineMove(e, 'left')}></div>
              <div className={styles.center}
                style={{
                  textAlign: position.align,
                  fontSize: fontSize ? fontSize + 'px' : '14px',
                  fontFamily: fontFamily,
                  color: color ? color : '#000000',
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal'
                }}>{position.header ? pageContent : ''}</div>
              <div className={styles.reviewLine}
                onMouseDown={(e) => this.reviewLineMove(e, 'right')}></div>
              <div className={styles.right}
                style={{width: margin.right}}></div>
            </div>
          </div>
          <div className={styles.reviewMain}
              style={{
                background: `url(${thumb}) bottom left`
              }}>
              <div className={styles.previewItem}
                style={{height: 80 - margin.bottom}}>
                <div className={styles.left}
                  style={{width: margin.left}}></div>
                <div className={styles.reviewLine}
                onMouseDown={(e) => this.reviewLineMove(e, 'left')}></div>
                <div className={styles.center}
                  style={{textAlign: 'center'}}></div>
                <div className={styles.reviewLine}
                onMouseDown={(e) => this.reviewLineMove(e, 'right')}></div>
                <div className={styles.right}
                  style={{width: margin.right}}></div>
            </div>
            <div className={styles.reviewItemLine}
              onMouseDown={(e) => this.reviewLineMove(e, 'bottom')}></div>
            <div className={styles.previewItem}
              style={{height: margin.bottom}}>
              <div className={styles.left}
                style={{width: margin.left}}></div>
              <div className={styles.reviewLine}
                onMouseDown={(e) => this.reviewLineMove(e, 'left')}></div>
              <div className={styles.center}
                style={{
                  textAlign: position.align,
                  fontSize: fontSize ? fontSize + 'px' : '14px',
                  fontFamily: fontFamily,
                  color: color ? color : '#000000',
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal'
                }}>{position.bottom ? pageContent : ''}</div>
              <div className={styles.reviewLine}
                onMouseDown={(e) => this.reviewLineMove(e, 'right')}></div>
              <div className={styles.right}
                style={{width: margin.right}}></div>
            </div>
          </div>
        </fieldset>
      </Modal>
    )
  }
}

export default Paginate
