import React from 'react';
import {render} from 'react-dom';
import {App} from './App';

function init() {
  render(<App />, document.getElementById('root'));
}

function ready() {
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
}

ready();
