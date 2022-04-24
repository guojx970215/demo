import en from "./translations/en.json";
import zh from "./translations/zh.json";

const langs = {
  en,
  zh
};



const defaultState = {};

const ACT_NAME_LOAD_TRANS = "LOAD_TRANS";



export const actLoadTrans = lang => ({
  type: ACT_NAME_LOAD_TRANS,
  payload: lang
});


export const loadLanguage = function (lang = "en") {
  return langs[lang];
}


const translations = (state = defaultState, { type, payload }) => {
  switch (type) {
    case ACT_NAME_LOAD_TRANS:
      return payload;
    default:
      return state;
  }
};

export default translations;

