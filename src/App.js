
import React, {
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import algosdk from 'algosdk';
// import * as reach from '@reach-sh/stdlib/ALGO';

// MUI
import LinearProgress from '@material-ui/core/LinearProgress';

import './App.css';
import MainTheme from './components/Theme';
import Nav from './components/NavComponent';
import Footer from './components/FooterComponent';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';
// Custom
import {
  getAlgoServer,
  getIndexerServer,
  getPureStakeAPIToken,
} from '../src/utilities/algo';
/**
 * Well this seemed to have gotten updated a bit.
 *  with custom rendering propd pages for user mngmt
 * @returns {Component}
 */
const App = () => {
  const [account, setAccount] = useState(null);
  const [ledger, setLedger] = useState('');
  const [algodServer, setAlgodServer] = useState('');
  const [indexerServer, setIndexerServer] = useState('');
  const [token, setToken] = useState({
    'X-API-KEY': '',
  });
  const port = '';

  const [algodClient, setAlgodClient] = useState(null);
  const [indexerClient, setIndexerClient] = useState(null);
  // Configure Algod + Indexer Servers, & API token values
  useEffect(() => {
    if (ledger?.length > 0) {
      if (algodServer?.length === 0) {
        setAlgodServer(getAlgoServer(ledger, process.env));
      }
      if (indexerServer?.length === 0) {
        setIndexerServer(getIndexerServer(ledger, process.env));
      }
      if (token['X-API-KEY']?.length === 0) {
        setToken({
          'X-API-KEY': getPureStakeAPIToken(ledger, process.env),
        });
      }
    }
  }, [ledger, algodServer, indexerServer, token]);
  // Configure & Instantiate Aglod + Indexer Clients
  useEffect(() => {
    if ((algodClient === null
      || algodClient === undefined)
      && String(algodServer)?.length > 0
    ) {
      setAlgodClient(new algosdk.Algodv2(token, algodServer, port));
    }
    if ((indexerClient === null
      || indexerClient === undefined)
      && String(indexerServer)?.length > 0
    ) {
      setIndexerClient(new algosdk.Indexer(token, indexerServer, port));
    }
  }, [algodClient, algodServer, indexerClient, indexerServer, token]);

  // Begin SDK Setup
  // const algodServer = `${getAlgoServer(ledger)}`
  // const indexerServer = `${getIndexerServer(ledger)}`
  // const token = { 'X-API-Key': `${getPureStakeAPIToken(ledger)}` }
  // TODO: incorporate creating asa & indexing assets
  // ie https://purestake.github.io/algosigner-dapp-example/
  // Only initialize if above is defined in env
  // if (algodServer?.length > 0 && indexerServer?.length > 0) {
  //   algodClient = new algosdk.Algodv2(token, algodServer, port);
  //   indexerClient = new algosdk.Indexer(token, indexerServer, port);
  // }
  const handleSetAccount = (info) => setAccount(info);
  /**
   * Get Asset Information by ID
   * @param {string | number} id assetId
   * @returns {Object} assetInformation
   */
  const getAssetInformationByID = async (id) => {
    const assetInfo = await indexerClient.lookupAssetByID(id).do();
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
  const handleSelectLedgerChange = (e) => {
    setLedger(e.target.value);
  };
  
  return (
    <MainTheme>
      <Router>
        <Nav
          user={account}
          ledger={ledger}
          handleSelectLedgerChange={handleSelectLedgerChange}
          handleGetAccountInfo={getAccountInformationByID}
          handleSetAccount={handleSetAccount}
          algodClient={algodClient}
          indexerClient={indexerClient}
        />
        {account !== null
          ? (
            <>
              <div className="App container-fluid">
                <Switch>
                  <Route
                    path="/profile"
                    exact
                    render={(props) => (
                      <ProfilePage
                        {...props}
                        account={account}
                        handleSetAccount={handleSetAccount}
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
                        handleSetAccount={handleSetAccount}
                        ledger={ledger}
                        setLedger={setLedger}
                      />
                    )}
                  />
                </Switch>      
              </div>
              <Footer />
            </>
          ) : null}
      </Router>
    </MainTheme>
  );
}

export default App;
