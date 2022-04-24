import { Button, Checkbox, Col, Icon, InputNumber, Modal, Row } from 'antd';
import htmlReactParser from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import ModalList, {
  getSvgDomStr,
  ifSvgImg,
} from '../../../HomeMenu/PhotoGallery/ModalList';
import { PicOptions, PicsOptions } from '../types';
import './PicCard.css';

interface PicCardProps {
  trans: any;
  pic?: PicOptions;
  setPic: (pic: PicOptions) => void;
  width?: number;
  hideDefault?: boolean; // hide default checkbox
  noSettings?: boolean; // choose pic directly without settings
  style?: React.CSSProperties;
  placeholder?: string;
}

export const PicCard = (props: PicCardProps) => {
  const {
    pic,
    setPic,
    trans,
    width = 82,
    hideDefault = false,
    noSettings = false,
    style = {},
    placeholder,
  } = props;
  const [previewVisible, setPreviewVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);

  const deletePic = () => {
    setPic({ url: '', width: 50, height: 50, default: false });
  };

  const toggleSetting = () => {
    setSettingVisible(!settingVisible);
  };

  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };

  return (
    <>
      <div
        style={{
          width: width,
          height: width,
          display: 'inline-block',
          marginLeft: 16,
          ...style,
        }}
      >
        {pic && pic.url ? (
          <div className="pic-card-container preview-pic">
            {pic.svg ? htmlReactParser(pic.svg) : <img src={pic.url} />}
            <div className="pic-card-cover">
              <div className="position-middle">
                <Icon type="eye" onClick={togglePreview} />
                <Icon type="setting" onClick={toggleSetting} />
                <Icon type="delete" onClick={deletePic} />
              </div>
            </div>
          </div>
        ) : (
          <div className="pic-card-container" onClick={toggleSetting}>
            <span>
              <Icon type="plus" /> <br />{' '}
              {placeholder || trans.AddQuestionForm.addPic}
            </span>
          </div>
        )}
      </div>

      <PicSettingsCard
        hideDefault={hideDefault}
        trans={trans}
        visible={settingVisible}
        onCancel={toggleSetting}
        pic={pic}
        onFinished={setPic}
        noSettings={noSettings}
      ></PicSettingsCard>

      <Modal
        visible={previewVisible}
        onCancel={togglePreview}
        footer={null}
        width={548}
        title="preview"
      >
        {pic?.url && <img src={pic.url} width="500" height="auto" />}
      </Modal>
    </>
  );
};

const getScale = (
  url: string,
  cb?: (scale: number, width: number, height: number) => void
) => {
  if (!url) return;

  const img = new Image();
  img.onload = () => {
    cb &&
      cb(Number((img.width / img.height).toFixed(2)), img.width, img.height);
  };
  img.src = url;
};

interface PicSettingsProps {
  visible: boolean;
  onCancel: () => void;
  trans: any;
  pic?: PicOptions;
  hideDefault?: boolean;
  max?: number;
  onFinished?: (pic: PicOptions) => void;
  noSettings?: boolean;
}

