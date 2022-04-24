const ns = 'music';
const defaultState = {
  isShow: false,
  setAll: false,
  audio:[],
  count: 0,
  showMusicPanel:false
};
export const musicActionNames = {
  ACT_NAME_ADD_MUSIC: `${ns}-SET_ADD_MUSIC`,
  ACT_NAME_SET_MUSIC_LIST: `${ns}-SET_MUSIC_LIST`,
  ACT_NAME_SHOW_MUSIC_DIALOG: `${ns}-SHOW_MUSIC_DIALOG`,
  ACT_NAME_SET_MUSIC_CONFIG:  `${ns}-SET_MUSIC_CONFIG`,
  ACT_NAME_SET_SHOW_MUSIC_PANEL: `${ns}-SHOW_MUSIC_PANEL`,
};

const musicList = (state = defaultState, { type, payload }) => {
  switch (type) {
    case musicActionNames.ACT_NAME_SET_MUSIC_LIST:
      return {
        ...state,
        audio: payload.result ? payload.result.items : [],
        count: payload.result ? payload.result.total : 0
      };
      case musicActionNames.ACT_NAME_ADD_MUSIC:
        return {
          ...state,
          audio: payload || [],
        };
    case musicActionNames.ACT_NAME_SHOW_MUSIC_DIALOG:
      return {
        ...state,
        isShow: payload,
      }
    case musicActionNames.ACT_NAME_SET_SHOW_MUSIC_PANEL:
      console.log(1111);
      return {
        ...state,
        showMusicPanel:!state.showMusicPanel
      }
    default:
      return state;
  }
};

export const showMusicDialog = (flag) => ({
  type: musicActionNames.ACT_NAME_SHOW_MUSIC_DIALOG,
  payload:flag
})

export const showMusicPanel = () => ({
  type: musicActionNames.ACT_NAME_SET_SHOW_MUSIC_PANEL
});

export default musicList;
