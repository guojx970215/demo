import React from 'react';
import {BookContainer} from '@pages/Book/BookContainer';
import {LoginContainer} from '@pages/Login/LoginPage';
import {MenuTop} from '@pages/MenuTop';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import './Var.css';

export const App = () => {
  return (
    <div className="app">
      <MenuTop />
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={LoginContainer}></Route>
          <Route path={['/book', '/book/:bookId']} component={BookContainer} exact></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};
