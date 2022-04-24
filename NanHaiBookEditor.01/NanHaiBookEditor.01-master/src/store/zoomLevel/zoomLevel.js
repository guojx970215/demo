const ns = 'Zooming';

const defaultState = {
  zoomValue: 100,
  flag: true
};

const scaleMax = 200;
const scaleMin = 40;
const scale = 20;

const ACT_NAME_SET_ZOOM_IN = `${ns}-SET_ZOOM_IN`;

const ACT_NAME_SET_ZOOM_OUT = `${ns}-SET_ZOOM_OUT`;

const zoomStatus = (state = defaultState, action) => {
  switch (action.type) {
    case ACT_NAME_SET_ZOOM_IN:
      if (state.zoomValue !== scaleMax) {
        state.zoomValue += scale;
      }
      return {
        flag: true,
        zoomValue: state.zoomValue
      };
    case ACT_NAME_SET_ZOOM_OUT:
      if (state.zoomValue !== scaleMin) {
        state.zoomValue -= scale;
      }
      return {
        flag: true,
        zoomValue: state.zoomValue
      };
    default:
      return state;
  }
};

export const zoomIn = () => ({
  type: ACT_NAME_SET_ZOOM_IN
});

export const zoomOut = () => ({
  type: ACT_NAME_SET_ZOOM_OUT
});

export default zoomStatus;
