import React, { useRef, useEffect, useState } from 'react';
// MUI
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
// import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
// Custom
import AssetListComponent from '../components/AssetListComponent';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '8px',
    justifyContent: 'center',
    '& .MuiInputBase-root': {
      margin: 'auto',
      maxWidth: theme.spacing(35),
    },
  },
}));

const LandingPage = (props) => {
  const classes = useStyles();
  const {
    user,
    handleGetAccountInfo,
    handleGetAssetInfo,
    handleGetTransactionParams,
    algosdk,
    algodClient,
    handleSetAccount,
    ledger,
    setLedger,
    indexerClient,
  } = props;
  const assets = useRef();
  console.log('the user?', user);
  console.log('assets?', assets?.current);
  const [refresh, setRefresh] = useState(false);
  const [walletInput, setWalletInput] = useState('');
  const [assetIdList, setAssetIdList] = useState(user?.account?.assets?.map((a) => a['asset-id']));
  const [page, setPage] = useState(1);
  const [activeAssetId, setActiveAssetId] = useState('');
  /**
   * Handle Updating Account Info
   * @param {Object} addr wallet address information object returned from algo adk indexer
   * @fires handleSetAccount
   * @returns {Object} the updated account info
   */
  const handleUpdatingAccountInfo = async (addr) => {
    const updatedAccountInfo = await handleGetAccountInfo(addr);
    handleSetAccount(updatedAccountInfo);
    return updatedAccountInfo;
  };
  console.log('the assets: ', assets);
  console.log('the ledger', ledger);
  console.log('landpage user', user);
  return refresh
    ? <LinearProgress />
    : user === null || user === undefined
      ? null
      : (
        <div className={classes.root}>
          <div>
            <Typography variant="subtitle1" color="primary">
              Real Estate For The Digital Age
            </Typography>
            <AssetListComponent
              assets={assets.current}
              algodClient={algodClient}
              user={user}
              algosdk={algosdk}
              handleUpdateAccountInfo={handleUpdatingAccountInfo}
              handleGetAssetInfo={handleGetAssetInfo}
              assetIdList={assetIdList}
              page={page}
              setPage={setPage}
              activeAssetId={activeAssetId}
              setActiveAssetId={setActiveAssetId}
              indexerClient={indexerClient}
            />
          </div>
        </div>
  );
};

export default LandingPage;
