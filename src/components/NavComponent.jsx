import React from 'react';
import { useHistory } from 'react-router';
// MUI
import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => {
  console.log('the theme', theme);
  return (
    {
      bar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
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
    }
  );
});

const Nav = (props) => {
  // user obj
  const { user } = props;
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
        aria-label="home"
        onClick={handleHomeRedirect}
        className={classes.home}
      >
        <HomeIcon />
      </IconButton>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        className={user?.current === undefined
          ? classes.loggedIn : classes.loggedOut}
        aria-haspopup="true"
        onClick={handleProfileRedirect}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
    </AppBar>
  );
};

export default Nav;
