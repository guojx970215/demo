import { connect } from 'react-redux';
import {
  actSetElementSize,
  actSetElementPos,
  actSelectElement,
  actSetTextHtml,
  actReplaceTempParagraph,
  actSetElementAni,
  actSetElementTrigger,
  actEditChoiceQuestion,
  actSetQuestionsGroup,
  deleteElement,
  actShowElementStylePanel,
  actSetElementContent
} from '../../store/bookPages/actions';

import RndContainer from './RndContainer';

const mapStateToProps = ({ trans, slider, bookPages }) => ({
  trans,
  slider,
  bookPages
});
const mapDispatchToProps = dispatch => ({
  deleteElement: id => {
    dispatch(deleteElement(id));
  },
  actSetElementContent: (content, elementId) => {
    dispatch(actSetElementContent(content, elementId))
  },
  actSetElementSize: (size, id) => {
    dispatch(actSetElementSize(size, id));
  },
  actSetElementPos: (pos, id) => {
    dispatch(actSetElementPos(pos, id));
  },
  actSetElementAni: (ani, id) => {
    dispatch(actSetElementAni(ani, id));
  },
  actSetElementTrigger: (ani, id) => {
    dispatch(actSetElementTrigger(ani, id));
  },
  actSelectElement: id => {
    dispatch(actSelectElement(id));
  },
  actSetTextHtml: (html, id, background) => {
    let res = actSetTextHtml(html, id, undefined, background);
    dispatch(res);
  },
  actReplaceTempParagraph: (oldHtml, replaceHtml, id, config) => {
    dispatch(actReplaceTempParagraph(oldHtml, replaceHtml, id, config));
  },
  actEditChoiceQuestion: (content, elementId) => {
    dispatch(actEditChoiceQuestion(content, elementId));
  },
  setQuestionsGroup: (content, deleteQ, deleteId, addQ) => {
    dispatch(actSetQuestionsGroup(content, deleteQ, deleteId, addQ));
  },
  actShowElementStylePanel: element => {
    dispatch(actShowElementStylePanel(element));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RndContainer);
