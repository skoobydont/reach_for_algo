
import React, { useState, useCallback, useRef } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import algosdk from 'algosdk';
// import * as reach from '@reach-sh/stdlib/ALGO';

import './App.css';
import MainTheme from './components/Theme';
import Nav from './components/NavComponent';
import Footer from './components/FooterComponent';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';
/**
 * Well this seemed to have gotten updated a bit.
 *  with custom rendering propd pages for user mngmt
 * @returns {Component}
 */
const App = () => {
  // Begin SDK Setup
  const algodServer = `${process.env.REACT_APP_ALGOD_SERVER_URL}`
  const indexerServer = `${process.env.REACT_APP_INDEXER_URL}`
  const token = { 'X-API-Key': `${process.env.REACT_APP_PURESTAKE_API_KEY}` }
  const port = '';
  // TODO: incorporate creating asa & indexing assets
  // ie https://purestake.github.io/algosigner-dapp-example/
  const algodClient = new algosdk.Algodv2(token, algodServer, port);
  const indexerClient = new algosdk.Indexer(token, indexerServer, port);

  const account = useRef();
  const ledger = useRef();
  /**
   * Set Account & Update Ref
   * @param {Object} info the account info object
   */
  const setAccount = (info) => {
    // console.log('account.current ', account.current);
    account.current = info;
  };
  const setLedger = (lgr) => {
    ledger.current = lgr;
  }
  /**
   * Get Asset Information by ID
   * @param {string | number} id assetId
   * @returns {Object} assetInformation
   */
  const getAssetInformationByID = async (id) => {
    const assetInfo = await indexerClient.lookupAssetByID(id).do();
    // console.log('some asset info', assetInfo);
    return assetInfo;  
  };
  /**
   * Get Account Information By Wallet Address
   * @param {string} id wallet address
   * @returns {Object} accountInformation
   */
  const getAccountInformationByID = async (id) => {
    const accountInfo = await indexerClient.lookupAccountByID(id).do();
    return accountInfo;
  };
  /**
   * Get Transaction Parameters
   * @async
   * @returns {Promise} algoClient.getTransactionParams().do()
   */
  const getTransactionParams = async () => {
    try {
      return await algodClient.getTransactionParams().do();
    } catch (e) {
      console.error(e);
    }
  };
  
  return (
    <MainTheme>
      <Router>
        <Nav user={account} />
        <div className="App container-fluid">
          <Switch>
            <Route
              path="/profile"
              exact
              render={(props) => (
                <ProfilePage
                  {...props}
                  account={account}
                  handleSetAccount={setAccount}
                  handleGetAccountInfo={getAccountInformationByID}
                  handleGetAssetInfo={getAssetInformationByID}
                  handleGetTransactionParams={getTransactionParams}
                  algosdk={algosdk}
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
                  handleGetAccountInfo={getAccountInformationByID}
                  handleGetAssetInfo={getAssetInformationByID}
                  handleGetTransactionParams={getTransactionParams}
                  algosdk={algosdk}
                  algodClient={algodClient}
                  handleSetAccount={setAccount}
                  ledger={ledger}
                  setLedger={setLedger}
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
