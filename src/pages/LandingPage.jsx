import React from 'react';
// MUI
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'colum',
    paddingLeft: '12px',
    paddingTop: '8px',
    justifyContent: 'center',
  },
}));

const LandingPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      Real Estate For The Digital Age
    </div>
  );
}
export default LandingPage;
