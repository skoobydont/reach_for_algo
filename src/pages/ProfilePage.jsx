/* global AlgoSigner */
import React, { useState, useCallback, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
      <>
        {/* <Button
          onClick={handleAlgoSignerInstalled}
          variant="contained"
        >
          Check AlgoSigner
        </Button> */}
        <Button
          onClick={handleAlgoAccount}
          variant="contained"
        >
          Get Algo Accounts
        </Button>
        <Button
          onClick={handleAlgoParams}
          variant="contained"
        >
          Algo Params
        </Button>
        <Button
          onClick={handleAppGlobalState}
          variant="contained"
        >
          App Global State
        </Button>
        {algoSignerInstalled.current !== undefined
          ? 'AlgoSigner Detected'
          : 'AlgoSigner Not Detected'}
        {algoAccount.current !== null
          && algoAccount.current?.length > 0
          && algoAccount.current?.map((act, i) => {
            return <div>Account {`${i} : ${act.address}`}</div>
          })}
        {/* {!algoSignerInstalled
          && <CheckAlgoSigner
                title=""
                ButtonText="Detect AlgoSigner"
                result={algoSignerInstalled}
                setResult={handleAlgoSignerInstalled}
              />}
        {algoSignerInstalled
          && account.current?.length === 0
          && (
            <GetAccounts
              ButtonText="Connect Account"
              setResult={handleAlgoAccount}
            />)}
        {account.current?.length !== 0
          && (
            <GetParams
              ButtonText="Get Params"
              setResult={handleAlgoParams}
            />
          )} */}
      </>
    </div>
  );
}

export default ProfilePage;
