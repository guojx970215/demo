const ns = 'UI';

const defaultState = {
	globalBackgroundImage: ''
};

const ACT_NAME_SET_GLOBAL_BACKGROUND_IMAGE = `${ns}-SET_GLOBAL_BACKGROUND_IMAGE`;
const ACT_NAME_SET_COPY_STYLE = `${ns}-SET_COPY_STYLE`;
const ACT_NAME_SET_COPY_ANI = `${ns}-SET_COPY_ANI`;
const ACT_NAME_SET_COPY_TRI = `${ns}-SET_COPY_TRI`;

const uiStatus = (state = defaultState, action) => {
	let backgroundImage = state.globalBackgroundImage;
	switch (action.type) {
		case ACT_NAME_SET_GLOBAL_BACKGROUND_IMAGE:
			if (state.globalBackgroundImage !== action.payload) {
				backgroundImage = action.payload;
			}
			return {
				...state,
				globalBackgroundImage: backgroundImage
			};

		case ACT_NAME_SET_COPY_STYLE:
			return {
				...state,
				copyStyle: action.style
			};

			case ACT_NAME_SET_COPY_ANI:
			return {
				...state,
				copyAni: action.ani
			};

			case ACT_NAME_SET_COPY_TRI:
			return {
				...state,
				copyTri: action.tri
			};
		default:
			return {...state};
	}
};

export const actSetGlobalBackgroundImage = base64Url => ({
	type: ACT_NAME_SET_GLOBAL_BACKGROUND_IMAGE,
	payload: base64Url
});

export const actSetCopyStyle = style => ({
	type: ACT_NAME_SET_COPY_STYLE,
	style
});

export const actSetCopyAni = ani => ({
	type: ACT_NAME_SET_COPY_ANI,
	ani
});

export const actSetCopyTri = tri => ({
	type: ACT_NAME_SET_COPY_TRI,
	tri
});

export default uiStatus;
