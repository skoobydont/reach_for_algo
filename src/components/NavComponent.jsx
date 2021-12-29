import React from 'react';
import { useHistory } from 'react-router';
// MUI
import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  bar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const Nav = () => {
  // css
  const classes = useStyles();
  // to redirect
  const history = useHistory();
  // redirect handlers
  const handleHomeRedirect = () => history.replace('/reach_for_algo');
  const handleProfileRedirect = () => history.replace('/profile');
  return (
    <AppBar position="static" className={classes.bar}>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="home"
        onClick={handleHomeRedirect}
      >
        <HomeIcon />
      </IconButton>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        className={classes.account}
        aria-haspopup="true"
        onClick={handleProfileRedirect}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
    </AppBar>
  )
};

export default Nav;
