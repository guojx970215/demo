const ns = 'Slider';

const defaultState = {
    pinyin: true,
    simp: true,
    audio: true,
    show: true
};

const ACT_NAME_SET_PINYIN = `${ns}-SET_PINYIN`;
const ACT_NAME_SET_SIMP = `${ns}-SET_SIMP`;
const ACT_NAME_SET_AUDIO = `${ns}-SET_AUDIO`;
const ACT_NAME_HIDE = `${ns}-HIDE`;
const ACT_NAME_SHOW = `${ns}-SHOW`;
const ACT_NAME_TOGGLE = `${ns}-TOGGLE`;

const slider = (state = defaultState, action) => {
    switch (action.type) {
        case ACT_NAME_SET_PINYIN:
            return {
                ...state,
                pinyin: !state.pinyin
            };
        case ACT_NAME_SET_SIMP:
            return {
                ...state,
                simp: !state.simp,
            };
        case ACT_NAME_SET_AUDIO:
            return {
                ...state,
                audio: !state.audio
            };
        case ACT_NAME_HIDE:
            return {
                ...state,
                show: false
            };
        case ACT_NAME_SHOW:
            return {
                ...state,
                show: true
            };
        case ACT_NAME_TOGGLE:
            return {
                ...state,
                show: !state.show
            };
        default:
            return state;
    }
};

export const pinyinChange = () => ({
    type: ACT_NAME_SET_PINYIN
});

export const simpChange = () => ({
    type: ACT_NAME_SET_SIMP
});

export const audioChange = () => ({
    type: ACT_NAME_SET_AUDIO
});

export const actHideSlideBar = () => ({
    type: ACT_NAME_HIDE
});

export const actShowSlideBar = () => ({
    type: ACT_NAME_SHOW
});

export const actToggleSlideBar = () => ({
    type: ACT_NAME_TOGGLE
});


export default slider;
