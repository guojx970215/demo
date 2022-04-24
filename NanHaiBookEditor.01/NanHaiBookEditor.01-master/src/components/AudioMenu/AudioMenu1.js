import React, { useState } from 'react'
import { connect } from 'react-redux'
import styles from './AudioMenu.module.css'
import TextboxIcon from '../../icons/TextboxIcon'
import TableIcon from '../../icons/TableIcon'
import {
  actAddComposeTemplateList,
  actAddElement,
  actAddTemplateList,
  actElementPaneToggle,
  actShowAudioList,
  actShowComposeTemplateList,
  actShowTemplateList,
  copyElement,
  deleteElement,
} from '../../store/bookPages/actions'
import { ElementTypes } from '../../constants'
import IconButton from '../MenuItems/IconButton'

import api from '../../api/bookApi'
import ModalForm from './components/ModalForm'
import ModalList from './components/ModalList'

const AudioMenu1 = ({trans, bookPages, addElement, copyElement, deleteElement, elementPaneToggle, getElementTemplates, getComposeTemplates, getAudios}) => {
  const [state, setState] = useState({
    visible: false
  })

  const showModalForm = () => {
    setState({
      visible: true
    })
  }
  const cancalModalForm = () => {
    setState({
      visible: false
    })
  }
  return (
    <div className={styles.eletmentsMenuPane}>
      <IconButton
        text={trans.AudioMenu.add}
        onClickCallback={showModalForm}
      >
        <TextboxIcon width={36} height={36}/>
      </IconButton>
      <IconButton
        text={trans.AudioMenu.music}
        onClickCallback={getAudios(bookPages, 1)}
      >
        <TableIcon width={36} height={36}/>
      </IconButton>
      <ModalForm onCancal={cancalModalForm} visible={state.visible}></ModalForm>
      <ModalList></ModalList>

    </div>
  )
}

const mapStateToProps = ({trans, bookPages}) => ({
  trans,
  bookPages
})

const mapDispatchToProps = dispatch => ({
  addElement: type => {
    return e => {
      dispatch(actAddElement(type))
    }
  },
  copyElement: () => {
    return () => {
      dispatch(copyElement({}))
    }
  },
  deleteElement: () => {
    return () => {
      dispatch(deleteElement({}))
    }
  },
  elementPaneToggle: () => {
    return () => {

      dispatch(actElementPaneToggle({}))
    }
  },
  getElementTemplates: (bookPages, page = 1, search = '') => {
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
  },

  getAudios: (bookPages, page = 1, search = '') => {
    return () => {
      console.log(bookPages)
      if (bookPages.showAudio) {
        dispatch(actShowAudioList())
      } else {
        api.getMediaAudios(page, search).then(res => {
          console.log(res)
          // bookPages.showAudio && dispatch(actShowTemplateList())// 关闭普通模板
          // dispatch(actAddComposeTemplateList(res.data.templates));
          dispatch(actShowAudioList())
        })

      }
    }
  },
  getComposeTemplates: (bookPages, page = 1, search = '') => {
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
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioMenu1)
