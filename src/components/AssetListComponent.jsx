/* global AlgoSigner */
// React
import React, { useState, useEffect } from 'react';
// MyAglo
import MyAlgoConnect from '@randlabs/myalgo-connect';
// MUI
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from '@material-ui/lab/Pagination';
// Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// Utilities
import {
  waitForConfirmation,
  createOptInTrx,
  createTransferTrx,
} from '../utilities/algo';
import { decrypt } from '../utilities/formatUtil';
// Classes
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    maxWidth: theme.spacing(50),
    minWidth: theme.spacing(30),
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: `0px ${theme.spacing(1)}px`,
  },
  notSelectedWallet: {
    opacity: '75%',
  },
  pagination: {
    '& ul li .Mui-selected': {
      color: theme.palette.primary.main,
    },
  },
  obtainAssetInfo: {
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
  },
  assetAmountTable: {
    border: `1px #000 solid`,
    marginBottom: theme.spacing(1),
  },
}));

const INITOBTAINASSETAMOUNT = 0;
const INITOBTAINASSETNOTE = '';

const AssetListComponent = (props) => {
  const {
    algodClient,
    user,
    algosdk,
    handleUpdateAccountInfo,
    assetIdList,
    page,
    setPage,
    activeAssetId,
    setActiveAssetId,
    handleGetAssetInfo,
    indexerClient,
    ledger,
  } = props;
  const classes = useStyles();

  const SigningMethods = (props) => {
    const {
      handleAssetByAlgoSigner,
      handleAssetByMyAlgoConnect
    } = props;
    return (
      <CardContent>
        <Typography>
          Transaction Signing Methods:
        </Typography>
        <Button
          disabled={AlgoSigner === undefined || AlgoSigner === null}
          onClick={() => handleAssetByAlgoSigner()}
          variant="contained"
        >
          AlgoSigner
        </Button>
        <Button
          onClick={() => handleAssetByMyAlgoConnect()}
          variant="contained"
        >
          MyAlgo Connect
        </Button>
      </CardContent>
    );
  };
  const [assetCollapse, setAssetCollapse] = useState(false);
  const [assetOptInCollaspe, setAssetOptInCollapse] = useState(false);
  const [obtainAssetAmount, setObtainAssetAmount] = useState(INITOBTAINASSETAMOUNT);
  const [obtainAssetNote, setObtainAssetNote] = useState(INITOBTAINASSETNOTE);
  const [assetObtainCollape, setAssetObtainCollapse] = useState(false);
  const [assetRefresh, setAssetRefresh] = useState(false);
  const [algoSignerWallets, setAlgoSignerWallets] = useState(null);
  const [algoSignerWalletSelected, setAlgoSignerWalletSelected] = useState(null);
  const [activeAsset, setActiveAsset] = useState(null);
  const [userAssetTotals, setUserAssetTotals] = useState({
    userTotal: 0,
    assetAvailable: 0,
    assetTotal: 0,
  });
  const [userOptedIn, setUserOptedIn] = useState(false);
  /**
   * Handle Toggle Asset Collapse At Index Given
   * @param {number} index the numerical index of the ASA
   * @returns {null}
   * @fires setAssetCollapse update attribute at passed index
   */
  const handleToggleAssetCollapse = () => setAssetCollapse(!assetCollapse);
  const handleToggleOptInCollapse = () => setAssetOptInCollapse(!assetOptInCollaspe);
  const handleToggleObtainAssetCollapse = () => setAssetObtainCollapse(!assetObtainCollape);

  const handleObtainAssetAmountChange = (e) => {
    if (+e.target.value <= +userAssetTotals?.assetAvailable) {
      setObtainAssetAmount(+e.target.value);
    }
  }
  const handleAssetRefresh = (value) => {
    setAssetRefresh(value);
  }
  const handleObtainAssetNoteChange = (e) => {
    setObtainAssetNote(e.target.value);
  }
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
  }
  const userHasOptedInToAsset = (assetId, userAssets) => {
    let result = false;
    if (Array.isArray(userAssets) && userAssets?.length > 0) {
      userAssets?.forEach((uAsset) => {
        if (uAsset?.amount >= 0 && uAsset?.['asset-id'] === assetId) {
          result = true;
        }
      });
    }
    return result;
  }
  const handleGetAlgoSignerWallets = async () => {
    // this just connects to AlgoSigner, user will need to choose account to use
    if (AlgoSigner) {
      await AlgoSigner.connect();
      const accounts = await AlgoSigner.accounts({
        ledger,
      });
      setAlgoSignerWallets(accounts);
      return null;
    } else {
      setAlgoSignerWallets([{
        address: 'AlgoSigner not detected',
      }]);
    }
  }
  const handleOptIn = async (signMethod, asset) => {
    switch(signMethod) {
      case 'AlgoSigner':
        if (algoSignerWalletSelected === null) {
          console.error('Please select valid wallet');
          return null;
        }
        handleAssetRefresh(true);
        try {
          const params = await getTransactionParams();
          const optInTrx = createOptInTrx(
            algosdk,
            algoSignerWalletSelected,
            params,
            asset,
          );
          // Encode to base64 text
          const base64Tx = AlgoSigner.encoding.msgpackToBase64(optInTrx.toByte());
          // sign with AlgoSigner
          const signedTx = await AlgoSigner.signTxn([{ txn: base64Tx }]);
          // Send signed transaction
          // TODO: implement Ledger Handling
          const submittedSignedTrx = await AlgoSigner.send({
            ledger,
            tx: signedTx[0]?.blob,
          });
          // Wait for confirmation
          await waitForConfirmation(algodClient, submittedSignedTrx.txId);
          // Update Account Info
          await handleUpdateAccountInfo(user.current.account.address);

          return null;
        } catch (e) {
          console.error(e);
        } finally {
          handleAssetRefresh(false);
          return null;
        }
      case 'MyAlgoConnect':
        handleAssetRefresh(true);
        try {
          // init myAlgoConnect
          const myAlgoConnect = new MyAlgoConnect({ disableLedgerNano: false });
          // Get Desired Account
          await myAlgoConnect.connect({
            shouldSelectOneAccount: false,
            openManager: true,
          });
          // Get Params
          const params = await getTransactionParams();
          // Create OptIn Transaction
          const optInTrx = await createOptInTrx(
            algosdk,
            user?.account?.address,
            params,
            asset,
          );
          // Sign & Submit Transaction
          const signedTrx = await myAlgoConnect.signTransaction(optInTrx.toByte());
          // Send Signed Transaction
          await algodClient.sendRawTransaction(signedTrx.blob).do();
          // Wait for confirmation
          await waitForConfirmation(algodClient, signedTrx.txID);
          // Update Account Info
          await handleUpdateAccountInfo(user?.account?.address);

          return null;
        } catch (e) {
          console.error(e);
        } finally {
          handleAssetRefresh(false);
          return null;
        }
      default:
        return null;
    }
  };
  const handlePaginationChange = (e, v) => {
    setPage(v);
  };
  /**
   * Handle Transfer Transaction
   * @async
   * @returns {null}
   */
  const handleTransferTransaction = async () => {
    handleAssetRefresh(true);
    try {
      // get suggested params
      const params = await getTransactionParams();
      // create transfer transaction
      const transferTrx = await createTransferTrx(
        algosdk,
        user?.account?.address,
        params,
        activeAsset,
        obtainAssetAmount,
        obtainAssetNote,
      );
      // derive sk from mnemonic
      const account = algosdk.mnemonicToSecretKey(
        decrypt(
          process.env.REACT_APP_BASE_WALLET_MNEMONIC_ENCRYPTED,
          process.env.REACT_APP_WALLET_MNEMONIC_KEY,
        ));
      // Sign transfer transaction
      const rawSignedTxn = transferTrx.signTxn(account?.sk);
      // submit transaction
      await algodClient.sendRawTransaction(rawSignedTxn).do();
      // Wait for confirmation
      await waitForConfirmation(algodClient, transferTrx.txID().toString());
      // update account info
      await handleUpdateAccountInfo(user.account.address);

      return null;
    } catch (e) {
      console.error(e);
    } finally {
      handleAssetRefresh(false);
      return null;
    }
  };

  // update active asset id based on which page user is on
  useEffect(() => {
    // resest active asset to null so component refreshes visually
    setActiveAsset(null);
    setActiveAssetId(assetIdList[page - 1]);
  }, [activeAssetId, assetIdList, page, setActiveAssetId]);
  // update active asset state based on active asset id
  useEffect(() => {
    const getAssetInfo = async (id) => {
      const assetInfo = await handleGetAssetInfo(id);
      setActiveAsset(assetInfo?.asset);
    };
    if (String(activeAssetId)?.length > 0) {
      getAssetInfo(activeAssetId);
    }
  }, [activeAssetId, handleGetAssetInfo]);

  // get user asset amount
  useEffect(() => {
    const getAmounts = async () => {
      const getUserAssetAmount = async (asset) => {
        const result = {
          userTotal: 0,
          assetAvailable: 0,
          assetTotal: asset?.params?.total,
        };
        const indexerResult = await indexerClient.lookupAssetBalances(asset?.index).do();
        let walletIndex = 0;
        while (walletIndex < indexerResult?.balances?.length) {
          if (indexerResult?.balances[walletIndex]?.address === process.env.REACT_APP_BASE_WALLET_ADDRESS) {
            result.assetAvailable = indexerResult?.balances[walletIndex]?.amount;
          }
          if (indexerResult?.balances[walletIndex]?.address === user?.account?.address) {
            result.userTotal = indexerResult?.balances[walletIndex]?.amount;
          }
          walletIndex += 1;
        }
        return result;
      };
      if (activeAsset !== null && assetObtainCollape) {
        setUserAssetTotals(await getUserAssetAmount(activeAsset));
      }
    }
    // get asset amounts & update state
    getAmounts();
  }, [activeAsset, user?.account, indexerClient, assetObtainCollape]);
  // check if user has opted into asset
  useEffect(() => {
    if (activeAsset !== null) {
      setUserOptedIn(userHasOptedInToAsset(activeAsset?.index, user?.account?.assets));
    }
  }, [activeAsset, user]);
  // reset state if change page or refresh asset
  useEffect(() => {
    setAssetCollapse(false);
    setAssetOptInCollapse(false);
    setAssetObtainCollapse(false);
    setObtainAssetAmount(INITOBTAINASSETAMOUNT);
    setObtainAssetNote(INITOBTAINASSETNOTE);
    setAlgoSignerWallets(null);
    setAlgoSignerWalletSelected(null);
    setUserAssetTotals({
      userTotal: 0,
      assetAvailable: 0,
      assetTotal: 0,
    });
  }, [page, assetRefresh]);
  
  return (
    <div className={classes.root}>
      <>
        <Card
          component={Paper}
          className={classes.card}
        >
          {assetRefresh ? <LinearProgress /> : activeAsset !== null
            ? (
              <>
                <CardContent>
                  <Typography>
                    {activeAsset?.params?.name}
                  </Typography>
                </CardContent>
                <CardActions className={classes.cardActions}>
                  <>
                    <IconButton
                      onClick={() => handleToggleAssetCollapse()}
                      title='Additional Information'
                    >
                      {assetCollapse
                        ? <ExpandLessIcon />
                        : <ExpandMoreIcon />}
                    </IconButton>
                  </>
                  {userOptedIn
                    ? (
                      <Button
                        onClick={() => handleToggleObtainAssetCollapse()}
                        color={assetObtainCollape
                          ? 'primary' : 'inherit'}
                      >
                        Obtain Asset
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleToggleOptInCollapse(activeAsset?.index)}
                        color={assetOptInCollaspe
                          ? 'primary' : 'inherit'}
                      >
                        Opt-In
                      </Button>
                    )}
                </CardActions>
              </>
            ) : <LinearProgress />}
            {/* Various Collapses (Additional Info, OptIn & Transfer Trx Signing Methods, etc) */}
            <Collapse
              in={assetCollapse}
              timeout="auto"
              unmountOnExit
              className={classes.card}
            >
              <CardContent>
                <Typography>Additional Info For Asset: {activeAsset?.index}</Typography>
              </CardContent>
            </Collapse>
            <Collapse
              in={assetOptInCollaspe}
              timeout="auto"
              unmountOnExit
              className={classes.card}
            >
              <SigningMethods
                handleAssetByAlgoSigner={() => handleGetAlgoSignerWallets()}
                handleAssetByMyAlgoConnect={() => handleOptIn('MyAlogConnect', activeAsset)}
              />
            </Collapse>
            <Collapse
              in={assetObtainCollape}
              timeout="auto"
              unmountOnExit
              className={classes.card}
            >
              <div className={classes.obtainAssetInfo}>
                <table className={classes.assetAmountTable}>
                  <thead>
                    <tr>
                      <td>Owned</td>
                      <td>Available</td>
                      <td>Total</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{userAssetTotals?.userTotal}</td>
                      <td>{userAssetTotals?.assetAvailable}</td>
                      <td>{userAssetTotals?.assetTotal}</td>
                    </tr>
                  </tbody>
                </table>
                {+userAssetTotals?.assetAvailable > 0
                  ? (
                    <>
                      <Typography>Amount</Typography>
                      <TextField
                        type="number"
                        onChange={(e) => handleObtainAssetAmountChange(e)}
                        value={obtainAssetAmount}
                      />
                      <TextField
                        placeholder='Note (optional)'
                        onChange={handleObtainAssetNoteChange}
                      />
                      <Button
                        disabled={obtainAssetAmount <= 0}
                        onClick={handleTransferTransaction}
                        variant="contained"
                        color="primary"
                      >
                        Confirm
                      </Button>                    
                    </>
                  ) : <Typography>Asset Currently Unavailable</Typography>}
              </div>
            </Collapse>
            <Collapse
              in={algoSignerWallets !== null
                && algoSignerWallets?.length > 0
                && (assetOptInCollaspe
                  || assetObtainCollape)
              }
              timeout="auto"
              unmountOnExit
              className={classes.card}
            >
              {algoSignerWallets !== null && algoSignerWallets?.length > 0
                ? (
                  <CardContent>
                    {algoSignerWallets?.map((asW, i) => (
                      <Button
                        key={i}
                        onClick={() => setAlgoSignerWalletSelected(asW?.address)}
                        color={algoSignerWalletSelected !== null
                          && asW?.address === algoSignerWalletSelected
                          ? 'primary' : 'inherit'}
                        variant="contained"
                        className={algoSignerWalletSelected !== null
                          && asW?.address === algoSignerWalletSelected
                          ? null : classes.notSelectedWallet}
                      >
                        {asW?.address}
                      </Button>
                    ))}
                    {algoSignerWalletSelected !== null
                      ? (
                        <Button
                          onClick={!userOptedIn
                            ? () => handleOptIn('AlgoSigner', activeAsset)
                            : () => handleTransferTransaction()
                          }
                        >
                          Confirm
                        </Button>
                      ) : null}
                  </CardContent>
                ) : null}
            </Collapse>
        </Card>
      </>
      <Pagination
        className={classes.pagination}    
        count={assetIdList?.length}
        page={page}
        onChange={handlePaginationChange}
      />
    </div>
  );
};

export default AssetListComponent;
