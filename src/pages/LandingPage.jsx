import React, { useRef, useState } from 'react';
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
    algosdk,
    algodClient,
    handleSetAccount,
    ledger,
    indexerClient,
  } = props;
  const assets = useRef();
  const [assetIdList] = useState(user?.account?.assets?.map((a) => a['asset-id']));
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
  
  return user === null || user === undefined
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
            ledger={ledger}
          />
        </div>
      </div>
    );
};

export default LandingPage;
