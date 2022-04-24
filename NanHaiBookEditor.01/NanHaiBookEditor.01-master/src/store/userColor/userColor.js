

const defaultPureColorList = ['transparent', 'rgb(249, 110, 87)', 'rgb(95, 156, 239)', 'rgb(142, 201, 101)', 'rgb(71, 193, 168)', 'rgb(255, 255, 255)', 'rgb(160, 160, 160)', 'rgb(255, 129, 36)', 'rgb(166, 91, 203)', 'rgb(255, 202, 0)']
const defaultGraduatedColorList = [
  'linear-gradient(135deg, #FEB692 10%, #EA5455 100%)',
  'linear-gradient(135deg, #FEC163 10%, #DE4313 100%)',
  'linear-gradient(135deg, #FDEB71 10%, #F8D800 100%)',
  'linear-gradient(135deg, #81FBB8 10%, #28C76F 100%)',
  'linear-gradient(135deg, #90F7EC 10%, #32CCBC 100%)',
  'linear-gradient(135deg, #ABDCFF 10%, #0396FF 100%)',
  'linear-gradient(135deg, #CE9FFC 10%, #7367F0 100%)',
  'linear-gradient(to top, #fcc5e4 0%, #fda34b 15%, #ff7882 35%, #c8699e 52%, #7046aa 71%, #0c1db8 87%, #020f75 100%)',
  'linear-gradient(-225deg, #69EACB 0%, #EACCF8 48%, #6654F1 100%)',
  'linear-gradient(to top, #dfe9f3 0%, white 100%)'
]

const defaultState = {
  selectColor: {
    type: 0,
    color: 'transparent'
  },
  showPanel: false,
  pureColorList: [],
  graduatedColorList: []
};


const ACT_NAME_SET_SHOW_PANEL = `SET_SHOW_PANEL`;
const ACT_NAME_SET_ADD_PURE_COLOR = `SET_ADD_PURE_COLOR`;
const ACT_NAME_SET_RE_SET_COLOR = `SET_RE_SET_COLOR`;
const ACT_NAME_SET_COLOR = `SET_COLOR`
const ACT_NAME_DELETE_COLOR = `DELETE_COLOR`


const userColor = (state = defaultState, { type, payload }) => {
  switch (type) {
    case ACT_NAME_SET_SHOW_PANEL:
      return {
        ...state,
        showPanel: !state.showPanel,
        pureColorList: !state.pureColorList.length ? defaultPureColorList.concat(state.pureColorList) : state.pureColorList,
        graduatedColorList: !state.graduatedColorList.length ? defaultGraduatedColorList.concat(state.graduatedColorList) : state.graduatedColorList,
      };
    case ACT_NAME_SET_ADD_PURE_COLOR:
      if (payload.r) {
        let rgba = `rgba(${payload.r},${payload.g},${payload.b},${payload.a})`
        let copyarray = JSON.parse(JSON.stringify(state.pureColorList))
        copyarray.push(rgba)
        localStorage.setItem('pureColorList', JSON.stringify(copyarray))
        return {
          ...state,
          pureColorList: copyarray
        }
      } else {
        let copyarray = JSON.parse(JSON.stringify(state.graduatedColorList))
        copyarray.push(payload)
        localStorage.setItem('graduatedColorList', JSON.stringify(copyarray))
        return {
          ...state,
          graduatedColorList: copyarray
        }
      }
    case ACT_NAME_SET_RE_SET_COLOR:
      if (payload == 0) {
        localStorage.removeItem('pureColorList')
        return {
          ...state,
          pureColorList: defaultPureColorList
        }
      } else {
        localStorage.removeItem('graduatedColorList')
        return {
          ...state,
          graduatedColorList: defaultGraduatedColorList
        }
      }
    case ACT_NAME_SET_COLOR:
      return {
        ...state,
        showPanel: !showPanel,
        selectColor: payload
      }
    case ACT_NAME_DELETE_COLOR:
      if (payload.type == 0) {
        let copyarray = JSON.parse(JSON.stringify(state.pureColorList))
        let newColor = copyarray.filter((item, index) => {
          return index != payload.index
        })
        localStorage.setItem('pureColorList', JSON.stringify(newColor))
        return {
          ...state,
          pureColorList: newColor
        }
      } else {
        let copyarray = JSON.parse(JSON.stringify(state.graduatedColorList))
        let newColor = copyarray.filter((item, index) => {
          return index != payload.index
        })
        localStorage.setItem('graduatedColorList', JSON.stringify(newColor))
        return {
          ...state,
          graduatedColorList: newColor
        }
      }
    default:
      return state;
  }
};

export const showPanel = () => ({
  type: ACT_NAME_SET_SHOW_PANEL
});

export const addPureColor = (color) => ({
  type: ACT_NAME_SET_ADD_PURE_COLOR,
  payload: color
})

export const reSetColor = (type) => ({
  type: ACT_NAME_SET_RE_SET_COLOR,
  payload: type
})

export const setColor = (payload) => ({
  type: ACT_NAME_SET_COLOR,
  payload: payload
})

export const deleteColor = (payload) => ({
  type: ACT_NAME_DELETE_COLOR,
  payload: payload
})





export default userColor;
