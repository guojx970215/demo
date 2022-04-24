import React from 'react';
import { connect } from 'react-redux';
import './Project.css';
import {
  Modal,
  Button,
  Switch,
  Input,
  message,
  List,
  Avatar,
  Spin,
} from 'antd';
import { actNewProject } from '../../store/auth/auth';
import nanoid from 'nanoid';
import { EmptyThumb } from '../../constants';
import { actGetPageData } from '../../store/bookPages/actions';
import bookIcon from './book.png';
import api from '../../api/bookApi';

const { Search } = Input;

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 8,
      page: 1,
      isLands: true,
      visible: false,
      copyProjectVisible: false,
      projectName: '',
      bookCode: '',
      copyProjectName: '',
      search: '',
      currentDelete: false,
      editProjectName: '',
      editBookCode: '',
      editProjectVisible: false,
      spinning: false,
    };
    Project._this = this;
  }
  componentDidMount() {
    const { acGetBookList } = this.props;

    let token;
    try {
      token = JSON.parse(localStorage.getItem('token'));
    } catch (e) {}

    acGetBookList(
      this.state.pageSize,
      this.state.page,
      token.loginResult.userInfoDto.userId,
      this.state.search
    );
  }

  showModal = (e) => {
    this.setState({
      visible: true,
      projectName: '',
    });
  };
  hideProject = () => {
    const { trans } = this.props;
    if (this.state.currentDelete) {
      message.warning(trans.Project.pleaseChooseProject);
      return;
    }
    this.props.hideProject();
  };

  handleOk = (e) => {
    const { trans } = this.props;
    if (!this.state.projectName) {
      message.warning(trans.Project.pInputProjectName);
      return;
    }
    if (!this.state.bookCode) {
      message.warning(trans.Project.pInputBookCode);
      return;
    }
    this.setState({
      visible: false,
    });
    this.props.actNewProject(this.props.bookPages);
  };
  handleCopyProjectOk = (e) => {
    const { trans } = this.props;
    if (!this.state.copyProjectName) {
      message.warning(trans.Project.pInputProjectName);
      return;
    }
    if (!this.state.copyBookCode) {
      message.warning(trans.Project.pInputBookCode);
      return;
    }
    this.setState({
      copyProjectVisible: false,
    });
    api
      .copyBook(
        this.state.copyProjectId,
        nanoid(24),
        this.state.copyProjectName,
        this.state.copyBookCode
      )
      .then(({ state, msg }) => {
        if (state) {
          message.success('复制工程成功');
          let token;
          try {
            token = JSON.parse(localStorage.getItem('token'));
          } catch (e) {}
          this.searchBook('', token.loginResult.userInfoDto.userId);
        } else {
          message.error(msg);
        }
      });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  onChange = (checked) => {
    this.setState({
      isLands: checked,
    });
  };

  onChangePotrial = (checked) => {
    this.setState({
      isLands: !checked,
    });
  };

  searchBook(e, userid) {
    this.setState(
      {
        search: e,
      },
      () => {
        this.props.acGetBookList(
          this.state.pageSize,
          1,
          userid,
          this.state.search
        );
      }
    );
  }

  changeName(e) {
    this.setState({
      projectName: e.target.value,
    });
  }

  changeCode(e) {
    this.setState({
      bookCode: e.target.value,
    });
  }

  editBookName = () => {
    const { trans } = this.props;
    if (!this.state.editProjectName) {
      message.warning(trans.Project.pInputProjectName);
      return;
    }
    if (!this.state.editBookCode) {
      message.warning(trans.Project.pInputBookCode);
      return;
    }
    this.setState({
      editProjectVisible: false,
    });
    api.getPage(this.state.editProjectId).then(({ state, result, msg }) => {
      if (state) {
        result.bookName = this.state.editProjectName;
        result.bookCode = this.state.editBookCode;
        api.savePage(result).then(({ state, msg }) => {
          if (state) {
            message.success(trans.Project.operateSuccess);
            this.queryData();
          } else {
            message.error(msg);
          }
        });
      } else {
        message.error(msg);
      }
    });
  };
  queryData = () => {
    let token;
    try {
      token = JSON.parse(localStorage.getItem('token'));
    } catch (e) {}
    this.searchBook('', token.loginResult.userInfoDto.userId);
  };
  render() {
    const { actProjectDetail, actDelProject, authStatus, trans } = this.props;
    let token;
    try {
      token = JSON.parse(localStorage.getItem('token'));
    } catch (e) {}

    return (
      <Modal
        visible={this.props.visible}
        footer={null}
        onCancel={this.hideProject}
        title={trans.Project.MyProjectList}
        destroyOnClose={true}
        maskClosable={false}
        width={740}
      >
        <Modal
          title="Add Project"
          centered
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div
            className="project-input-item"
            style={{
              fontSize: '16px',
              marginBottom: '16px',
              marginLeft: '16px',
            }}
          >
            <span>Lands：</span>
            <Switch
              checked={this.state.isLands}
              defaultChecked
              onChange={this.onChange}
            />

            <span style={{ marginLeft: 16 }}>Potrial：</span>
            <Switch
              checked={!this.state.isLands}
              onChange={this.onChangePotrial}
            />
          </div>
          <div className="project-input-item" style={{ marginBottom: '16px' }}>
            <label>
              <span style={{ color: 'red' }}>* </span>
              {trans.Project.projectName} :
            </label>

            <Input
              placeholder={trans.Project.pInputProjectName}
              value={this.state.projectName}
              style={{ width: '200px' }}
              onChange={(e) => this.changeName(e)}
            />
          </div>
          <div className="project-input-item">
            <label>
              <span style={{ color: 'red' }}>* </span>
              {trans.Project.BookCode} :
            </label>
            <Input
              placeholder={trans.Project.pInputBookCode}
              value={this.state.bookCode}
              style={{ width: '200px' }}
              onChange={(e) => this.changeCode(e)}
            />
          </div>
        </Modal>
        <Modal
          title="Copy project"
          centered
          visible={this.state.copyProjectVisible}
          onOk={this.handleCopyProjectOk}
          onCancel={() => {
            this.setState({
              copyProjectVisible: false,
            });
          }}
        >
          <div className="project-input-item" style={{ marginBottom: '16px' }}>
            <label>
              <span style={{ color: 'red' }}>* </span>
              {trans.Project.projectName}:
            </label>
            <Input
              placeholder={trans.Project.pInputProjectName}
              value={this.state.copyProjectName}
              style={{ width: '200px' }}
              onChange={(event) => {
                this.setState({ copyProjectName: event.target.value });
              }}
            />
          </div>

          <div className="project-input-item">
            <label>
              <span style={{ color: 'red' }}>* </span>
              {trans.Project.BookCode} :
            </label>
            <Input
              placeholder={trans.Project.pInputBookCode}
              value={this.state.copyBookCode}
              style={{ width: '200px' }}
              onChange={(event) => {
                this.setState({ copyBookCode: event.target.value });
              }}
            />
          </div>
        </Modal>
        <Modal
          title="Edit project name"
          centered
          visible={this.state.editProjectVisible}
          onOk={this.editBookName}
          onCancel={() => {
            this.setState({
              editProjectVisible: false,
            });
          }}
        >
          <div className="project-input-item" style={{ marginBottom: '16px'}}>
            <label>
              <span style={{ color: 'red' }}>* </span>
              {trans.Project.projectName}:
            </label>
            <Input
              placeholder={trans.Project.pInputProjectName}
              value={this.state.editProjectName}
              style={{ width: '200px' }}
              onChange={(event) => {
                this.setState({ editProjectName: event.target.value });
              }}
            />
          </div>

          <div className="project-input-item">
            <label>
              <span style={{ color: 'red' }}>* </span>
              {trans.Project.BookCode} :
            </label>
            <Input
              placeholder={trans.Project.pInputBookCode}
              value={this.state.editBookCode}
              style={{ width: '200px' }}
              onChange={(event) => {
                this.setState({ editBookCode: event.target.value });
              }}
            />
          </div>
        </Modal>

        <div className="ProjectList">
          <Search
            placeholder={trans.Project.pInputProjectName}
            onSearch={(value) =>
              this.searchBook(value, token.loginResult.userInfoDto.userId)
            }
            style={{ width: 200, marginBottom: '10px' }}
          />

          <Button
            className="NewProject"
            type="primary"
            onClick={this.showModal}
          >
            {trans.Project.add}
          </Button>
          <List
            loading={this.state.spinning}
            itemLayout="horizontal"
            pagination={{
              onChange: (page) => {
                this.setState({
                  page: page,
                });
                this.props.acGetBookList(
                  this.state.pageSize,
                  page,
                  token.loginResult.userInfoDto.userId,
                  this.state.search
                );
              },
              total: authStatus.bookTotal,
              pageSize: 8,
            }}
            dataSource={authStatus.bookList}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a
                    key="list-loadmore-edit"
                    onClick={(e) => {
                      actDelProject(
                        e,
                        item,
                        this.state.pageSize,
                        this.state.page,
                        trans
                      );
                    }}
                  >
                    {trans.Project.delete}
                  </a>,
                  <a
                    key="list-loadmore-copy"
                    onClick={(e) => {
                      this.setState({
                        copyProjectVisible: true,
                        copyProjectId: item.id,
                        copyProjectName: item.bookName,
                        copyBookCode: item.bookCode,
                      });
                    }}
                  >
                    {trans.Project.copy}
                  </a>,
                  <a
                    key="list-loadmore-editName"
                    onClick={(e) => {
                      this.setState({
                        editProjectVisible: true,
                        editProjectId: item.id,
                        editProjectName: item.bookName,
                        editBookCode: item.bookCode,
                      });
                    }}
                  >
                    {trans.Project.editName}
                  </a>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={bookIcon} />}
                  title={
                    <a
                      onClick={() => {
                        this.setState({ spinning: true });
                        setTimeout(() => {
                          this.setState({ spinning: false });
                          actProjectDetail(item);
                        }, 1000);
                      }}
                      style={{ lineHeight: '34px' }}
                    >
                      {item.bookName}
                    </a>
                  }
                  // description={item.createTime}
                />
                <div>{item.createTime}</div>
              </List.Item>
            )}
          />
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = ({ trans, authStatus, bookPages }) => ({
  trans,
  authStatus,
  bookPages,
});

