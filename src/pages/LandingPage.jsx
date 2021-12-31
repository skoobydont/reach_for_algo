import React, { useRef, useEffect, useState } from 'react';
// MUI
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
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
  } = props;

  const assets = useRef();
  const [refresh, setRefresh] = useState(false);

  
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
      const walletInfo = await handleGetAccountInfo(walletAddress);
      if (typeof walletInfo === 'object' && Object.keys(walletInfo).includes('account')) {
        const assetInfoRes = [];
        if (Array.isArray(walletInfo.account?.assets)) {
          walletInfo.account.assets.forEach((asset) => {
            assetInfoRes.push(handleGetAssetInfo(asset['asset-id']));
          });
        }
        console.log('asset info res', assetInfoRes);
        const assetInfoResResolved = await Promise.all(assetInfoRes);
        console.log('asset info res after promise all', assetInfoResResolved);
        if (Array.isArray(assetInfoResResolved) && assetInfoResResolved?.length > 0) {
          assets.current = assetInfoResResolved;
        }
      }
      setRefresh(true);
      return walletInfo;
    } 
    if (assets.current === undefined) {
      // get assets from main wallet
      getWalletAssetsInfo(process.env.REACT_APP_BASE_WALLET_ADDRESS);
    }
  }, [assets, handleGetAccountInfo, handleGetAssetInfo]);
  console.log('the assets: ', assets);
  return (
    <div className={classes.root}>
      <Typography variant="subtitle1" color="primary">
        Real Estate For The Digital Age
      </Typography>
      {Array.isArray(assets.current) && assets.current?.length
        ? (
          <div>
            <AssetListComponent
              assets={assets.current}
              algodClient={algodClient}
              user={user}
              algosdk={algosdk}
            />
          </div>
        ) : null}
    </div>
  );
};

export default LandingPage;
