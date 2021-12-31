import React, { useState } from 'react';
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
// Icons
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
}));

const AssetListComponent = (props) => {
  const {
    assets,
    algodClient,
    user,
    algosdk,
  } = props;
  const classes = useStyles();

  const SigningMethods = (props) => {
    const {
      handleAssetByMnemonic,
      handleAssetByMyAlgoConnect,
    } = props;
    return (
      <CardContent>
        <Typography>
          Transaction Signing Methods:
        </Typography>
        <Button
          onClick={() => handleAssetByMnemonic()}
        >
          Mnemonic
        </Button>
        <Button
          // TODO: implement & remove disabled
          disabled={true}
          onClick={() => handleAssetByMyAlgoConnect()}
        >
          MyAlgoConnect(TODO)
        </Button>
      </CardContent>
    );
  }
  console.log('the user', user);
  /**
   * Generate Initial Asset Collapse Object
   * @returns {Object} keys as asset index and value false (so all are default collapsed)
   */
  const initAssetCollapse = () => {
    let result = {};
    if (Array.isArray(assets) && assets?.length > 0) {
      assets?.forEach(({ asset }) => {
        result = {
          ...result,
          [`${asset?.index}`]: false,
        }
      });
    }
    return result;
  }
  const [assetCollapse, setAssetCollapse] = useState(initAssetCollapse());
  const [assetOptInCollaspe, setAssetOptInCollapse] = useState(initAssetCollapse());
  const [obtainAssetAmount, setObtainAssetAmount] = useState(0);
  const [obtainAssetNote, setObtainAssetNote] = useState('');
  const [assetObtainCollaspe, setAssetObtainCollapse] = useState(initAssetCollapse());
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
  const handleOptInAssetByMnemonic = async (assetId) => {
    if (user.current === undefined) {
      alert('Please sign in before opting in');
      return null;
    }
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
        assetId,
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
      // const confirmedTxn = await  TODO idk check pending transactions
      return null;

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
  const handleObtainAssetByMnemonic = async (asset) => {
    try {
      const params = await getTransactionParams();
      console.log('oh boy sending transfer transaction by mnemonic| the params: ', params);
  
      const sender = asset?.params?.creator;
      const recipient = user?.current?.account?.address;
  
      const revocationTarget = undefined;
      const closeRemainderTo = undefined;
  
      const assetId = asset?.index;
  
      const amount = +obtainAssetAmount;
      const note = algosdk.encodeObj(obtainAssetNote);
      console.log('an obj of the trx: ', {
        sender,
        recipient,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        assetId,
        params,
      });
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
      console.log('account from mnemonic: ', account);
      // const confirm = window.confirm()
      const rawSignedTxn = transferTransaction.signTxn(account?.sk);
      const txId = transferTransaction.txID().toString();
      console.log('Singed transaction with txId: %s', txId);
      // submit transaction
      const trxSubmission = await algodClient.sendRawTransaction(rawSignedTxn).do();
      console.log('the transaction submission: ', trxSubmission);
      return trxSubmission;

    } catch (e) {
      console.error(e);
    }
  }
  // https://dappradar.com/blog/algorand-dapp-development-2-standard-asset-management
  
  return (
    <div className={classes.root}>
      {assets?.map(({ asset }, i) => {
        console.log('the asset: ', asset);
        return (
          <Card
            component={Paper}
            key={i}
            className={classes.card}
          >
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
                    disabled={
                      user.current === undefined
                      || Object.keys(user.current).includes('message')
                    }
                    onClick={() => handleToggleOptInCollapse(asset?.index)}
                  >
                    Opt-In
                  </Button>
                )}
            </CardActions>
            {/** Transaction Opt In Methods (mnemonic, myalgoconnect, etc?) */}
            <Collapse
              in={assetOptInCollaspe[asset?.index]}
              timeout="auto"
              unmountOnExit
              className={classes.card}
            >
              <SigningMethods
                handleAssetByMnemonic={() => handleOptInAssetByMnemonic(asset?.index)}
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
          </Card>
        );
      })}
    </div>
  )  
}

export default AssetListComponent;
