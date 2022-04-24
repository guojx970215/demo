import React from 'react'
import { connect } from 'react-redux'
import {
  actAddComposeTemplateList,
  actAddElement,
  actAddTemplateList,
  actElementPaneToggle,
  actShowComposeTemplateList,
  actShowTemplateList,
  copyElement,
  deleteElement
} from '../../store/bookPages/actions'
import api from '../../api/bookApi'
import styles from './AudioMenu.module.css'
import IconButton from '../MenuItems/IconButton'
import TextboxIcon from '../../icons/TextboxIcon'
import TableIcon from '../../icons/TableIcon'
import ModalForm from './components/ModalForm'
import ModalList from './components/ModalList'
import Audio_AllMusic from './Audio_AllMusic.png'
import Audio_BackgroundMusic from './Audio_BackgroundMusic.png'
import Audio_Music from './Audio_Music.png'
import Audio_MyMusic from './Audio_MyMusic.png'
import Audio_ShortMusic from './Audio_ShortMusic.png'

class AudioMenu extends React.Component {
  state = {
    visible: false,
    visibleList: false,
    mediaCategory: {
      value: ''
    },
    mediaCategorys: [
      {
        name: '全部音乐',
        lang: 'allMusic',
        value: ''
      },
      {
        name: '音乐',
        lang: 'music',
        value: 0
      }, {
        name: '短音乐',
        lang: 'shortmMusic',
        value: 1
      }, {
        name: '背景音乐',
        lang: 'backgroundMusic',
        value: 2
      }, {
        name: '我的音乐',
        lang: 'myMusic',
        value: -1
      }
    ]
  }

  addElement = type => {
    return e => {
      const {dispatch} = this.props
      dispatch(actAddElement(type))
    }
  }
  copyElement = () => {
    return () => {
      const {dispatch} = this.props
      dispatch(copyElement({}))
    }
  }
  deleteElement = () => {
    const {dispatch} = this.props
    return () => {
      dispatch(deleteElement({}))
    }
  }
  elementPaneToggle = () => {
    const {dispatch} = this.props
    return () => {

      dispatch(actElementPaneToggle({}))
    }
  }
  getElementTemplates = (bookPages, page = 1, search = '') => {
    const {dispatch} = this.props
    return () => {
      if (bookPages.showTemplate) {
        dispatch(actShowTemplateList())
      } else {
        api.getElementTemplates(page, search).then(res => {
          bookPages.showComposeTemplate && dispatch(actShowComposeTemplateList())//关闭组合模板
          dispatch(actAddTemplateList(res.data.templates))
          dispatch(actShowTemplateList())
        })

      }

    }
  }

  getAudios = (mediaCategory) => {
    this.setState({
      visibleList: true,
      mediaCategory
    })
  }
  getComposeTemplates = (bookPages, page = 1, search = '') => {
    const {dispatch} = this.props
    return () => {
      if (bookPages.showComposeTemplate) {
        dispatch(actShowComposeTemplateList())
      } else {
        api.getComposeElementTemplates(page, search).then(res => {
          bookPages.showTemplate && dispatch(actShowTemplateList())// 关闭普通模板
          dispatch(actAddComposeTemplateList(res.data.templates))
          dispatch(actShowComposeTemplateList())
        })

      }
    }
  }
  showModalForm = () => {
    this.setState({
      visible: true
    })
  }
  cancalModalForm = () => {
    this.setState({
      visible: false
    })
  }

  showModalList = () => {
    this.setState({
      visibleList: true
    })
  }
  cancalModalList = () => {
    this.setState({
      visibleList: false
    })
  }
  onMediaCategory = (mediaCategory) => {
    this.setState({
      mediaCategory
    })
  }

  getImage = (index) => {
    if(index === 0) {
      return Audio_AllMusic
    }else if(index === 1) {
      return Audio_Music
    }else if(index === 2) {
      return Audio_ShortMusic
    }else if(index === 3) {
      return Audio_BackgroundMusic
    }else if(index === 4) {
      return Audio_MyMusic
    }
  }

  render () {
    const {bookPages, trans} = this.props
    const {visible = false, visibleList, mediaCategorys, mediaCategory} = this.state

    return (
      <div className={styles.eletmentsMenuPane}>
        {/*<IconButton*/}
          {/*text={trans.AudioMenu.add}*/}
          {/*onClickCallback={this.showModalForm}*/}
        {/*>*/}
          {/*<TextboxIcon width={36} height={36}/>*/}
        {/*</IconButton>*/}
        {mediaCategorys.map((item,index) => {
          return <IconButton
            key={item.value}
            text={trans.AudioMenu[item.lang]}
            onClickCallback={()=>this.getAudios(item)}>
            <img src={this.getImage(index)} style={{ width: '36px', height: 'auto' }} />
          </IconButton>
        })}

        <ModalList trans={trans} onMediaCategory={this.onMediaCategory}  onCancal={this.cancalModalList} mediaCategorys={mediaCategorys} mediaCategory={mediaCategory} visible={visibleList}></ModalList>
      </div>
    )
  }
}

export default connect(({trans, bookPages}) => ({
  trans, bookPages
}))(AudioMenu)
