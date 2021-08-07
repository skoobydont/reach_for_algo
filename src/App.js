import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import Nav from './components/NavComponent';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';

const App = () => {
  return (
    <Router>
      <Nav />
      <div className="App container-fluid">
        <Switch>
          <Route path="/profile" exact component={ProfilePage} />
          <Route path="/account" exact component={AccountPage} />
          <Route path="/:id" exact component={ProductPage} />
          <Route path="/" exact component={LandingPage} />
        </Switch>      
      </div>
    </Router>
  );
}

export default App;
