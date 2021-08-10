import React from 'react';
import { useHistory } from 'react-router';
// MUI
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
// Icons
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
// Utils
import displayAddress from '../utilities/displayAddress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
}));

const ProductPage = () => {
  const history = useHistory();
  const classes = useStyles();
  const propInfo = history?.location?.state?.activeProperty;
  console.log('hi9sotry', history);
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <IconButton onClick={() => history.goBack()}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="h2" style={{ margin: 'auto' }}>
          {displayAddress(history?.location?.state?.activeProperty?.propertyInfo?.address)}
        </Typography>
      </div>
      <div className={classes.body}>
        <div className={classes.top}>
          <div className={classes.imgs}>
            put imgs here
          </div>
          <div className={classes.deets}>
            Some Stats &amp; Deets
          </div>
        </div>
        <div>
          the rest of the info
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
