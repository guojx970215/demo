const ns = 'Ruler';
const defaultState = {
  flag: false
};

const ACT_NAME_SET_RULER = `${ns}-SET_RULER`;

const ruler = (state = defaultState, action) => {
  switch (action.type) {
    case ACT_NAME_SET_RULER:
      return {
        flag: !state.flag
      };

    default:
      return state;
  }
};

export const rulerChange = () => ({
  type: ACT_NAME_SET_RULER
});

export default ruler;
