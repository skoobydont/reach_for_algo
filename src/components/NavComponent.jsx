import React, { useState } from 'react';
import { useHistory } from 'react-router';
// MUI
import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const useStyles = makeStyles((theme) => ({
  bar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '12px',
  },
}));

const Nav = () => {
  // css
  const classes = useStyles();
  // to redirect
  const history = useHistory();
  // menu item anchor element state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // handlers
  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  // redirect handlers
  const handleHomeRedirect = () => history.replace('/');
  const handleProfileRedirect = () => history.replace('/profile');
  const handleAccountRedirect = () => history.replace('/account');
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
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={handleProfileRedirect}
          >
            Profile
          </MenuItem>
          <MenuItem
            onClick={handleAccountRedirect}
          >
            My account
          </MenuItem>
        </Menu>
    </AppBar>
  )
};

export default Nav;
