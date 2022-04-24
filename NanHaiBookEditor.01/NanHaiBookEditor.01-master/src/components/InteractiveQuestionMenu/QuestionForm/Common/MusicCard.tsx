import { Icon } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import ModalList from '../../../AniDialog/musicCard';
import './PicCard.css';

interface MusicCardProps {
  audio?: string;
  setAudio: (audio: string) => void;
  trans: any;
  width?: number;
  style?: React.CSSProperties;
  placeholder?: string;
}

const MusicCard = (props: MusicCardProps) => {
  const {
    audio,
    setAudio,
    trans,
    width = 82,
    style = {},
    placeholder,
  } = props;
  const [previewVisible, setPreviewVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const audioRef = useRef(null);
  const selectAudio = (audio) => {
    setAudio(audio[0].url);
    setSettingVisible(false);
  };

  const deleteAudio = () => {
    setAudio('');
  };

  const toggleSetting = () => {
    setSettingVisible(!settingVisible);
  };

  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };

  useEffect(() => {
    if (!audioRef.current) return;

    if (previewVisible) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [previewVisible]);

  useEffect(() => {
    if (settingVisible) {
      setPreviewVisible(false);
    }
  }, [settingVisible]);

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
        {audio ? (
          <div className="pic-card-container preview-pic">
            <Icon
              type="sound"
              style={{ fontSize: 36 }}
              className="position-middle"
            />
            <div className="pic-card-cover">
              <div className="position-middle">
                {
                  <Icon
                    type={previewVisible ? 'pause-circle' : 'play-circle'}
                    onClick={togglePreview}
                  />
                }
                <Icon type="setting" onClick={toggleSetting} />
                <Icon type="delete" onClick={deleteAudio} />
              </div>
              <audio src={audio} ref={audioRef}></audio>
            </div>
          </div>
        ) : (
          <div className="pic-card-container" onClick={toggleSetting}>
            <span>
              <Icon type="plus" /> <br /> {placeholder || trans.AddQuestionForm.addMusic}
            </span>
          </div>
        )}

        <ModalList
          visible={settingVisible}
          onOk={selectAudio}
          onCancel={toggleSetting}
          onEffect={audio}
        ></ModalList>
      </div>
    </>
  );
};

export default MusicCard;
