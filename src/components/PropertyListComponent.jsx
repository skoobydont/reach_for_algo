import React from 'react';
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
// Custom
import displayAddress from '../utilities/displayAddress';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(1),
  },
}));

const PropertyCard = (props) => {
  const {
    property,
    classes,
  } = props;
  const history = useHistory();
  return (
    <Card className={classes.root} key={property?.id}>
      <CardActionArea
        onClick={() => history.push(
          `/property/${property?.id}`,
          { activePropery: property },
        )}
      >
        {/* <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          title="TODO: repalce with actual p[ics"
        /> */}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {displayAddress(property?.propertyInfo?.address)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => history.push(
            `/property/${property?.id}`,
            { activePropery: property },
          )}
        >
          Learn More
        </Button>
      </CardActions>
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
