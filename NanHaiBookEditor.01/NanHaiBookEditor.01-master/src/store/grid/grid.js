const ns = 'Grid';
const defaultState = {
  flag: false
};

const ACT_NAME_SET_GRID = `${ns}-SET_GRID`;

const grid = (state = defaultState, action) => {
  switch (action.type) {
    case ACT_NAME_SET_GRID:
      return {
        flag: !state.flag
      };

    default:
      return state;
  }
};

export const gridChange = () => ({
  type: ACT_NAME_SET_GRID
});

export default grid;
