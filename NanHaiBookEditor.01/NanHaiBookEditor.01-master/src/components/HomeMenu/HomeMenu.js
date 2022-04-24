import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './HomeMenu.module.css';
import './dropdown_style.css';
import Dropdown from 'react-dropdown';
import nanoid from 'nanoid';
//import "react-dropdown/style.css";
import { actLoadTrans, loadLanguage } from '../../i18n';
import TextUploadForm from '../TextUpload/TextUploadForm';
import Paginate from './paginate/paginate';
import paginate_icon from './paginate.png';
import PageIcon from '../../icons/PageIcon';
import IconButton from '../MenuItems/IconButton';
import ThemePanel from '../ThemePanel/ThemePanel';
import FontControl from '../FontControl/FontControl';
import TurnPageChoose from './TurnPageChoose'
import {
  actRemoveImage,
  actInsertUploadedText,
  actAddElement,
  actSetPaginate,
  actSetPageTurn
} from '../../store/bookPages/actions';
import { showPanel } from '../../store/userColor/userColor';
import { actSetImage, actSetDialog } from '../../store/imageList/imageList';
import api from '../../api/bookApi';
import { message, Spin, Modal, Button } from 'antd';
import Home_AddText from './Home_AddText.png';
import Home_Background from './Home_Background.png';
import Home_Download from './Home_Download.png';
import Home_exportpdf from './exportpdf.png';
import Home_Import from './Home_Import.png';
import Home_Logout from './Home_Logout.png';
import Home_PhotoGallery from './Home_PhotoGallery.png';
import Home_Review from './Home_Review.png';
import Home_Save from './Home_Save.png';
import Home_ThemeColor from './Home_ThemeColor.png';
import Home_TurnPage from './Home_TurnPage.png';
import Interactive_TextUpload from './Interactive_TextUpload.png';
import Audio_BackgroundMusic from '../PageMenu/Audio_BackgroundMusic.png';
import { showMusicDialog, showMusicPanel } from '../../store/music/music';

const { confirm } = Modal;

const options = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' }
];

const arrowClosed = <span className="arrow-closed" />;
const arrowOpen = <span className="arrow-open" />;

const languageSelector = (onchangeHandler, currentLang) => {
  let defaultValue = options.find(item => item.value === currentLang);
  return (
    <Dropdown
      arrowClosed={arrowClosed}
      arrowOpen={arrowOpen}
      options={options}
      value={defaultValue}
      onChange={onchangeHandler}
    />
  );
};

