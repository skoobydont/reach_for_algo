/* global AlgoSigner */
// React
import React, { useState } from 'react';
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
// Icons
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// Utilities
import {
  waitForConfirmation,
  createOptInTrx,
} from '../utilities/algo';
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
}));

const INITOBTAINASSETAMOUNT = 0;
const INITOBTAINASSETNOTE = '';

const AssetListComponent = (props) => {
  const {
    assets,
    algodClient,
    user,
    algosdk,
    handleUpdateAccountInfo,
  } = props;
  const classes = useStyles();

  const SigningMethods = (props) => {
    const {
      handleAssetByMnemonic,
      handleAssetByAlgoSigner,
      handleAssetByMyAlgoConnect
    } = props;
    return (
      <CardContent>
        <Typography>
          Transaction Signing Methods:
        </Typography>
        <Button
          onClick={() => handleAssetByMnemonic()}
          variant="contained"
        >
          Mnemonic
        </Button>
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
          My Algo Conect
        </Button>
      </CardContent>
    );
  }
  /**
   * Generate Initial Asset State Object
   * @param {Boolean | String | Number} initialState value
   * @returns {Object} keys as asset index and passed value
   */
  const initAssetState = (initialState) => {
    let result = {};
    if (Array.isArray(assets) && assets?.length > 0) {
      assets?.forEach(({ asset }) => {
        result = {
          ...result,
          [`${asset?.index}`]: initialState,
        }
      });
    }
    return result;
  }
  const [assetCollapse, setAssetCollapse] = useState(initAssetState(false));
  const [assetOptInCollaspe, setAssetOptInCollapse] = useState(initAssetState(false));
  const [obtainAssetAmount, setObtainAssetAmount] = useState(initAssetState(INITOBTAINASSETAMOUNT));
  const [obtainAssetNote, setObtainAssetNote] = useState(initAssetState(INITOBTAINASSETNOTE));
  const [assetObtainCollaspe, setAssetObtainCollapse] = useState(initAssetState(false));
  const [assetRefresh, setAssetRefresh] = useState(initAssetState(false));
  const [algoSignerWallets, setAlgoSignerWallets] = useState(null);
  const [algoSignerWalletSelected, setAlgoSignerWalletSelected] = useState(null);
  /**
   * Handle Toggle Asset Collapse At Index Given
   * @param {number} index the numerical index of the ASA
   * @returns {null}
   * @fires setAssetCollapse update attribute at passed index
   */
  const handleToggleAssetCollapse = (index) => {
    if (Object.keys(assetCollapse).includes(String(index))) {
      setAssetCollapse({
        ...assetCollapse,
        [index]: !assetCollapse[index],
      });
    }
    return null;
  }
  const handleToggleOptInCollapse = (index) => {
    if (Object.keys(assetOptInCollaspe).includes(String(index))) {
      setAssetOptInCollapse({
        ...assetOptInCollaspe,
        [index]: !assetOptInCollaspe[index],
      });
    }
    return null;
  }
  const handleToggleObtainAssetCollapse = (index) => {
    if (Object.keys(assetObtainCollaspe).includes(String(index))) {
      setAssetObtainCollapse({
        ...assetObtainCollaspe,
        [index]: !assetObtainCollaspe[index],
      });
    }
    return null;
  }
  const handleObtainAssetByMnemonicAmountChange = (e) => {
    setObtainAssetAmount(+e.target.value);
  }
  const handleAssetRefresh = (index, value) => {
    setAssetRefresh({
      ...assetRefresh,
      [index]: value,
    });
  }
  const handleObtainAssetByMnemonicNoteChange = (e) => {
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
  const handleOptInAssetByMnemonic = async (asset) => {
    if (user.current === undefined) {
      alert('Please sign in before opting in');
      return null;
    }
    handleAssetRefresh(asset?.index, true);
    try {
      const params = await getTransactionParams();
      // for opt-in, sender & recipient will be the same address
      const sender = user.current.account.address;
      const recipient = sender;
      // We set revocationTarget to undefined as this is not a clawback operation
      const revocationTarget = undefined;
      // CloseReaminerTo is set to undefined as we are not closing out an asset
      const closeRemainderTo = undefined;
      const amount = 0;
      // Construct transaction object
      const optinTxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        recipient,
        closeRemainderTo,
        revocationTarget,
        amount,
        undefined,
        asset?.index,
        params,
      );
      // Prompt user for mnemonic so we can sign with sk
      const account = algosdk.mnemonicToSecretKey(prompt('Please enter your secret mnemonic:'));
      console.log('account from mnemonic: ', account);

      const rawSignedTxn = optinTxn.signTxn(account?.sk);
      const txId = optinTxn.txID().toString();
      console.log('Singed transaction with txId: %s', txId);
      // submit transaction
      const trxSubmission = await algodClient.sendRawTransaction(rawSignedTxn).do();
      console.log('the transaction submission: ', trxSubmission);
      // Wait for confirmation
      const confirmedTrxn = await waitForConfirmation(algodClient, txId);
      console.log('submit handler, confirmedTrxn: ', confirmedTrxn);
      const updatedAccountInfo = await handleUpdateAccountInfo(user.current.account.address);
      console.log('the updated account info from trx submission', updatedAccountInfo);
      return null;

    } catch (e) {
      console.error(e);
    } finally {
      handleAssetRefresh(asset?.index, false)
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
  const handleObtainAssetByMnemonic = async (asset) => {
    handleAssetRefresh(asset?.index, true);
    try {
      const params = await getTransactionParams();
      // console.log('oh boy sending transfer transaction by mnemonic| the params: ', params);
  
      const sender = asset?.params?.creator;
      const recipient = user?.current?.account?.address;
  
      const revocationTarget = undefined;
      const closeRemainderTo = undefined;
  
      const assetId = asset?.index;
  
      const amount = +obtainAssetAmount;
      const note = algosdk.encodeObj(obtainAssetNote);
      // console.log('an obj of the trx: ', {
      //   sender,
      //   recipient,
      //   closeRemainderTo,
      //   revocationTarget,
      //   amount,
      //   note,
      //   assetId,
      //   params,
      // });
      const transferTransaction = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        recipient,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        assetId,
        params,
      );
      // Prompt user for mnemonic so we can sign with sk
      const account = algosdk.mnemonicToSecretKey(process.env.REACT_APP_BASE_WALLET_MNEMONIC);
      // console.log('account from mnemonic: ', account);
      const rawSignedTxn = transferTransaction.signTxn(account?.sk);
      const txId = transferTransaction.txID().toString();
      // console.log('Singed transaction with txId: %s', txId);
      // submit transaction
      const trxSubmission = await algodClient.sendRawTransaction(rawSignedTxn).do();
      // console.log('the transaction submission: ', trxSubmission);
      
      // Wait for confirmation
      const confirmedTrxn = await waitForConfirmation(algodClient, txId);
      // console.log('submit handler, confirmedTrxn: ', confirmedTrxn);
      const updatedAccountInfo = await handleUpdateAccountInfo(user.current.account.address);
      // console.log('the updated account info from trx submission', updatedAccountInfo);
      return trxSubmission;

    } catch (e) {
      console.error(e);
    } finally {
      handleAssetRefresh(asset?.index, false);
    }
  }
  const handleOptInAlgoSignerInput = async () => {
    // this just connects to AlgoSigner, user will need to choose account to use
    if (AlgoSigner) {
      await AlgoSigner.connect();
      const accounts = await AlgoSigner.accounts({
        ledger: 'TestNet',
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
        handleAssetRefresh(asset?.index, true);
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
            ledger: 'TestNet',
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
          handleAssetRefresh(asset?.index, false);
          return null;
        }
      case 'MyAlgoConnect':
        handleAssetRefresh(asset?.index, true);
        try {
          // init myAlgoConnect
          const myAlgoConnect = new MyAlgoConnect({ disableLedgerNano: false });
          // Get Desired Account
          const accounts = await myAlgoConnect.connect({
            shouldSelectOneAccount: false,
            openManager: false,
          });
          // Get Params
          const params = await getTransactionParams();
          // Create OptIn Transaction
          const optInTrx = await createOptInTrx(
            algosdk,
            accounts[0]?.address,
            params,
            asset,
          );
          // Sign & Submit Transaction
          const signedTrx = await myAlgoConnect.signTransaction(optInTrx.toByte());
          // Wait for confirmation
          await waitForConfirmation(algodClient, signedTrx.txID);
          // Update Account Info
          await handleUpdateAccountInfo(accounts[0]?.address);

          return null;
        } catch (e) {
          console.error(e);
        } finally {
          handleAssetRefresh(asset?.index, false);
          return null;
        }
      default:
        return null;
    }
  }

  // https://dappradar.com/blog/algorand-dapp-development-2-standard-asset-management
  console.log('some refresh', assetRefresh)
  return (
    <div className={classes.root}>
      {assets?.map(({ asset }, i) => {
        // console.log('the asset: ', asset);
        return (
          <Card
            component={Paper}
            key={i}
            className={classes.card}
          >
            {assetRefresh[asset?.index]
              ? <LinearProgress />
              : (
                <>
                  <CardContent>
                    <Typography>
                      {asset?.params?.name}
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <IconButton
                      onClick={() => handleToggleAssetCollapse(asset?.index)}
                    >
                      {assetCollapse[asset?.index]
                        ? <ExpandLessIcon />
                        : <ExpandMoreIcon />}
                    </IconButton>
                    {userHasOptedInToAsset(asset?.index, user?.current?.account?.assets)
                      ? (
                        <>
                          <TextField
                            type="number"
                            onChange={(e) => handleObtainAssetByMnemonicAmountChange(e, asset?.params?.total)}
                          />
                          <TextField
                            placeholder='Note (optional)'
                            onChange={handleObtainAssetByMnemonicNoteChange}
                          />
                          <Button
                            onClick={() => handleToggleObtainAssetCollapse(asset?.index)}
                          >
                            Obtain Asset
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleToggleOptInCollapse(asset?.index)}
                        >
                          Opt-In
                        </Button>
                      )}
                  </CardActions>                  
                </>
              )
            }
            {/** Transaction Opt In Methods (mnemonic, myalgoconnect, etc?) */}
            <Collapse
              in={assetOptInCollaspe[asset?.index]}
              timeout="auto"
              unmountOnExit
              className={classes.card}
            >
              <SigningMethods
                handleAssetByMnemonic={() => handleOptInAssetByMnemonic(asset)}
                handleAssetByAlgoSigner={() => handleOptInAlgoSignerInput()}
                handleAssetByMyAlgoConnect={() => handleOptIn('MyAlgoConnect', asset)}
              />
            </Collapse>
            <Collapse
              in={assetObtainCollaspe[asset?.index]}
              timeout="auto"
              unmountOnExit
              className={classes.card}
            >
              <SigningMethods
                handleAssetByMnemonic={() => handleObtainAssetByMnemonic(asset)}
              />
            </Collapse>
            <Collapse
              in={assetCollapse[asset?.index]}
              timeout="auto"
              unmountOnExit
              className={classes.card}
            >
              <CardContent>
                <Typography>Show Collapsed Info For Asset At Index: {asset?.index}</Typography>
              </CardContent>
            </Collapse>
            <Collapse
              in={algoSignerWallets !== null
                && algoSignerWallets?.length > 0
                && assetOptInCollaspe[asset?.index]
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
                        <Button onClick={() => handleOptIn('AlgoSigner', asset)}>
                          Confirm
                        </Button>
                      ) : null}
                  </CardContent>
                ) : null}
            </Collapse>
          </Card>
        );
      })}
    </div>
  )   
}

export default AssetListComponent;
