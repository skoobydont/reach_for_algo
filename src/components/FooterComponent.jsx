import React from 'react';
import { useHistory } from 'react-router';
// MUI
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core';
// Icons
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    marginTop: theme.spacing(1),
  },
  icon: {
    maxWidth: theme.spacing(5),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(-1),
  },
}));

const Footer = () => {
  const classes = useStyles();
  const history = useHistory();
  const handleHomeRedirect = () => history?.replace('/reach_for_algo');
  return (
    <BottomNavigation className={classes.root}>
      <BottomNavigationAction
        icon={<HomeIcon />}
        className={classes.icon}
        onClick={handleHomeRedirect}
      />
    </BottomNavigation>
  );
}

export default Footer;
