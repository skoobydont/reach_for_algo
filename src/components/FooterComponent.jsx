import React from 'react';
import { useHistory } from 'react-router';
// MUI
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
// Icons
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
  },
}))

const Footer = () => {
  const classes = useStyles();
  const history = useHistory();
  const handleHomeRedirect = () => history.replace('/reach_for_algo');
  return (
    <BottomNavigation className={classes.root}>
      <BottomNavigationAction
        icon={<HomeIcon />}
        onClick={handleHomeRedirect}
      />
    </BottomNavigation>
  );
}

export default Footer;