const HomeMenu = ({
  trans,
  bookPages,
  actInsertUploadedText,
  switchLang,
  actImports,
  actAddtxt,
  showPanel,
  actSetMusic,
  actSetImage,
  actSetDialog,
  actRemoveImage,
  actSavePage,
  addElement,
  setPaginate,
  showMusicPanel,
  setPageTurn
}) => {
  let { present } = bookPages;
  const [state, setState] = useState({
    loading: false,
    visible: false,
    action: 0,
    modalTitle: '',
    width: '50%',
    editRecord: {},
    paginateShow: false,
    showTurnPageModal:false,
    child: null,
    exportPdfChild: null
  });
  let { loading } = state;

  const showUploadModal = () => {
    setState({
      visible: true,
      action: 0,
      modalTitle: 'Upload Text'
    });
  };

  const handleCancel = e => {
    // console.log(e);
    setState({
      visible: false
    });
  };

  const showPaginatModal = () => {
    state.child.init();
    setState({
      paginateShow: true
    });
  };
  const cancelPaginate = e => {
    setState({
      paginateShow: false
    });
  };

  const bookName =
    localStorage.getItem('book') &&
    JSON.parse(localStorage.getItem('book')).bookName;

  const [bookname, setBookName] = useState(bookName);
  const [show, setShow] = useState(false);

  const setOpen = () => {
    setShow(true);
    const bookName =
      localStorage.getItem('book') &&
      JSON.parse(localStorage.getItem('book')).bookName;
    setBookName(bookName);
  };

  const setClose = () => {
    setShow(false);
  };

  const actSave = (bookPages, bookname) => {
    actSavePage(bookPages, bookname);
    setTimeout(() => {
      let book = JSON.parse(localStorage.getItem('book'));
      book.bookName = bookname;
      localStorage.setItem('book', JSON.stringify(book));
      setClose();
    }, 500);
  };

  const download = () => {
    if (!localStorage.getItem('book')) {
      message.warning('请先保存工程');
      return;
    }
    let bookId = JSON.parse(localStorage.getItem('book')).id;
    setState({
      loading: true
    });
    api.download(bookId).then(res => {
      if (res.state) {
        setState({
          loading: false
        });
        window.location.href = res.msg;
      } else {
        setState({
          loading: false
        });
        message.error(res.message);
      }
    });
  };

  const exportPdf = (bookPages) => {
    let pdfIframe = document.getElementById('pdfIframe');
    if (pdfIframe) {
      pdfIframe.parentNode.removeChild(pdfIframe);
    }
    if (!localStorage.getItem('book')) {
      message.warning('请先保存工程');
      return;
    }
    let bookId = JSON.parse(localStorage.getItem('book')).id;
    let pageTurn = bookPages.present.config.pageTurn
    if (!pageTurn) {
      pageTurn = 0
    }
    setState({
      loading: true
    });
    api.preview(bookId).then(res => {
      let trad = bookPages.present.config.simple ? "" : "Trad";
      if (res.state) {
        // res.result
        let url = res.result.replace('index.html', 'content.html');
        let pdfIframe = document.createElement('iframe');
        pdfIframe.src = url + '?from=downloadPdf' + trad;
        pdfIframe.frameborder = '0';
        pdfIframe.style.width = '100vw';
        if (bookPages.present.config.isVertical) {
          pdfIframe.style.height = '984px';
        } else {
          pdfIframe.style.height = '728px';
        }
        pdfIframe.style.border = 0;
        pdfIframe.style.overflow = 'auto';

        let div = document.createElement('div')
        div.id = 'pdfIframeCont';
        div.style.position = 'fixed';
        div.style.top = 0;
        div.style.left = 0;
        div.style.zIndex = 999999;
        div.style.width = '100vw';
        div.style.height = '100vh';
        div.style.opacity = 0;
        div.style.overflow = 'auto';
        div.appendChild(pdfIframe);
        document.body.appendChild(div);
        window.addEventListener(
          'message',
          function(messageEvent) {
            //接收消息的监听，这里可以通过ev.origin判断是否是合法的来源
            // console.log('接收消息的监听，这里可以通过ev', messageEvent);
            if (messageEvent.data === 'success') {
              setState({
                loading: false
              });
              if (div.parentNode) {
                div.parentNode.removeChild(div);
              }
            }
          },
          false
        );
      } else {
        setState({
          loading: false
        });
        message.error(res.message);
      }
    });
  };

  const preview = () => {
    if (!localStorage.getItem('book')) {
      message.warning('请先保存工程');
      return;
    }
    let bookId = JSON.parse(localStorage.getItem('book')).id;
    setState({
      loading: true
    });
    api.preview(bookId).then(res => {
      if (res.state) {
        // res.result
        setState({
          loading: false
        });
        window.open(res.result);
      } else {
        setState({
          loading: false
        });
        message.error(res.message);
      }
    });
  };

  return (
    <div className={styles.homeMenuPane}>
      <Modal
        title={state.modalTitle}
        visible={state.visible}
        width={state.width}
        footer={null}
        onCancel={handleCancel}
      >
        {state.action === 0 ? (
          <TextUploadForm
            onCancal={handleCancel}
            onSubmit={actInsertUploadedText}
          ></TextUploadForm>
        ) : (
          ''
        )}
      </Modal>
      <div
        className={styles.loadingBox}
        style={{ display: loading ? 'flex' : 'none' }}
      >
        <Spin tip="Loading..."></Spin>
      </div>
      {/*<div>
        <IconButton
          text={trans.HomeMenu.imports}
          onClickCallback={actImports}
        >
          <img src={Home_Import} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
      </div>
      <div>
        <IconButton
          text={trans.HomeMenu.addtext}
          onClickCallback={showUploadModal}
        >
          <img src={Home_AddText} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
      </div>*/}
      <IconButton
        text={trans.Uploaded.textupload}
        onClickCallback={showUploadModal}
      >
        <img
          src={Interactive_TextUpload}
          style={{ width: '36px', height: 'auto' }}
        />
      </IconButton>
      <div>
        <ThemePanel
          isAll={true}
          text={trans.HomeMenu.ThemeTxt}
          onClickCallback={showPanel}
        ></ThemePanel>
      </div>
      <div>
        <IconButton
          text={trans.HomeMenu.globalBackground}
          onClickCallback={() => {
            actSetImage(true);
          }}
        >
          <img
            src={Home_Background}
            style={{ width: '36px', height: 'auto' }}
          />
        </IconButton>
      </div>
      <div
        style={{
          display: present.config && present.config.image ? 'block' : 'none'
        }}
      >
        <IconButton
          text={trans.HomeMenu.globalBackgroundRemove}
          onClickCallback={() => {
            actRemoveImage(true);
          }}
        >
          <PageIcon width={36} height={36} />
        </IconButton>
      </div>
      <div>
        <FontControl isAll={true} text={trans.HomeMenu.FontTxt} />
      </div>
      <div>
        <IconButton
          text={trans.HomeMenu.music}
          onClickCallback={() => {
            showMusicPanel();
          }}
        >
          <img
            src={Audio_BackgroundMusic}
            style={{ width: '36px', height: 'auto' }}
          />
        </IconButton>
      </div>
      <Paginate
          visible={state.paginateShow}
          trans={trans}
          onRef={(ref)=>{ state.child = ref}}
          handleCancel={cancelPaginate}
          setPaginate={setPaginate}
          bookPages={bookPages}
        />
        {state.showTurnPageModal&& <TurnPageChoose
          trans={trans}
          type={present.config.pageTurn}
          handleChange={ type =>{
            setPageTurn(type);
          }}
          handleClose={()=>{
          setState({
            showTurnPageModal:false
          })
        }}/>}
      {/*<div>
        <IconButton text={trans.HomeMenu.preview} onClickCallback={() => {
          preview()
        }}>
          <img src={Home_Review} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
      </div>
      <div>
        <IconButton text={trans.HomeMenu.save} onClickCallback={() => {
          setOpen()
        }}>

          <img src={Home_Save} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
      </div>*/}
      <div>
        <IconButton
          text={trans.HomeMenu.paginate}
          onClickCallback={showPaginatModal}
        >
          <img src={paginate_icon} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
      </div>
      <div>
        <IconButton
          text={trans.HomeMenu.exportpdf}
          onClickCallback={() => {
            exportPdf(bookPages);
          }}
        >
          <img src={Home_exportpdf} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
      </div>
      <div>
        <IconButton
          text={trans.HomeMenu.download}
          onClickCallback={() => {
            download();
          }}
        >
          <img src={Home_Download} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
      </div>
      <div>
        <IconButton
          text={trans.HomeMenu.pageTurn}
          onClickCallback={() => {
            setState({
              showTurnPageModal:true
            })
          }}
        >
          <img src={Home_TurnPage} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
      </div>
      {/* <div>
        <IconButton
          text={trans.HomeMenu.loginOut}
          onClickCallback={actSetLogout}
        >
          <img src={Home_Logout} style={{ width: '36px', height: 'auto' }} />
        </IconButton>
      </div> */}
      <div className={styles['select-box--box']}>
        <div className={styles['select-box--container']}>
          {languageSelector(switchLang, trans.id)}
        </div>
      </div>
      <div
        className={styles.saveBox}
        style={{ display: show ? 'flex' : 'none' }}
      >
        <div className={styles.saveForm}>
          <span>工程名称：</span>
          <input
            value={bookname || ''}
            onChange={({ target: { value } }) => setBookName(value)}
            placeholder="请输入工程名称"
          />
          <Button
            className={styles.saveButton}
            type="primary"
            onClick={() => {
              actSave(bookPages, bookname);
            }}
          >
            保存
          </Button>
          <Button
            className={styles.saveButton}
            type="primary"
            onClick={() => {
              setClose();
            }}
            style={{ marginLeft: '10px' }}
          >
            取消
          </Button>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  addElement: (type, content) => {
    dispatch(actAddElement(type, content));
  },
  actSavePage: (bookPages, bookname) => {
    const { present } = bookPages;
    const { userId } = JSON.parse(
      localStorage.getItem('token')
    ).loginResult.userInfoDto;
    const id =
      localStorage.getItem('book') &&
      JSON.parse(localStorage.getItem('book')).id;
    let bookid = nanoid(24);
    let data = {
      id: id ? id : bookid,
      bookName: bookname ? bookname : '',
      userId: userId,
      pages: present.pages,
      config: present.config
    };
    if (!id) {
      let data = {
        id: bookid,
        bookName: bookname
      };
      localStorage.setItem('book', JSON.stringify(data));
    }
    dispatch({
      type: 'saveBooksAsync',
      payload: data
    });
  },
  switchLang: e => {
    const lang = loadLanguage(e.value);
    dispatch(actLoadTrans(lang));
  },
  actImports: () => {
    message.warning('功能正在开发中');
  },
  actAddtxt: () => {
    message.warning('功能正在开发中');
  },
  showPanel: () => {
    dispatch(showPanel());
  },
  actRemoveImage: removeAll => {
    dispatch(actRemoveImage(removeAll));
  },
  actSetImage: setAll => {
    dispatch(actSetDialog(setAll));
    dispatch({
      type: 'setImage',
      payload: {
        ext: '',
        page: 1,
        searchKey: '',
        pageSize: 12,
        tag: ''
      }
    });
  },
  actInsertUploadedText: textObj => {
    dispatch(actInsertUploadedText(textObj));
  },
  setPaginate: paginate => {
    dispatch(actSetPaginate(paginate));
  },
  showMusicPanel: () => {
    dispatch(showMusicPanel());
  },
  actSetMusic: setAll => {
    dispatch(showMusicDialog(setAll));
    dispatch({
      type: 'setMusic',
      payload: {
        mediaCategory: 2,
        page: 1,
        pageSize: 10
      }
    });
  },
  setPageTurn: type => {
    dispatch(actSetPageTurn({pageTurn:type}));
  },
});

const mapStateToProps = ({ trans, bookPages }) => ({
  trans,
  bookPages
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeMenu);