const mapDispatchToProps = (dispatch) => ({
  actDelProject: (e, item, pageSize, page, trans) => {
    e.preventDefault();
    e.stopPropagation();
    let token = JSON.parse(localStorage.getItem('token'));

    Modal.confirm({
      icon: null,
      content: trans.Project.ifDelete,
      okText: trans.Project.confirm,
      onOk: () => {
        dispatch({
          type: 'delBooksAsync',
          payload: item.id,
        });
        setTimeout(() => {
          Project._this.setState({
            page: 1,
          });
          dispatch({
            type: 'getBooksListAsync',
            payload: {
              page: 1,
              pageSize: pageSize,
              userId: token.loginResult.userInfoDto.userId,
            },
          });
        }, 500);
        if (
          localStorage.getItem('book') &&
          JSON.parse(localStorage.getItem('book')).id === item.id
        ) {
          Project._this.setState({
            currentDelete: true,
          });
        }
      },
      cancelText: trans.Project.cancel,
      onClick: () => {},
    });
  },
  actProjectDetail: (item) => {
    localStorage.setItem('book', JSON.stringify(item));
    Project._this.setState({
      currentDelete: false,
    });
    dispatch({
      type: 'getBooksAsync',
      payload: item.id,
    });
    dispatch(actNewProject(null));
  },
  acGetBookList: (pageSize, page, userId, search) => {
    dispatch({
      type: 'getBooksListAsync',
      payload: {
        page: page,
        pageSize: pageSize,
        userId: userId,
        searchKey: search,
      },
    });
  },
  actNewProject: (bookPages) => {
    const createNewPageObject = (idx) => {
      return {
        id: nanoid(24),
        elements: [],
        showElementPane: false,
        index: idx,
        thumb: EmptyThumb.portrait,
      };
    };
    const initPage = createNewPageObject(0);
    const initialState = {
      past: [],
      present: {
        id: nanoid(24),
        pages: [initPage],
        config: {
          isVertical: !Project._this.state.isLands,
          // layout: 'portrait', // portrait or landscape
          backgroundMusic: [],
        },
      },
      future: [],
      showingPageId: initPage.id,
      templates: [],
      showPageTemplate: false,
      showTemplate: false,
    };
    dispatch(actGetPageData(initialState.present));
    let books = {
      bookName: Project._this.state.projectName,
      bookCode: Project._this.state.bookCode,
      id: nanoid(24),
    };
    localStorage.setItem('isVertical', !Project._this.state.isLands);
    localStorage.setItem('book', JSON.stringify(books));
    Project._this.setState({
      currentDelete: false,
    });
    dispatch(actNewProject(null));
  },
  hideProject: () => {
    dispatch(actNewProject(null));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
