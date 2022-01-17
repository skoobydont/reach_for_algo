/* global AlgoSigner */
import React, { useState } from 'react';
import { useHistory } from 'react-router';
// MUI
import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  weIn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shouldLogIn: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    paddingTop: theme.spacing(1),
  },
  loggedIn: {
    color: '#242729',
  },
  loggedOut: {
    color: theme.palette.text.secondary,
  },
  home: {
    color: theme.palette.text.secondary,
  },
  input: {
    backgroundColor: theme.palette.background.main,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  walletSelectionList: {
    display: 'flex',
    flexDirection: 'column',
  },
  walletSelectionButton: {
    marginBottom: theme.spacing(1),
  },
}));
/**
 * Generate Ledger Options
 * @param {Array} options which ledgers to support
 * @returns {Array} MenuItem array with given options as values
 */
const generateLedgerOptions = (options) => {
  let oIndex = 0;
  const result = [];
  while (oIndex < options?.length) {
    result.push(
      <MenuItem
        value={options[oIndex]}
      >
        {options[oIndex]}
      </MenuItem>
    );
    oIndex += 1;
  }
  return result;
};

const Nav = (props) => {
  // user obj
  const {
    user,
    ledger,
    handleSelectLedgerChange,
    handleGetAccountInfo,
    handleSetAccount,
  } = props;
  const [selectedWallet, setSelectedWallet] = useState('');
  const [algoSignerWalletOptions, setAlgoSignerWalletOptions] = useState(null);

  // css
  const classes = useStyles();
  // to redirect
  const history = useHistory();
  // redirect handlers
  const handleHomeRedirect = () => history.push('/reach_for_algo');
  const handleProfileRedirect = () => history.push('/profile');
  /**
   * Handle Connect Wallet Submit
   * @async
   * @param {String} addr wallet address to update with
   * @fires setSelectedWallet to given address
   * @fires handleSetAccount with updated account info
   */
  const handleConnectWalletSubmit = async (addr) => {
    // update account into
    setSelectedWallet(addr);
    const updatedAccountInfo = await handleGetAccountInfo(addr);
    handleSetAccount(updatedAccountInfo);
  };
  /**
   * Handle Get Accounts To Select From Algo Signer
   * @async
   * @fires setAlgoSignerWalletOptions
   */
  const handleGetAccountsAlgoSigner = async () => {
    await AlgoSigner?.connect();
    const accounts = await AlgoSigner?.accounts({
      ledger,
    });
    setAlgoSignerWalletOptions(accounts);
  };

  return (
    <AppBar
      position="static"
      className={classes.root}
    >
      {user === null
        ? (
          <div className={classes.shouldLogIn}>
            {/* TODO: When / if redesign, if wallet & net based,
              implement workflow to capture relevant info */}
            <Typography>Choose Ledger</Typography>
            <Select
              label="Ledger"
              title="Ledger"
              onChange={handleSelectLedgerChange}
              value={ledger}
              className={classes.input}
            >
              {generateLedgerOptions(['MainNet', 'TestNet', 'BetaNet'])}
            </Select>
            <Typography>Choose Wallet</Typography>
            <div
              className={`${classes.input} ${classes.walletSelectionList}`}
            >
              <Button
                variant="outlined"
                color="primary"
                className={classes.walletSelectionButton}
                disabled={AlgoSigner === undefined}
                onClick={handleGetAccountsAlgoSigner}
              >
                AlgoSigner
                {AlgoSigner === undefined ? ' not detected' : ''}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                className={classes.walletSelectionButton}
              >
                MyAlgo Connect
              </Button>
              <Button
                variant="outlined"
                color="primary"
                disabled={true}
              >
                Algorand Mobile Wallet? (TODO)
              </Button>
            </div>
            {algoSignerWalletOptions?.length > 0
              ? (
                <>
                  <Typography>Available Wallets</Typography>
                  <div className={`${classes.input} ${classes.walletSelectionList}`}>
                    {algoSignerWalletOptions?.map(({ address }, i) => (
                      <Button
                        variant="outlined"
                        color={address === selectedWallet ? "inherit" : "primary"}
                        className={i !== algoSignerWalletOptions?.length
                          ? classes.walletSelectionButton : null}
                        onClick={() => handleConnectWalletSubmit(address)}
                      >
                        {address}
                      </Button>
                    ))}
                  </div>
                </>
              ) : null}
            {/* <TextField
              label="Wallet Address"
              value={walletInput}
              onChange={handleWalletInputChange}
              variant="outlined"
              className={classes.input}
            />
            <Button
              onClick={handleConnectWalletSubmit}
              variant="outlined"
              className={classes.input}
            >
              Begin
            </Button> */}
          </div>
        ) : (
          <div className={classes.weIn}>
            <IconButton
              edge="start"
              aria-label="home"
              onClick={handleHomeRedirect}
              className={classes.home}
            >
              <HomeIcon />
              {ledger?.length > 0 ? (
                <Typography>
                  {ledger}
                </Typography>
              ) : ''}
            </IconButton>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              className={user === null
                ? classes.loggedIn : classes.loggedOut}
              aria-haspopup="true"
              onClick={handleProfileRedirect}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
        )}
    </AppBar>
  );
};

export default Nav;
