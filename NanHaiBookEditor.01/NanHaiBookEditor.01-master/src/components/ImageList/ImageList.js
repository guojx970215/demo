import React from 'react';
import { connect } from 'react-redux';
import './ImageList.css';
import { styles } from 'ansi-colors';
import { actSetDialog, actSetImage } from '../../store/imageList/imageList';
import Slider, { Range } from 'rc-slider';
import { Input, Pagination, Button, Select, Modal, Row, Col } from 'antd';
import ColorBackGround from '../ColorPic/ColorBackGround'
import 'rc-slider/assets/index.css';

import {
  actSetPageAllBackground,
  actSetPageBackground
} from '../../store/bookPages/actions';
import { setColor } from '../../store/userColor/userColor';
const { Search } = Input;
const opacityMax = 100;
const opacityMin = 0;

class ImageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opacityValue: 0,
      placement: 1,
      selectIndex: -1,
      url: '',
      currentCount: 0,
      page: 1,
      pageSize: 12,
      searchKey: ''
    };

    ImageList._this = this;
  }

  onChange = value => {
    this.setState({
      opacityValue: value
    });
  };

  selectChange = value => {
    this.setState({
      placement: value
    });
  };

  imgClick = (index, path, e) => {
    this.setState({
      url: path,
      selectIndex: index
    });
  };

  pageOnChange = i => {
    this.setState(
      {
        page: i
      },
      this.props.actSetImage
    );
  };
  onShowSizeChange = (a, pageSize) => {
    let page = 1;
    this.setState(
      {
        pageSize,
        page
      },
      this.props.actSetImage
    );
  };
  onSearch = e => {
    console.log(e);
    this.setState(
      {
        searchKey: e,
        page: 1
      },
      this.props.actSetImage
    );
  };

  render() {
    const {
      trans,
      actSetDialog,
      actSetPageAllBackground,
      actSetPageBackground,
      actSetImage,
      setColor
    } = this.props;
    const { images, setAll, count } = this.props.imageList;
    const { page, pageSize, searchKey } = this.state;
    
    return (
      <Modal
        visible={this.props.visible}
        onCancel={actSetDialog.bind(this, false, setAll, trans)}
        title={trans.Background.setTitle}
        destroyOnClose={true}
        maskClosable={false}
        width="960px"
        okButtonProps={{ onClick: (e) => actSetDialog(true, setAll, trans, e) }}
        cancelButtonProps={{
          onClick: (e) => actSetDialog(false, setAll, trans, e),
        }}
        okText={trans.Background.ok}
        cancelText={trans.Background.cancel}
      >
        <div className="ImageList">
          <Row style={{ marginBottom: 24 }}>
            <Col span={9}>
              <Search
                ref={(c) => {
                  this.searchBar = c;
                }}
                className={styles.Search}
                placeholder="input search text"
                onSearch={this.onSearch}
                enterButton
              />
            </Col>
            <Col span={12} offset={3}>
              <div className="ImageSet">
                <div className="SetItem">
                  <span>{trans.Background.setPlace}：</span>
                  <Select
                    onChange={this.selectChange}
                    value={this.state.placement}
                    style={{ width: 120 }}
                  >
                    <Select.Option value={0}>
                      {trans.Background.placeDefault}
                    </Select.Option>
                    <Select.Option value={1}>
                      {trans.Background.placeLs}
                    </Select.Option>
                    <Select.Option value={2}>
                      {trans.Background.placeRepeat}
                    </Select.Option>
                  </Select>
                </div>
                <div className="SetItem" style={{ margin: 0 }}>
                  <span>{trans.Background.opacity}：</span>
                  <Slider
                    min={opacityMin}
                    max={opacityMax}
                    value={this.state.opacityValue}
                    defaultValue={this.state.opacityValue}
                    onChange={this.onChange}
                    style={{
                      display: 'inline-block',
                      width: '120px',
                      margin: '0 6px',
                    }}
                  />
                  <span>{this.state.opacityValue}</span>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            {images && images.length
              ? images.map((item, index) => (
                  <Col
                    span={4}
                    key={item.url}
                    onClick={(e) => this.imgClick(index, item.url, e)}
                    style={{
                      border:
                        this.state.selectIndex === index
                          ? '1px solid #1890ff'
                          : '1px solid #ffffff',
                      marginBottom: 16,
                    }}
                  >
                    <div className="ImgageInner">
                      <ColorBackGround
                        item={{
                          ...item,
                          backgroundRepeat:
                            this.state.placement == 2 ? 'repeat' : 'no-repeat',
                          backgroundSize:
                            this.state.placement == 1 ? '100% 100%' : 'auto',
                          opacity:
                            this.state.opacityValue == 0
                              ? '1'
                              : 1 - this.state.opacityValue / 100,
                        }}
                      ></ColorBackGround>
                    </div>
                    <div className="ImageName" title={item.name}>
                      {item.name}
                    </div>
                  </Col>
                ))
              : `${trans.Background.noImg}`}
          </Row>

          <Pagination
            size="small"
            total={count}
            current={page}
            pageSize={pageSize}
            showSizeChanger
            showQuickJumper
            onChange={this.pageOnChange}
            onShowSizeChange={this.onShowSizeChange}
            defaultPageSize={16}
            pageSizeOptions={['16', '32', '48', '64']}
          />
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = ({ trans, imageList }) => ({
  trans,
  imageList
});

const mapDispatchToProps = dispatch => ({
  actSetDialog: (isSubmit, setAll, trans) => {
    if (isSubmit) {
      // if (ImageList._this.state.selectIndex == -1) {
      //   return;
      // } else {
      let image = {
        opacity: ImageList._this.state.opacityValue,
        backgroundSize:
          ImageList._this.state.placement == 1 ? '100% 100%' : 'auto',
        backgroundRepeat:
          ImageList._this.state.placement == 2 ? 'repeat' : 'no-repeat',
          picSet:
          ImageList._this.props.imageList.images[ImageList._this.state.selectIndex]
      };
      ImageList._this.state.url && (image.url = ImageList._this.state.url);
      /* dispatch(setColor({
          type: 0,
          color: 'transparent'
        })); */
        image = JSON.parse(JSON.stringify(image))
      if (setAll) {
        dispatch(actSetPageAllBackground(image));
      } else {
        dispatch(actSetPageBackground(image));
      }
    }
    // }
    ImageList._this.setState({
      opacityValue: 0,
      placement: 0,
      selectIndex: -1,
      url: '',
      currentCount: 0,
      page: 1,
      pageSize: 12,
      searchKey: ''
    });
    ImageList._this.searchBar.input.state.value = '';
    dispatch(actSetDialog());
  },
  actSetImage: pageNo => {
    dispatch({
      type: 'setImage',
      payload: {
        ext: '',
        page: ImageList._this.state.page,
        searchKey: ImageList._this.state.searchKey,
        pageSize: ImageList._this.state.pageSize,
        tag: ''
      }
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageList);
