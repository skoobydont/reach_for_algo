import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
// MUI
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';
// Util
import { commaFormat } from '../utilities/formatUtil';

const ProfilePage = (props) => {
  const {
    account,
    handleSetAccount,
    handleGetAccountInfo,
    handleGetAssetInfo,
  } = props;
  const history = useHistory();
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
      const assetInfoResResolved = await Promise.all(assetInfoRes);
      if (Array.isArray(assetInfoResResolved) && assetInfoResResolved?.length > 0) {
        setAssets(assetInfoResResolved);
      }
    }
    setRefresh(true);
    return walletInfo;
  }
  /**
   * Handle Submit
   * @async
   * @fires handleSetAccount
   * @param {Object} e event
   */
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const walletInfo = await getWalletAssetsInfo(walletInput);
    handleSetAccount(walletInfo);
  }
  /**
   * Handle Sign Out
   * @fires setRefresh
   * @fires setAssets
   * @fires handleSetAccount
   * @fires history.push
   */
  const handleSignOut = () => {
    setRefresh(true);
    setAssets(null);
    handleSetAccount(undefined);
    history.push('/reach_for_algo');
  };
  // handle refresh
  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);
  // grab assets associated with logged in wallet
  useEffect(() => {
    if (assets === null && account?.account !== undefined) {
      getWalletAssetsInfo(account?.account?.address);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.account, assets]);

  return (
    <div>
      <>
        {refresh
          ? <LinearProgress />
          : account !== undefined
            ? Object?.keys(account)?.includes('account')
              ? (
                <>
                  <Typography>
                    My Account: {account?.account?.address}
                  </Typography>
                  <Typography>
                    {commaFormat(account.account?.amount)} microAlgos
                  </Typography>
                  <Button onClick={handleSignOut}>Sign Out</Button>
                </>
              )
              : Object.keys(account)?.includes('message')
                ? (
                  <>
                    <Typography>
                      {account?.message}
                    </Typography>
                    <Button onClick={handleSignOut}>Sign Out</Button>
                  </>
                )
                : null
            : (
              <form onSubmit={handleSubmit}>
                <Typography>Login With Wallet Address</Typography>
                <TextField
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                />
                <Button type="submit">Submit</Button>
              </form>
            )}
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
