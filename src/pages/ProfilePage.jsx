/* global AlgoSigner */
import React, { useState, useCallback, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const testAppId = 13793863;
/**
 * React Component displaying a title, a button doing some (AlgoSigner-related) actions
 * and a message with the result.
 *
 * https://github.com/PureStake/algosigner-dapp-example/blob/master/index.html#L251
 * 
 * @param buttonAction is a (potentially async) function called when clicking on the button
 *   and returning the result to be displayed
 */
 const ExampleAlgoSigner = ({
   setResult,
   title,
   buttonText,
   buttonAction,
}) => {
  const onClick = useCallback(async () => {
    const r = await buttonAction();
    setResult(r);
  }, [buttonAction, setResult]);

  return (
    <>
      <Typography variant="h2">{title}</Typography>
      <Button primary={true} onClick={onClick}>{buttonText}</Button>
    </>
  );
};
// The following components are all demonstrating some features of AlgoSigner

const CheckAlgoSigner = ({
  title,
  buttonText,
  result,
  setResult,
}) => {
  const action = useCallback(() => {
    setResult(Boolean(typeof AlgoSigner !== 'undefined'));
    return Boolean(typeof AlgoSigner !== 'undefined');
  }, [setResult]);

  return (
    <ExampleAlgoSigner
      title={title}
      buttonText={buttonText}
      buttonAction={action}
      result={result}
      setResult={setResult}
    />
  );
};
const GetAccounts = ({
  title,
  buttonText,
  result,
  setResult,
}) => {
  const action = useCallback(async () => {
    await AlgoSigner.connect({
      ledger: 'TestNet'
    });
    const accts = await AlgoSigner.accounts({
      ledger: 'TestNet'
    });
    return JSON.stringify(accts, null, 2);
  }, []);

  return (
    <ExampleAlgoSigner
      title={title}
      buttonText={buttonText}
      buttonAction={action}
      setResult={setResult}
    />
  );
};

const GetParams = ({
  title,
  buttonText,
  result,
  setResult,
}) => {
  const action = useCallback(async () => {
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

  return (
    <ExampleAlgoSigner
      title={title}
      buttonText={buttonText}
      buttonAction={action}
      setResult={setResult}
    />
  );
};

const GetAppGlobalState = ({
  title,
  buttonText,
  result,
  setResult,
}) => {
  const action = useCallback(async () => {
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

  return (
    <ExampleAlgoSigner
      title={title}
      buttonText={buttonText}
      buttonAction={action}
      setResult={setResult}
    />
  );
};


const ProfilePage = (props) => {
  const {
    account,
    balance,
    fundAmount,
    connectWallet,
    fundWallet,
    refresh,
    algoSignerInstalled,
    handleAlgoSignerInstalled,
    algoAccount,
    handleAlgoAccount,
    algoParams,
    handleAlgoParams,
    algoGlobal,
    handleAppGlobalState,
  } = props;
  
  return (
    <div>
      {refresh ? <div>Loading</div> : (
        <>
          {account?.current ? (
            <>
              {balance?.current !== null
                ? <div>Current Balance: {`${balance.current}`}</div>
                : null}
              <br />
              <input title="Fund Wallet" />
              <button onClick={fundWallet}>fund wallet</button>
            </>
          ) : (
            <>
              <div>
                {algoSignerInstalled
                  ? 'AlgoSigner detected'
                  : 'Unable to detect AlgoSigner'}
              </div>
              <button onClick={handleAlgoSignerInstalled}>Check AlgoSigner</button>
              <button onClick={handleAlgoAccount}>Get Algo Accounts</button>
              <button onClick={handleAlgoParams}>Algo Params</button>
              <button onClick={handleAppGlobalState}>App Global State</button>
              {algoSignerInstalled.current !== undefined
                ? 'AlgoSigner Detected'
                : 'AlgoSigner Not Detected'}
              {algoAccount.current?.length > 0
                ? 'Uve got accounts'
                : 'Cannot detect accounts'}
              {/* {!algoSignerInstalled
                && <CheckAlgoSigner
                      title=""
                      buttonText="Detect AlgoSigner"
                      result={algoSignerInstalled}
                      setResult={handleAlgoSignerInstalled}
                    />}
              {algoSignerInstalled
                && account.current?.length === 0
                && (
                  <GetAccounts
                    buttonText="Connect Account"
                    setResult={handleAlgoAccount}
                  />)}
              {account.current?.length !== 0
                && (
                  <GetParams
                    buttonText="Get Params"
                    setResult={handleAlgoParams}
                  />
                )} */}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ProfilePage;
