import React, { useRef, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import * as reach from '@reach-sh/stdlib/ALGO';

import './App.css';
import MainTheme from './components/Theme';
import Nav from './components/NavComponent';
import Footer from './components/FooterComponent';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';

const App = () => {
  
  const account = useRef();
  const balance = useRef();
  const fundAmount = useRef();
  const [refresh, setRefresh] = useState(false);
  // helpers
  /**
   * Fund Wallet With TestNet Algo
   * @async
   * @fires setRefresh
   */
   const fundWallet = async () => {
    setRefresh(true);
    const faucet = await reach.getFaucet();
    await reach.transfer(
      faucet,
      account.current,
      reach.parseCurrency(fundAmount.current),
    );
    await getBalance();
    setRefresh(false);
  }
  /**
   * Get Account
   * @async
   * @returns {Promise} set current account to result of reach.getDefaultAccount()
   */
  const getAccount = async () => account.current = await reach.getDefaultAccount();
  const getBalance = async () => {
    /**
     * balanceOf returns in microalgos
     */
    const rawBalance = await reach.balanceOf(account.current);
    /**
     * format microalgos to Algos & assign to current balance
     */
    balance.current = reach.formatCurrency(rawBalance, 4);
  }
  /**
   * Connect to Wallet
   * @async
   * @fires getAccount
   * @fires getBalance
   * @fires setRefresh
   */
  const connectWallet = async () => {
    await getAccount();
    setRefresh(true);
    await getBalance();
    setRefresh(false);
  }

  return (
    <MainTheme>
      <Router>
        <Nav />
        <div className="App container-fluid">
          <Switch>
            <Route
              path="/profile"
              exact
              render={(props) => (
                <ProfilePage
                  {...props}
                  account={account}
                  balance={balance}
                  fundAmount={fundAmount}
                  connectWallet={connectWallet}
                  fundWallet={fundWallet}
                  refresh={refresh}
                />
              )}
            />
            <Route
              path="/account"
              exact
              render={(props) => (
                <AccountPage
                  {...props}
                  user={account}
                />
              )}
            />
            <Route
              path="/property/:id"
              exact
              render={(props) => (
                <ProductPage
                  {...props}
                  user={account}
                />
              )}
            />
            <Route
              path="/reach_for_algo"
              exact
              render={(props) => (
                <LandingPage
                  {...props}
                  user={account}
                />
              )}
            />
          </Switch>      
        </div>
        <Footer />
      </Router>
    </MainTheme>
  );
}

export default App;
