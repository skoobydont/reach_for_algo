
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
  
  const getAssetInformationByID = async (id) => {
    const assetInfo = await indexerClient.lookupAssetByID(id).do();
    console.log('some asset info', assetInfo);
    return assetInfo;  
  }

  const getAccountInformationByID = async (id) => {
    const accountInfo = await indexerClient.lookupAccountByID(id).do();
    console.log('the id: ', id);
    console.log('the account info', accountInfo);
    return accountInfo;
  }

  const getTransactionParams = async () => {
    try {
      return await algodClient.getTransactionParams().do();
    } catch (e) {
      console.error(e);
    }
  }
  // End Button Handlers
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
