import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootSaga from './sagas';

import authStatus from './auth/auth';
import bookPages from './bookPages/bookPages';
import zoomLevel from './zoomLevel/zoomLevel';
import userColor from './userColor/userColor';
import trans from '../i18n';
import ruler from './ruler/ruler';
import grid from './grid/grid';
import imageList from './imageList/imageList';
import music from './music/music';
import ui from './ui/ui';
import slider from './slideBar/slider';

const rootReducer = combineReducers({
	authStatus,
	trans,
	bookPages,
	zoomLevel,
	userColor,
	ruler,
	grid,
	imageList,
    music,
	ui,
    slider
});

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers =
	typeof window === 'object' && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
		? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({})
		: compose;
const enhancer = composeEnhancers(
	applyMiddleware(sagaMiddleware)
	/* other store enhancers if any */
);

const store = createStore(rootReducer, enhancer);
sagaMiddleware.run(rootSaga);

export default store;
