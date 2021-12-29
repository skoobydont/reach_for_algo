import React from 'react';
// MUI
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
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
}));

const AssetListComponent = (props) => {
  const {
    assets,
  } = props;
  const classes = useStyles();

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
            
          </Card>
        );
      })}
    </div>
  )  
}

export default AssetListComponent;
