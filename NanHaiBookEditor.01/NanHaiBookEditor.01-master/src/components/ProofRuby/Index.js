import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { actSetElementContent } from '../../store/bookPages/actions';
import Api from '../../api/bookApi';
import { Modal, Input, message, Select, Button, Divider } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
import '../ProofRuby/Index.css';
import { set } from 'immutable';

const InsertPinyinTradi = (props) => {
  const [pinyin, setPinyin] = useState([]);
  const [tradi, setTradi] = useState([]);
  const [simp, setSimp] = useState([]);

  const [isRead, setIsRead] = useState(false);
  const [group, setGroup] = useState(false);
  const [words, setWords] = useState([]);
  const [selectWords, setSelectWords] = useState(undefined);

  useEffect(() => {
    if (props.visible) {
      const div = document.createElement('div');
      div.innerHTML = props.element.content[0].value;

      // 判断是否为题组
      if (div.querySelector('.questions-group')) {
        setGroup(true);
        const questions = div.getElementsByClassName('question-container');
        let allSimp = [],
          allTradi = [],
          allPinyin = [];

        for (let i = 0; i < questions.length; i++) {
          const simpNodes = questions[i].querySelectorAll('.simp-p rb');
          const pinyinNodes = questions[i].querySelectorAll('.simp-p rt');
          const tradNodes = questions[i].querySelectorAll('.trad-p rb');

          if (simpNodes.length === 0) {
            message.warning('暂无文本', 3);
            return;
          }

          let newPinyin = [],
            newTradi = [],
            newSimp = [];

          for (let i = 0; i < simpNodes.length; i++) {
            if (pinyinNodes[i].innerText) {
              newSimp.push(simpNodes[i].innerText);
              newPinyin.push(pinyinNodes[i].innerText);
              newTradi.push(tradNodes[i].innerText);
            }
          }

          allPinyin.push(newPinyin);
          allSimp.push(newSimp);
          allTradi.push(newTradi);
        }

        setPinyin(allPinyin);
        setTradi(allTradi);
        setSimp(allSimp);

        return;
      }

      const simpWords = div.querySelectorAll('.simp-p .words');

      // 判断是否为读音文本
      if (simpWords[0]) {
        setIsRead(true);

        let newWords = [];
        const tradWords = div.querySelectorAll('.trad-p .words');

        for (let i = 0; i < simpWords.length; i++) {
          let option = { index: i, simp: '', trad: '', text: '' };
          option.simp = simpWords[i].innerHTML;
          option.trad = tradWords[i].innerHTML;
          simpWords[i].innerHTML = simpWords[i].innerHTML.replace(
            /<rt>.*?<\/rt>/g,
            ''
          );
          option.text = simpWords[i].innerText;
          newWords.push(option);
        }
        setWords(newWords);
      } else {
        setIsRead(false);

        const simpNodes = div.querySelectorAll('.simp-p rb');
        const pinyinNodes = div.querySelectorAll('.simp-p rt');
        const tradNodes = div.querySelectorAll('.trad-p rb');

        if (simpNodes.length === 0) {
          message.warning('暂无文本', 3);
          return;
        }

        let newPinyin = [];
        let newTradi = [];
        let newSimp = [];
        for (let i = 0; i < simpNodes.length; i++) {
          if (pinyinNodes[i].innerText) {
            newSimp.push(simpNodes[i].innerText);
            newPinyin.push(pinyinNodes[i].innerText);
            newTradi.push(tradNodes[i].innerText);
          }
        }
        setPinyin(newPinyin);
        setTradi(newTradi);
        setSimp(newSimp);
      }
    } else {
      setPinyin([]);
      setTradi([]);
      setSimp([]);
      setWords([]);
      setSelectWords(undefined);
    }
  }, [props.visible]);

  const getSelection = (index, idx) => {
    if (idx || idx === 0) {
      let pyTa = document.getElementById(`edit-ruby-pinyin-${idx}`);
      let startIndex = [...pinyin[idx]].slice(0, index).join('_');
      index === 0
        ? (startIndex = startIndex.length)
        : (startIndex = startIndex.length + 1);
      if (pyTa.selectionEnd === startIndex + pinyin[idx][index].length) {
        pyTa.selectionStart = 0;
        pyTa.selectionEnd = 0;
        const tdTa = document.getElementById(`edit-ruby-tradi-${idx}`);

        startIndex = [...tradi[idx]].slice(0, index).join('_');
        index === 0
          ? (startIndex = startIndex.length)
          : (startIndex = startIndex.length + 1);

        tdTa.selectionStart = startIndex;
        tdTa.selectionEnd = startIndex + tradi[idx][index].length;
        tdTa.focus();
      } else {
        pyTa.selectionStart = startIndex;
        pyTa.selectionEnd = startIndex + pinyin[idx][index].length;
        pyTa.focus();
      }
    } else {
      let pyTa = document.getElementById('edit-ruby-pinyin');
      let startIndex = [...pinyin].slice(0, index).join('_');
      index === 0
        ? (startIndex = startIndex.length)
        : (startIndex = startIndex.length + 1);
      if (pyTa.selectionEnd === startIndex + pinyin[index].length) {
        pyTa.selectionStart = 0;
        pyTa.selectionEnd = 0;
        const tdTa = document.getElementById('edit-ruby-tradi');

        startIndex = [...tradi].slice(0, index).join('_');
        index === 0
          ? (startIndex = startIndex.length)
          : (startIndex = startIndex.length + 1);

        tdTa.selectionStart = startIndex;
        tdTa.selectionEnd = startIndex + tradi[index].length;
        tdTa.focus();
      } else {
        pyTa.selectionStart = startIndex;
        pyTa.selectionEnd = startIndex + pinyin[index].length;
        pyTa.focus();
      }
    }
  };

  const submitChange = () => {
    if (isRead) {
      if (simp.length !== pinyin.length && pinyin.length !== tradi.length) {
        message.error('请检查文本是否位数正确');
        return;
      }

      let simpHtml = '';
      let tradHtml = '';

      for (let i = 0; i < simp.length; i++) {
        if (pinyin[i] !== simp[i] && pinyin[i] !== tradi[i]) {
          simpHtml =
            simpHtml + `<ruby><rb>${simp[i]}</rb><rt>${pinyin[i]}</rt></ruby>`;
          tradHtml =
            tradHtml + `<ruby><rb>${tradi[i]}</rb><rt>${pinyin[i]}</rt></ruby>`;
        } else {
          simpHtml = simpHtml + simp[i];
          tradHtml = tradHtml + tradi[i];
        }
      }

      let newWords = words;
      newWords[selectWords].simp = simpHtml;
      newWords[selectWords].trad = tradHtml;
      newWords[selectWords].text = simp.join('');

      const div = document.createElement('div');
      div.innerHTML = props.element.content[0].value;
      const simpEles = div.querySelectorAll('.simp-p .words');
      const tradEles = div.querySelectorAll('.trad-p .words');

      for (let i = 0; i < simpEles.length; i++) {
        simpEles[i].innerHTML = newWords[i].simp;
        tradEles[i].innerHTML = newWords[i].trad;
      }

      let content = props.element.content;
      content[0].value = div.innerHTML;

      props.actSetElementContent(content, props.element.id);
      props.onCancel();

      return;
    }

    // 非读音文本
    if (tradi.length !== simp.length || pinyin.length !== simp.length) {
      message.error("Pinyin or Tradi dosen't match with simp!");
    } else {
      if (group) {
        let flag = false;
        simp.forEach((value, index) => {
          if (
            value.length !== tradi[index].length ||
            value.length !== pinyin[index].length
          ) {
            message.error("Pinyin or Tradi dosen't match with simp!");
            flag = true;
          }
        });

        if (flag) {
          return;
        }
      }

      const div = document.createElement('div');
      div.innerHTML = props.element.content[0].value;
      const pinyinNodes = div.querySelectorAll('.simp-p rt');
      const tradNodes = div.querySelectorAll('.trad-p rb');
      const tPinyinNodes = div.querySelectorAll('.trad-p rt');

      const correction = [];

      let flatSimp = simp.flat();
      let flatPinyin = pinyin.flat();
      let flatTradi = tradi.flat();

      let newPY = [],
        newTD = [],
        newTP = [];

      for (let i = 0; i < tradNodes.length; i++) {
        if (pinyinNodes[i].innerText) {
          newPY.push(pinyinNodes[i]);
          newTD.push(tradNodes[i]);
          newTP.push(tPinyinNodes[i]);
        }
      }

      for (let i = 0; i < flatSimp.length; i++) {
        if (
          newPY[i].innerText !== flatPinyin[i] ||
          newTD[i].innerText !== flatTradi[i]
        ) {
          newPY[i].innerText = flatPinyin[i];
          newTD[i].innerText = flatTradi[i];
          newTP[i].innerText = flatPinyin[i];

          // 上传记录
          if (!isRead) {
            correction.push({
              simplified: [flatSimp[i]],
              traditional: [flatTradi[i]],
              pinyin: [flatPinyin[i]],
            });
          }
        }
      }

      let content = props.element.content;
      content[0].value = div.innerHTML;

      correction.length !== 0 && Api.errorCorrection(correction);
      props.actSetElementContent(content, props.element.id);
      props.onCancel();
    }
  };

  const changeSelect = (value) => {
    if (words.length === 0 || selectWords === undefined) {
      setSelectWords(value);
      return;
    }

    if (simp.length !== pinyin.length && pinyin.length !== tradi.length) {
      message.error('请检查文本是否位数正确');
      return;
    }

    let simpHtml = '';
    let tradHtml = '';

    for (let i = 0; i < simp.length; i++) {
      if (pinyin[i] !== simp[i]) {
        simpHtml =
          simpHtml + `<ruby><rb>${simp[i]}</rb><rt>${pinyin[i]}</rt></ruby>`;
        tradHtml =
          tradHtml + `<ruby><rb>${tradi[i]}</rb><rt>${pinyin[i]}</rt></ruby>`;
      } else {
        simpHtml = simpHtml + simp[i];
        tradHtml = tradHtml + tradi[i];
      }
    }

    let newWords = words;
    newWords[selectWords].simp = simpHtml;
    newWords[selectWords].trad = tradHtml;
    newWords[selectWords].text = simp.join('');

    setWords(newWords);
    setSelectWords(value);
  };

  useEffect(() => {
    if (selectWords !== undefined) {
      const simpDiv = document.createElement('div');
      simpDiv.innerHTML = words[selectWords].simp;
      const tradDiv = document.createElement('div');
      tradDiv.innerHTML = words[selectWords].trad;

      const simpEles = simpDiv.getElementsByTagName('rb');
      const pinyinEles = simpDiv.getElementsByTagName('rt');
      const tradEles = tradDiv.getElementsByTagName('rb');

      // 全部文本
      const allSimpDiv = document.createElement('div');
      allSimpDiv.innerHTML = words[selectWords].simp.replace(
        /<rt>.*?<\/rt>/g,
        ''
      );
      let allText = allSimpDiv.innerText;
      let allPinyin = allSimpDiv.innerText;
      let allTradi = allSimpDiv.innerText;

      let newPinyin = [],
        newTradi = [],
        newSimp = [];

      for (let i = 0; i < simpEles.length; i++) {
        // newSimp.push(simpEles[i].innerText);
        // newPinyin.push(pinyinEles[i].innerText);
        // newTradi.push(tradEles[i].innerText);
        let newReg = new RegExp(`(?!_)${simpEles[i].innerText}(?!_)`);
        allText = allText.replace(newReg, `_${simpEles[i].innerText}_`);
        allPinyin = allPinyin.replace(newReg, `_${pinyinEles[i].innerText}_`);
        allTradi = allTradi.replace(newReg, `_${tradEles[i].innerText}_`);
      }
      newSimp = allText.split('_');
      newTradi = allTradi.split('_');
      newPinyin = allPinyin.split('_');

      newSimp = newSimp.filter((value) => value.length !== 0);
      newTradi = newTradi.filter((value) => value.length !== 0);
      newPinyin = newPinyin.filter((value) => value.length !== 0);
      // newPinyin.forEach((value, index) => {
      //   if (value === newSimp[index]) {
      //     newPinyin[index] = " ";
      //   }
      // })

      setPinyin(newPinyin);
      setSimp(newSimp);
      setTradi(newTradi);
    }
  }, [selectWords]);

  return (
    <Modal
      visible={props.visible}
      width="800px"
      title={props.trans.AddQuestionForm.pinyinTitle}
      destroyOnClose={true}
      maskClosable={false}
      onCancel={props.onCancel}
      onOk={() => submitChange()}
    >
      <div className="pinyin-input-container" style={{ minHeight: 300 }}>
        {isRead ? (
          <div>
            <span>选择句子: </span>
            <Select
              style={{ width: 500 }}
              value={selectWords}
              onChange={(value) => changeSelect(value)}
            >
              {words.map((value) => (
                <Option value={value.index} key={value.index}>
                  {value.text}
                </Option>
              ))}
            </Select>

            {selectWords !== undefined && (
              <div>
                <TextArea
                  style={{ width: '100%', margin: '16px 0' }}
                  rows={2}
                  value={pinyin.join('_')}
                  onChange={(e) => {
                    setPinyin(e.target.value.split('_'));
                  }}
                  id="edit-ruby-pinyin"
                />
                <TextArea
                  style={{ width: '100%', margin: '16px 0' }}
                  rows={2}
                  value={simp.join('_')}
                  onChange={(e) => {
                    setSimp(e.target.value.split('_'));
                  }}
                  id="edit-ruby-pinyin"
                />
                <TextArea
                  style={{ width: '100%', margin: '16px 0' }}
                  rows={2}
                  value={tradi.join('_')}
                  onChange={(e) => {
                    setTradi(e.target.value.split('_'));
                  }}
                  id="edit-ruby-pinyin"
                />
              </div>
            )}
          </div>
        ) : group ? (
          <div>
            {simp.map((value, index) => (
              <div key={index}>
                <TextArea
                  style={{ width: '100%' }}
                  rows={2}
                  value={pinyin[index].join('_')}
                  onChange={(e) => {
                    let newPinyin = [...pinyin];
                    newPinyin[index] = e.target.value.split('_');
                    setPinyin(newPinyin);
                  }}
                  id={`edit-ruby-pinyin-${index}`}
                />

                <div style={{ margin: '16px 0' }}>
                  {value.map((val, idx) => (
                    <span
                      key={idx}
                      className="simp-text-span"
                      onClick={() => getSelection(idx, index)}
                    >
                      {val}
                    </span>
                  ))}
                </div>

                <TextArea
                  style={{ width: '100%' }}
                  rows={2}
                  value={tradi[index].join('_')}
                  onChange={(e) => {
                    let newTradi = [...tradi];
                    newTradi[index] = e.target.value.split('_');
                    setTradi(newTradi);
                  }}
                  placeholder={props.trans.AddQuestionForm.tradiPH}
                  id={`edit-ruby-tradi-${index}`}
                />

                {index !== simp.length - 1 ? <Divider /> : ''}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <TextArea
              style={{ width: '100%' }}
              rows={2}
              value={pinyin.join('_')}
              onChange={(e) => {
                setPinyin(e.target.value.split('_'));
              }}
              id="edit-ruby-pinyin"
            />
            <div style={{ margin: '16px 0' }}>
              {simp.map((value, index) => (
                <span
                  key={index}
                  className="simp-text-span"
                  onClick={() => getSelection(index)}
                >
                  {value}
                </span>
              ))}
            </div>
            <TextArea
              style={{ width: '100%' }}
              rows={2}
              value={tradi.join('_')}
              onChange={(e) => {
                setTradi(e.target.value.split('_'));
              }}
              placeholder={props.trans.AddQuestionForm.tradiPH}
              id="edit-ruby-tradi"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
const mapStateToProps = ({ trans, bookPages }) => ({
  trans,
  bookPages,
});
const mapDispatchToProps = (dispatch) => ({
  actSetElementContent: (content, elementId) => {
    dispatch(actSetElementContent(content, elementId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InsertPinyinTradi);
