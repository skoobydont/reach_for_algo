import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import './App.css';
import MainTheme from './components/Theme';
import Nav from './components/NavComponent';
import Footer from './components/FooterComponent';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';

const App = () => {
  return (
    <MainTheme>
      <Router>
        <Nav />
        <div className="App container-fluid">
          <Switch>
            <Route path="/profile" exact component={ProfilePage} />
            <Route path="/account" exact component={AccountPage} />
            <Route path="/property/:id" exact component={ProductPage} />
            <Route path="/reach_for_algo" exact component={LandingPage} />
          </Switch>      
        </div>
        <Footer />
      </Router>
    </MainTheme>
  );
}

export default App;
