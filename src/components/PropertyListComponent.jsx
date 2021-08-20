import React, { useState } from 'react';
import { useHistory } from 'react-router';
// MUI
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
// Custom
import displayAddress from '../utilities/displayAddress';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
  listHeader: {
    flexDirection: 'row',
    display: 'flex',
  },
  collapse: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const PropertyCard = (props) => {
  const {
    property,
    classes,
  } = props;
  const history = useHistory();
  const [expandMore, setExpandMore] = useState(false);
  const handlePropertyRedirect = () => history.push(`/property/${property?.id}`,
    { activeProperty: property },
  );
  return (
    <Card className={classes.root} key={property?.id}>
      <div className={classes.listHeader}>
        {/* <IconButton
          onClick={() => setExpandMore(!expandMore)}
          aria-expanded={expandMore}
          aria-label="show more"
        >
          {expandMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton> */}
        <CardActionArea
          onClick={
            // expandMore ?
            () => handlePropertyRedirect()
            // : () => setExpandMore(!expandMore)
          }
        >
          <Typography>
            {displayAddress(property?.propertyInfo?.address)}
          </Typography>
        </CardActionArea>
        {/* <IconButton
          style={expandMore
            ? { visibility: 'visible' }
            : { visibility: 'hidden' }
          }
          onClick={() => handlePropertyRedirect()}
        >
          <ArrowForwardIcon />
        </IconButton> */}
      </div>
      <Collapse in={expandMore} timeout="auto" unmountOnExit className={classes.collapse}>
        <CardContent>
            <Typography>
              Stats
            </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => history.push(
              `/property/${property?.id}`,
              { activeProperty: property },
            )}
          >
            Learn More
          </Button>
        </CardActions>
      </Collapse>
    </Card>
  )
}

const PropertyListComponent = (props) => {
  const { data } = props;
  const classes = useStyles();

  return Array.isArray(data) ? (
    data?.map((prop) => (
      <PropertyCard
        property={prop}
        classes={classes}
      />
    ))
  ) : <Typography>No Data</Typography>;
}

export default PropertyListComponent;
