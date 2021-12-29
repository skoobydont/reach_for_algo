import React, { useState, useEffect } from 'react';
// MUI
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';

const ProfilePage = (props) => {
  const {
    account,
    handleSetAccount,
    algosdk,
    handleGetAccountInfo,
    handleGetAssetInfo,
    handleGetTransactionParams,
  } = props;
  // https://dappradar.com/blog/algorand-dapp-development-2-standard-asset-management
  const [refresh, setRefresh] = useState(false);
  const [assets, setAssets] = useState(null);
  const [walletInput, setWalletInput] = useState('');
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
        setAssets(assetInfoResResolved);
      }
    }
    setRefresh(true);
    return walletInfo;
  }

  const getTransactionParams = async () => {
    const tParams = await handleGetTransactionParams();
    console.log('some transaction params', tParams);
    return tParams;
  }

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const walletInfo = await getWalletAssetsInfo(walletInput);
    console.log('handle submit wallet info: ', walletInfo);
    handleSetAccount(walletInfo);
  }

  console.log('account', account);

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);

  return (
    <div>
      <>
        {refresh
          ? <LinearProgress />
          : account.current !== undefined
            ? (
              <>
                <Typography>
                  My Account: {account?.current?.account?.address}
                </Typography>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <Typography>Login With Wallet Address</Typography>
                <TextField
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                />
                <Button type="submit">Submit</Button>
              </form>
            )}
        {/* <Button
          onClick={() => getWalletAssetsInfo(process.env.REACT_APP_BASE_WALLET_ADDRESS)}
          variant="contained"
        >
          Get Assets
        </Button>
        <Button
          onClick={() => getTransactionParams()}
        >
          Transaction Params
        </Button> */}
        {Array.isArray(assets) && assets?.length > 0
          ? (
            <div>
              <Typography>My Assets</Typography>
              <Divider />
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