export const PicSettingsCard = (props: PicSettingsProps) => {
  const {
    visible,
    onCancel,
    trans,
    pic,
    hideDefault = false,
    max,
    onFinished,
    noSettings = false,
  } = props;

  const [url, setUrl] = useState('');
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [scaleLock, setScaleLock] = useState(true);
  const [defaultValue, setDefaultValue] = useState(false);
  const [svg, setSvg] = useState('');

  const setDefault = (e) => setDefaultValue(e.target.checked);
  const setLock = (e) => setScaleLock(e.target.checked);

  useEffect(() => {
    if (visible && pic && pic.url) {
      setSize({ width: pic.width, height: pic.height });
      setUrl(pic.url);
      setSvg(pic.svg);
      getScale(pic.url, (scale) => {
        setScale(scale || 1);
      });
      setScaleLock(true);
      setDefaultValue(pic.default);
    } else if (!visible) {
      setSize({ width: 50, height: 50 });
      setUrl('');
      setScaleLock(true);
      setDefaultValue(false);
      setSvg('');
    }
  }, [visible, pic]);

  const onOk = () => {
    onFinished &&
      onFinished({
        url,
        width: size.width,
        height: size.height,
        default: defaultValue,
        svg,
      });
    onCancel();
  };

  const [listVisible, setListVisible] = useState(false);
  const closeList = () => {
    noSettings ? onCancel() : setListVisible(false);
  };
  const showList = () => setListVisible(true);
  const choosePic = (newUrl, picItem) => {
    closeList();
    if (ifSvgImg(newUrl)) {
      getSvgDomStr(newUrl, picItem.metadata.defaultSvgColors).then((html) => {
        setSvg(html);
      });
    }

    if (noSettings) {
      onCancel();
      onFinished({ url: newUrl, width: 0, height: 0, default: false, svg });
    } else {
      setUrl(newUrl);

      if (newUrl !== url) {
        getScale(newUrl, (scale, width, height) => {
          setScale(scale || 1);
          setSize({ width, height });
        });
      }
    }
  };

  return (
    <>
      {!noSettings && (
        <Modal
          visible={visible}
          onCancel={onCancel}
          onOk={onOk}
          title="pic settings"
          width={360}
        >
          <Button
            style={{ width: '100%', overflow: 'hidden' }}
            onClick={showList}
          >
            {url || 'please select pic'}
          </Button>

          <Row>
            <Col
              span={24}
              style={{
                lineHeight: '34px',
                marginTop: 8,
                display: hideDefault ? 'none' : 'block',
              }}
            >
              <Checkbox checked={defaultValue} onChange={setDefault}>
                {trans.AddQuestionForm.defaultSize}
              </Checkbox>
            </Col>
            <Col span={24} style={{ lineHeight: '34px', marginBottom: 8 }}>
              <Checkbox
                checked={scaleLock}
                onChange={setLock}
                disabled={defaultValue}
              >
                {trans.AddQuestionForm.lockScale}
              </Checkbox>
            </Col>
            <Col span={12}>
              <span>{trans.AddQuestionForm.width}：</span>
              <InputNumber
                value={size.width}
                min={0}
                max={max}
                onChange={(value) => {
                  if (scaleLock) {
                    setSize({ width: value, height: Math.ceil(value / scale) });
                  } else {
                    setSize({ width: value, height: size.height });
                  }
                }}
                disabled={defaultValue}
              />
            </Col>
            <Col span={12}>
              <span>{trans.AddQuestionForm.height}：</span>
              <InputNumber
                value={size.height}
                min={0}
                max={max}
                onChange={(value) => {
                  if (scaleLock) {
                    setSize({ width: Math.ceil(value * scale), height: value });
                  } else {
                    setSize({ width: size.width, height: value });
                  }
                }}
                disabled={defaultValue}
              />
            </Col>
          </Row>
          <div
            className="insertImageList"
            style={{ display: hideDefault ? 'none' : 'block' }}
          ></div>
        </Modal>
      )}

      <ModalList
        visible={(noSettings && visible) || listVisible}
        trans={trans}
        onCancal={closeList}
        onClick={choosePic}
      ></ModalList>
    </>
  );
};

export default PicCard;

export function getPicOptions(dom: Element): PicOptions {
  // 获取题干图片
  const picDiv = dom.getElementsByTagName('img')[0];
  const svgDiv = dom.querySelector('.question-svg-container') as HTMLDivElement;

  const pic: PicOptions = { url: '', width: 50, height: 50, default: false };
  if (picDiv || svgDiv) {
    if (picDiv) {
      pic.default = picDiv.getAttribute('height') === 'auto';
      pic.url = picDiv.getAttribute('src');
      if (!pic.default) {
        if (picDiv.getAttribute('style')) {
          pic.width = ~~picDiv.style.width.replace('px', '');
          pic.height = ~~picDiv.style.height.replace('px', '');
        } else {
          pic.width = ~~picDiv.getAttribute('width').replace('px', '');
          pic.height = ~~picDiv.getAttribute('height').replace('px', '');
        }
      }
    } else {
      pic.default = svgDiv.style.height === 'auto';
      pic.url = svgDiv.querySelector('svg')?.getAttribute('data-src');
      if (!pic.default) {
        pic.width = ~~svgDiv.style.width.replace('px', '');
        pic.height = ~~svgDiv.style.height.replace('px', '');
      }
      pic.svg = svgDiv.innerHTML;
    }
  }
  return pic;
}

export function getPicDomStr(options?: PicOptions): string {
  if (!options || !options.url) return '';

  const width = options.default ? '100%' : options.width + 'px';
  const height = options.default ? 'auto' : options.height + 'px';

  let picDomStr = options.svg
    ? `<div class='question-svg-container' style='width: ${width}; height: ${height}'>${options.svg}</div>`
    : `<img src="${options.url}" width="${width}" height="${height}" />`;

  return picDomStr;
}
