/* global AlgoSigner */
import React, { useState, useCallback, useRef } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import algosdk from 'algosdk';
import * as reach from '@reach-sh/stdlib/ALGO';

import './App.css';
import MainTheme from './components/Theme';
import Nav from './components/NavComponent';
import Footer from './components/FooterComponent';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';
/** Misc Globals */
const testAppId = 13793863;
/**
 * Well this seemed to have gotten updated a bit.
 *  with custom rendering propd pages for user mngmt
 * @returns {Component}
 */
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

  const algoSignerInstalled = useRef();
  const algoAccount = useRef();
  const algoParams = useRef();
  const algoGlobal = useRef();
  console.log('the accoutn', algoAccount.current);
  console.log('some params', algoParams.current);
  console.log('some gobolabl ', algoGlobal.current);
  // Begin AlgoSigner Helper Methods
  const getAlgoSignerInstalled = useCallback(() => {
    return Boolean(typeof AlgoSigner !== 'undefined');
  }, []);
  const getAccounts = useCallback(async () => {
    await AlgoSigner.connect({
      ledger: 'TestNet'
    });
    const accts = await AlgoSigner.accounts({
      ledger: 'TestNet'
    });
    return JSON.stringify(accts, null, 2);
  }, []);
  const getParams = useCallback(async () => {
    try {
      const r = await AlgoSigner.algod({
        ledger: 'TestNet',
        path: `/v2/transactions/params`
      });
      return JSON.stringify(r, null, 2);
    } catch (e) {
      console.error(e);
      return JSON.stringify(e, null, 2);
    }
  }, []);
  const getAppGlobalState = useCallback(async () => {
    try {
      const r = await AlgoSigner.indexer({
        ledger: 'TestNet',
        path: `/v2/applications/${testAppId}`
      });
      return JSON.stringify(r, null, 2);
    } catch (e) {
      console.error(e);
      return JSON.stringify(e, null, 2);
    }
  }, []);
  // End AlgoSigner Helper Methods
  
  const handleAlgoSignerInstalled = async () => {
    setRefresh(true);
    algoSignerInstalled.current = await getAlgoSignerInstalled();
    setRefresh(false);
  }
  
  const handleAlgoAccount = async () => {
    setRefresh(true);
    algoAccount.current = await getAccounts();
    setRefresh(false);
  }

  const handleAlgoParams = async () => {
    setRefresh(true);
    algoParams.current = await getParams();
    setRefresh(false);
  }

  const handleAppGlobalState = async () => {
    setRefresh(true);
    algoGlobal.current = await getAppGlobalState();
    setRefresh(false);
  }
  // End Button Handlers
  // Begin SDK Setup
  const algodServer = `${process.env.REACT_APP_ALGOD_SERVER_URL}`
  const indexerServer = `${process.env.REACT_APP_INDEXER_URL}`
  const token = { 'X-API-Key': `${process.env.REACT_APP_PURESTAKE_API_KEY}` }
  const port = '';
  // TODO: incorporate creating asa & indexing assets
  // ie https://purestake.github.io/algosigner-dapp-example/
  const algodClient = new algosdk.Algodv2(token, algodServer, port);
  const indexerClient = new algosdk.Indexer(token, indexerServer, port);

  // BE CAREFUL ABOUT RE-RENDER CALL QTY
  // MAY END UP WITH 429: TOO MANY REQUESTS
  
  // algodClient.status().do()
  //   .then(d => { 
  //     console.log('health check ', d);
  //   })
  //   .catch(e => { 
  //     console.error(e); 
  //   });
  // indexerClient.makeHealthCheck().do()
  // .then(d => { 
  //   console.log('health check indexer ', d);
  // })
  // .catch(e => { 
  //   console.error(e); 
  // });
  // End SDK Setup

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
                  algoSignerInstalled={algoSignerInstalled}
                  handleAlgoSignerInstalled={handleAlgoSignerInstalled}
                  algoAccount={algoAccount}
                  handleAlgoAccount={handleAlgoAccount}
                  algoParams={algoParams}
                  handleAlgoParams={handleAlgoParams}
                  algoGlobal={algoGlobal}
                  handleAppGlobalState={handleAppGlobalState}
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
