import React, { useEffect, useState } from 'react';
import {
  Modal,
  Checkbox,
  InputNumber,
  Col,
  Row,
  Select,
  Button,
  Radio,
  TimePicker,
  Input,
  Table,
  Icon,
  message
} from 'antd';
import './TimerPanel.css';
import { ChromePicker } from 'react-color';
import moment from 'moment';

import { connect } from 'react-redux';
import {
  actAddTimer,
  actEditTimer,
  actDeleteTimer
} from '../../store/bookPages/actions';

const TimerPanel = props => {
  const [addVisible, setAddVisible] = useState(false);
  const [editId, setEditId] = useState(undefined);
  const [config, setConfig] = useState({
    countDown: true,
    duration: moment('00:00', 'mm:ss'),
    size: 100,
    fontSize: 14,
    fontColor: '#000',
    bgColor: '#f2f2f2',
    bgSize: 2,
    fgColor: '#1890ff',
    fgSize: 6,
    scope: 'all'
  });
  const [picker, setPicker] = useState({
    visible: false,
    onOk: () => {},
    left: 0,
    top: 0,
    color: undefined
  });

  const setSingleConfig = (key, value) => {
    let newConfig = { ...config };
    newConfig[key] = value;
    setConfig(newConfig);
  };

  const setSinglePicker = (key, value) => {
    let newConfig = { ...picker };
    newConfig[key] = value;
    setPicker(newConfig);
  };

  const isRepeat = (addItem, id) => {
    let flag = false;
    let timers = props.bookPages.present.config.timer || [];
    if (id) {
      timers = timers.filter(value => value.id !== id);
    }
    if (
      (timers.length === 1 && timers[0].scope === 'all') ||
      (timers.length >= 1 && addItem.scope === 'all')
    ) {
      return true;
    } else if (isNaN(addItem.scope)) {
      let arr = addItem.scope.split('-');
      let start = Number.parseInt(arr[0]);
      let end = Number.parseInt(arr[1]);
      timers.forEach((timer, idx) => {
        if (isNaN(timer.scope)) {
          let result = timer.scope.split('-');
          let cmpStart = Number.parseInt(result[0]);
          let cmpEnd = Number.parseInt(result[1]);
          if (
            (start >= cmpStart && start <= cmpEnd) ||
            (end >= cmpStart && end <= cmpEnd)
          ) {
            flag = true;
            return;
          }
        } else {
          if (
            start <= Number.parseInt(timer.scope) &&
            end >= Number.parseInt(timer.scope)
          ) {
            flag = true;
            return;
          }
        }
      });
    } else {
      let scope = Number.parseInt(addItem.scope);
      timers.forEach((timer, idx) => {
        if (isNaN(timer.scope)) {
          let result = timer.scope.split('-');
          let cmpStart = Number.parseInt(result[0]);
          let cmpEnd = Number.parseInt(result[1]);
          if (scope >= cmpStart && scope <= cmpEnd) {
            flag = true;
            return;
          }
        } else {
          if (scope === Number.parseInt(timer.scope)) {
            flag = true;
            return;
          }
        }
      });
    }

    return flag;
  };

  const onOk = () => {
    if (editId) {
      let newTimer = { ...config };

      newTimer.duration = moment(newTimer.duration)
        .format('mm:ss')
        .split(':');
      newTimer.duration =
        Number(newTimer.duration[0]) * 60 + Number(newTimer.duration[1]);

      let flag = isRepeat(newTimer, editId);

      if (flag) {
        message.error(props.trans.timer.variable1);
        return;
      } else {
        props.actEditTimer(newTimer, editId);

        cancelAdd();
      }
    } else {
      let newTimer = { ...config };
      newTimer.duration = moment(newTimer.duration)
        .format('mm:ss')
        .split(':');
      newTimer.duration =
        Number(newTimer.duration[0]) * 60 + Number(newTimer.duration[1]);
      newTimer.x = 0;
      newTimer.y = 0;
      let flag = isRepeat(newTimer);

      if (flag) {
        message.error(props.trans.timer.variable1);
        return;
      } else {
        props.actAddTimer(newTimer);

        cancelAdd();
      }
    }
  };

  const editTimer = timerConfig => {
    setConfig({
      ...timerConfig,
      duration: moment(
        Math.floor(timerConfig.duration / 60) + ':' + (timerConfig.duration % 60),
        'mm:ss'
      )
    });
    setEditId(timerConfig.id);
    setAddVisible(true);
  };


  useEffect(() => {
    if (props.editConfig) {
      editTimer(props.editConfig);
    }
  }, [props.editConfig])

  const cancelAdd = () => {
    setAddVisible(false);
    setEditId(undefined);
    if (props.cancelAdd) {
      props.cancelAdd(undefined)
    }
  }

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (text, record, index) =>
        record.countDown
          ? props.trans.timer.variable2
          : props.trans.timer.variable3
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (text, record, index) =>
        record.countDown
          ? Math.floor(record.duration / 60) + ':' + (record.duration % 60)
          : '-'
    },
    {
      title: 'Scope',
      dataIndex: 'scope',
      key: 'scope'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a
            onClick={() => props.actDeleteTimer(record.id)}
            style={{ marginRight: 16 }}
          >
            <Icon type="close" />
          </a>
          <a
            onClick={() => {
              editTimer(record);
            }}
          >
            <Icon type="edit" />
          </a>
        </span>
      )
    }
  ];

  return (
    <div>
      <Modal
        visible={props.visible}
        width="70vw"
        title={props.trans.timer.variable4}
        footer={null}
        onCancel={() => props.onCancel()}
      >
        <Button
          type="primary"
          onClick={() => {
            setConfig({
              countDown: true,
              duration: moment('00:00', 'mm:ss'),
              size: 100,
              fontSize: 14,
              fontColor: '#000',
              bgColor: '#f2f2f2',
              bgSize: 2,
              fgColor: '#1890ff',
              fgSize: 6,
              scope: 'all'
            });
            setAddVisible(true);
          }}
          style={{
            display:
              props.bookPages.present.config.timer &&
              props.bookPages.present.config.timer.length > 0 &&
              props.bookPages.present.config.timer[0].scope === 'all'
                ? 'none'
                : 'inline-block'
          }}
        >
          {props.trans.timer.variable17}
        </Button>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={props.bookPages.present.config.timer}
          pagination={false}
        ></Table>
      </Modal>

      <Modal
        visible={addVisible}
        width={400}
        title={props.trans.timer.variable4}
        onCancel={cancelAdd}
        onOk={onOk}
      >
        <Row gitter={16}>
          <Col span={12}>
            <div className="timer-list">
              <Checkbox
                checked={config.countDown}
                onChange={e => {
                  setSingleConfig('countDown', e.target.checked);
                }}
              >
                {props.trans.timer.variable2}
              </Checkbox>
            </div>
          </Col>
          <Col span={12}>
            {config.countDown ? (
              <div className="timer-list">
                <span>{props.trans.timer.variable5}</span>
                <TimePicker
                  style={{ width: 100 }}
                  value={config.duration}
                  format="mm:ss"
                  onChange={value => setSingleConfig('duration', value)}
                />
              </div>
            ) : (
              <div className="timer-list">
                <span></span>
              </div>
            )}
          </Col>
          <Col span={12}>
            <div className="timer-list">
              <span>{props.trans.timer.variable6}</span>
              <Input
                value={config.scope}
                onChange={value => {
                  setSingleConfig('scope', value.target.value);
                }}
                style={{ width: 100 }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="timer-list">
              <span>{props.trans.timer.variable7}</span>
              <InputNumber
                value={config.size}
                min={0}
                step={1}
                onChange={value => {
                  setSingleConfig('size', value);
                }}
                style={{ width: 100 }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="timer-list">
              <span>{props.trans.timer.variable8}</span>
              <InputNumber
                value={config.fontSize}
                min={4}
                step={1}
                onChange={value => {
                  setSingleConfig('fontSize', value);
                }}
                style={{ width: 100 }}
              />
            </div>
          </Col>

          <Col span={12}>
            <div className="timer-list">
              <span>{props.trans.timer.variable9}</span>
              <Button
                style={{ width: 100, color: config.fontColor }}
                onClick={() =>
                  setPicker({
                    visible: true,
                    color: config.fontColor,
                    left: 260,
                    top: 170,
                    onOk: color => setSingleConfig('fontColor', color)
                  })
                }
              >
                {config.fontColor || props.trans.timer.variable10}
              </Button>
            </div>
          </Col>

          <Col span={12}>
            <div className="timer-list">
              <span>{props.trans.timer.variable11}</span>
              <InputNumber
                value={config.bgSize}
                min={0}
                step={1}
                onChange={value => {
                  setSingleConfig('bgSize', value);
                }}
                style={{ width: 100 }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="timer-list">
              <span>{props.trans.timer.variable12}</span>
              <InputNumber
                value={config.fgSize}
                min={0}
                step={1}
                onChange={value => {
                  setSingleConfig('fgSize', value);
                }}
                style={{ width: 100 }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="timer-list">
              <span>{props.trans.timer.variable13}</span>
              <Button
                style={{ width: 100, color: config.fgColor }}
                onClick={() =>
                  setPicker({
                    visible: true,
                    color: config.fgColor,
                    left: 82,
                    top: 220,
                    onOk: color => setSingleConfig('fgColor', color)
                  })
                }
              >
                {config.fgColor || props.trans.timer.variable10}
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <div className="timer-list">
              <span>{props.trans.timer.variable14}</span>
              <Button
                style={{ width: 100, color: config.bgColor }}
                onClick={() =>
                  setPicker({
                    visible: true,
                    color: config.bgColor,
                    left: 260,
                    top: 220,
                    onOk: color => setSingleConfig('bgColor', color)
                  })
                }
              >
                {config.bgColor || props.trans.timer.variable10}
              </Button>
            </div>
          </Col>
        </Row>
        <div style={{ marginTop: 16 }}>
          <div
            className="previewCircle"
            style={{
              width: config.size,
              height: config.size,
              marginRight: 16
            }}
          >
            <div
              className="previewCircleBg"
              style={{
                borderColor: config.bgColor,
                borderWidth: config.bgSize,
                width:
                  config.fgSize > config.bgSize
                    ? config.size - config.fgSize + config.bgSize
                    : config.size,
                height:
                  config.fgSize > config.bgSize
                    ? config.size - config.fgSize + config.bgSize
                    : config.size
              }}
            ></div>
            <div
              className="previewCircleFgWrapper"
              style={{
                width:
                  config.fgSize >= config.bgSize
                    ? config.size / 2
                    : (config.size + config.fgSize - config.bgSize) / 2,
                right:
                  config.fgSize >= config.bgSize
                    ? 0
                    : config.size / 2 -
                      (config.size + config.fgSize - config.bgSize) / 2
              }}
            >
              <div
                className="previewCircleFg"
                style={{
                  borderColor: config.fgColor,
                  borderWidth: config.fgSize,
                  width:
                    config.fgSize >= config.bgSize
                      ? config.size
                      : config.size + config.fgSize - config.bgSize,
                  height:
                    config.fgSize >= config.bgSize
                      ? config.size
                      : config.size + config.fgSize - config.bgSize
                }}
              ></div>
            </div>
            <div className="previewText">
              <h4 style={{ color: config.fontColor }}>Minute</h4>
              <span
                style={{
                  fontSize: config.fontSize,
                  color: config.fontColor
                }}
              >
                0
              </span>
            </div>
          </div>

          <div
            className="previewCircle"
            style={{
              width: config.size,
              height: config.size
            }}
          >
            <div
              className="previewCircleBg"
              style={{
                borderColor: config.bgColor,
                borderWidth: config.bgSize,
                width:
                  config.fgSize > config.bgSize
                    ? config.size - config.fgSize + config.bgSize
                    : config.size,
                height:
                  config.fgSize > config.bgSize
                    ? config.size - config.fgSize + config.bgSize
                    : config.size
              }}
            ></div>
            <div
              className="previewCircleFgWrapper"
              style={{
                width:
                  config.fgSize >= config.bgSize
                    ? config.size / 2
                    : (config.size + config.fgSize - config.bgSize) / 2,
                right:
                  config.fgSize >= config.bgSize
                    ? 0
                    : config.size / 2 -
                      (config.size + config.fgSize - config.bgSize) / 2
              }}
            >
              <div
                className="previewCircleFg"
                style={{
                  borderColor: config.fgColor,
                  borderWidth: config.fgSize,
                  width:
                    config.fgSize >= config.bgSize
                      ? config.size
                      : config.size + config.fgSize - config.bgSize,
                  height:
                    config.fgSize >= config.bgSize
                      ? config.size
                      : config.size + config.fgSize - config.bgSize
                }}
              ></div>
            </div>
            <div className="previewText">
              <h4 style={{ color: config.fontColor }}>Second</h4>
              <span
                style={{
                  fontSize: config.fontSize,
                  color: config.fontColor
                }}
              >
                0
              </span>
            </div>
          </div>
        </div>
        <div
          className="color-picker"
          style={{
            display: picker.visible ? 'block' : 'none',
            top: picker.top,
            left: picker.left
          }}
        >
          <ChromePicker
            color={picker.color}
            onChange={color => setSinglePicker('color', color.hex)}
          />
          <Button
            style={{ margin: '8px 16px', width: 90 }}
            type="primary"
            onClick={() => {
              setSinglePicker('visible', false);
              picker.onOk(picker.color);
            }}
          >
            {props.trans.timer.variable15}
          </Button>
          <Button
            style={{ margin: '8px 0', width: 90 }}
            onClick={() => setSinglePicker('visible', false)}
          >
            {props.trans.timer.variable16}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
const mapStateToProps = ({ trans, bookPages }) => ({
  trans,
  bookPages
});
const mapDispatchToProps = dispatch => ({
  actAddTimer: content => {
    dispatch(actAddTimer(content));
  },
  actEditTimer: (content, id) => {
    dispatch(actEditTimer(content, id));
  },
  actDeleteTimer: id => {
    dispatch(actDeleteTimer(id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TimerPanel);
