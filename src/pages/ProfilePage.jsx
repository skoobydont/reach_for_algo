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
    handleGetAccountInfo,
    handleGetAssetInfo,
  } = props;

  const [assets, setAssets] = useState(null);
  
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
        setAssets(assetInfoResResolved);
      }
      return assetInfoRes;
    }
  }

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
          onClick={() => getWalletAssetsInfo(process.env.REACT_APP_BASE_WALLET_ADDRESS)}
          variant="contained"
        >
          Get Assets
        </Button>
        {Array.isArray(assets) && assets?.length > 0
          ? (
            <div>
              {assets?.map(({ asset }, i) => (
                <div key={i}>
                  <Typography>{asset?.params?.name}</Typography>
                </div>
              ))}
            </div>
          ) : null}
      </>
    </div>
  );
}

export default ProfilePage;
