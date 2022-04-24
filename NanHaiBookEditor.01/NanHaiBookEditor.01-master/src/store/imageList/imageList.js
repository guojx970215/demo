const ns = 'imageList';
const defaultState = {
  isShow: false,
  setAll: false,
  images: [],
  count: 0
};
export const imageActionNames = {
  ACT_NAME_GET_IMAGE_LIST: `${ns}-GET_IMAGE_LIST`,
  ACT_NAME_SET_DIALOG: `${ns}-SET_DIALOG`,
};

const imageList = (state = defaultState, { type, payload }) => {
  switch (type) {
    case imageActionNames.ACT_NAME_GET_IMAGE_LIST:
      return {
        ...state,
        images: payload.items,
        count: payload.total
      };
    case imageActionNames.ACT_NAME_SET_DIALOG:
      return {
        ...state,
        isShow: !state.isShow,
        setAll: payload
      }
    default:
      return state;
  }
};

export const actSetDialog = (setAll) => ({
  type: imageActionNames.ACT_NAME_SET_DIALOG,
  payload: setAll
})

/*export const actGetImageList = (imgList) => ({
  type: authActionNames.ACT_NAME_GET_IMAGE_LIST,
  payload: imgList
});*/

export default imageList;
