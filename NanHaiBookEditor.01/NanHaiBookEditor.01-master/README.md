## useful scripts

In the project directory, you can run:

### `npm install`
Installing all required packages. Normally only need to run it once after clone the project to local.

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run api`
Runs the mock api from `mockapi` folder
Mock api runs on [http://localhost:3100](http://localhost:3100)
Created a proxy to forwarding requests to port 3100.

### `npm run dev`
It runs api and start at same time

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run test:debug`

Run Unit Tests in debug mode.
After the test runner stared, open chrome put `about:inspect` in the adress bar to start debugging. 
See the section about [debugging tests] (https://facebook.github.io/create-react-app/docs/debugging-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `serve -s build`
Start a node web server which serves file from build folder
Need to install `serve` before using it. By run `npm serve -g`

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


## Packages used for sublime text

### NodeJS packages installed globally 

babel-eslint 
eslint
eslint-plugin-react
prettier

### Sublime Text packages
Babel
JsPrettier
SublimeLinter
SublimeLinter-eslint
tern_for_sublime

## i18n
Created a simple i18n solution base on [this](https://alligator.io/react/create-i18n-module/).

## structrue of book pages store
```javascript
const examplePageObject = {
	id: nanoid(24), //unique id, for easy access
	elements: [
		{}, //element object 1
		{}, //element object 2
		{} //element object 3
	],
	index: 0 // order in the book
};

const exampleBookObject = {
	id: nanoid(24), //unique id, for easy access
	pages: [
		{}, //page 1 ref:examplePageObject
		{}, //page 2 ref:examplePageObject
		{} //page 3 ref:examplePageObject
	]
};
const exampleStore = {
	past: [ //history for undo
		{}, //past pages array 1 ref:exampleBookObject
		{} //past pages array 2 ref:exampleBookObject
	],
	present: {}, //present pages array ref:exampleBookObject
	future: [ // history for redo
		{}, // future pages array 1 ref:exampleBookObject
		{} // future pages array 2 ref:exampleBookObject
	]
};
```

### This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). So we can search online resources if running into any pipeline problems.


### push to github