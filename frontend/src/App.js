import React from 'react';
import './App.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPwPage from './pages/ForgotPwPage';
import TransferPage from './pages/TransferPage';
import ResetPwPage from './pages/ResetPwPage';
import EditUserAccountPage from './pages/EditUserAccountPage';
import UserAccountPage from './pages/UserAccountPage';
import VerificationPage from './pages/VerificationPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Router>
      <Switch>
      <Route path="/history">
          <HistoryPage />
        </Route>
      <Route path="/edit-profile">
          <EditUserAccountPage />
        </Route>
      <Route path="/profile">
          <UserAccountPage />
        </Route>
      <Route path="/transfer">
            <TransferPage />
        </Route>
        <Route path="/account">
          <AccountPage />
        </Route>
        <Route path="/register">
          <RegisterPage />
        </Route>
        <Route path ="/forgotpw">
          <ForgotPwPage />
        </Route>
        <Route path = "/resetpw">
          <ResetPwPage /> 
        </Route>
        <Route path = "/verification">
          <VerificationPage />
        </Route>
        <Route path="/">
          <LoginPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
