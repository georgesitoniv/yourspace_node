import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import LoginRequired from './components/_hoc/loginRequired';
import AnonymousRequired from './components/_hoc/anonymousRequired';

const Routes = (props) => {
  return (
    <BrowserRouter> 
      <Switch>
        <Route path='/dashboard' component={LoginRequired(Dashboard)}/>
        <Route exact path='/' component={AnonymousRequired(Home)}/>
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;