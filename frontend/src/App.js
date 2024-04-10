import React from 'react';
import './App.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import RegisterPage from './pages/RegisterPage';
import TransferPage from './pages/TransferPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/account">
          <AccountPage />
        </Route>
        <Route path="/register">
          <RegisterPage />
        </Route>
        <Route path="/">
          <LoginPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;