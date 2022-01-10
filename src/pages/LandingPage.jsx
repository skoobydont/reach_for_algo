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
  } = props;

  const assets = useRef();
  const [refresh, setRefresh] = useState(false);
  const [walletInput, setWalletInput] = useState('');
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
  /**
   * Handle Select Ledger Option Change
   * @param {Object} e event object
   */  
  // const handleSelectLedgerChange = (e) => {
  //   setLedger(e.target.value);
  // };
  /**
   * Handle Wallet Text Input Change
   * @param {Object} e event object
   */
  // const handleWalletInputChange = (e) => {
  //   setWalletInput(e.target.value);
  // };
  /**
   * Handle Connect Wallet Submit
   * @async
   * @param {Object} e event object
   */
  // const handleConnectWalletSubmit = async (e) => {
  //   e?.preventDefault();
  //   // get wallet info
  //   // update wallet info
  //   if (walletInput !== null) {
  //     setRefresh(true);
  //     await handleUpdatingAccountInfo(walletInput);
  //   }
  //   setRefresh(false);
  // };  
  // get assets from main wallet address
  useEffect(() => {
    /**
     * Get Wallet & Asset Info
     * @param {string} walletAddress the wallet you want info for
     * @returns {Object} account obj & current round
     * @fires setAssets with any assets associated with the wallet address (maybe
     *  this changes to only display assets that match what main wallet has) (
     *  only want to show assets in wallet that are also in main wallet i guess)
     */
    const getWalletAssetsInfo = async (walletAddress) => {
      setRefresh(true);
      const walletInfo = await handleGetAccountInfo(walletAddress);
      if (typeof walletInfo === 'object' && Object.keys(walletInfo).includes('account')) {
        const assetInfoRes = [];
        if (Array.isArray(walletInfo.account?.assets)) {
          walletInfo.account.assets.forEach((asset) => {
            assetInfoRes.push(handleGetAssetInfo(asset['asset-id']));
          });
        }
        const assetInfoResResolved = await Promise.allSettled(assetInfoRes);
        console.log('asset info res after promise all', assetInfoResResolved);
        if (Array.isArray(assetInfoResResolved) && assetInfoResResolved?.length > 0) {
          const retryArray = [];
          const fullfilledArray = [];
          let prmIndex = 0;
          // doing this to try and ease any Too Many Requests from PureStakeAPI
          while (prmIndex < assetInfoResResolved?.length) {
            if (assetInfoResResolved[prmIndex]?.status === 'fulfilled') {
              fullfilledArray.push(assetInfoResResolved[prmIndex]?.value);
            }
            if (assetInfoResResolved[prmIndex]?.status === 'rejected') {
              retryArray.push(handleGetAccountInfo(assetInfoResResolved[prmIndex]?.value?.asset?.index));
            }
            prmIndex += 1;
          }
          const retryResResolved = await Promise.all(retryArray);
          if (retryResResolved?.length > 0) {
            assets.current = [
              ...fullfilledArray,
              ...retryResResolved,
            ];
          } else {
            assets.current = [...fullfilledArray];
          }
        }
      }
      setRefresh(false);
      return walletInfo;
    } 
    if (assets.current === undefined) {
      // get assets from main wallet
      getWalletAssetsInfo(process.env.REACT_APP_BASE_WALLET_ADDRESS);
    }
  }, [assets, handleGetAccountInfo, handleGetAssetInfo]);
  console.log('the assets: ', assets);
  console.log('the ledger', ledger);
  return refresh ? <LinearProgress /> : (
    <div className={classes.root}>
      <Typography variant="subtitle1" color="primary">
        Real Estate For The Digital Age
      </Typography>
      {user.current === null || user.current === undefined
        ? (
          <>
            {/* TODO: When / if redesign, if wallet & net based,
              implement workflow to capture relevant info */}
            {/* <Select
              label="Ledger"
              title="Ledger"
              onChange={handleSelectLedgerChange}
              value={ledger}
            >
              {['', 'MainNet', 'TestNet']?.map((lgr, i) => (
                <MenuItem
                  value={lgr}
                  key={i}
                >
                  {lgr}
                </MenuItem>
              ))}
            </Select>
            <form onSubmit={handleConnectWalletSubmit}>
              <TextField
                label="Wallet Address"
                value={walletInput}
                onChange={handleWalletInputChange}
              />
              <Button type="submit">Connect Wallet</Button>
            </form> */}
          </>
        ) : null}
      {Array.isArray(assets.current) && assets.current?.length
        ? (
          <div>
            <AssetListComponent
              assets={assets.current}
              algodClient={algodClient}
              user={user}
              algosdk={algosdk}
              handleUpdateAccountInfo={handleUpdatingAccountInfo}
            />
          </div>
        ) : null}
    </div>
  );
};

export default LandingPage;
