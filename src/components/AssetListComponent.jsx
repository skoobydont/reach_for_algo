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
  } = props;
  const classes = useStyles();
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
  // TDOD: const handleOptInAsset()
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
              <Button>
                Opt-In
              </Button>
            </CardActions>
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
