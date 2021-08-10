import React from 'react';
import { useHistory } from 'react-router';
// MUI
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
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
  deets: {
    display: 'flex',
    flexDirection: 'column',
  },
  deetHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  chip: {
    '& span': {
      paddingTop: '4px',
    },
  },
  numbers: {
    '& h4': {
      width: '100%',
      backgroundColor: theme.palette.primary.main,
      padding: theme.spacing(1),
      marginTop: theme.spacing(4),
    }
  }
}));

const ProductPage = () => {
  const history = useHistory();
  const classes = useStyles();
  const propInfo = history?.location?.state?.activeProperty;
  console.log('prop info', propInfo);
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
            {/* TODO: img file paths */}
            {propInfo?.images ? (
              <>
                <img
                  src={`${propInfo?.images?.[0]?.path}`}
                  alt={`${displayAddress(
                    propInfo?.propertyInfo.address
                  )}-pics`}
                />
              </>
            ) : null}
          </div>
          <div className={classes.deets}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Property Info</b>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={
                        propInfo?.propertyInfo.vacant === 'occupied'
                        ? 'primary' : 'secondary'
                      }
                      label={
                        propInfo?.propertyInfo.vacant === 'occupied'
                        ? 'Occupied' : 'Vacant'}
                      className={classes.chip}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <b>Occupancy</b>
                  </TableCell>
                  <TableCell>{propInfo?.propertyInfo.vacant}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Bath</b>
                  </TableCell>
                  <TableCell>{propInfo?.propertyInfo.bath}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Bedroom(s)</b>
                  </TableCell>
                  <TableCell>{propInfo?.propertyInfo.bedrooms}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Type</b>
                  </TableCell>
                  <TableCell>{propInfo?.propertyInfo.propertyType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Sqft</b>
                  </TableCell>
                  <TableCell>{propInfo?.propertyInfo.sqft}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Year Built</b>
                  </TableCell>
                  <TableCell>{propInfo?.propertyInfo.yearBuilt}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        <div className={classes.numbers}>
          <h4>The Numbers</h4>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>
                  Token Info
                </TableCell>
                <TableCell>
                  <Chip
                    label={propInfo?.status}
                    color={propInfo?.status !== 'sold out'
                      ? 'primary' : 'secondary'}
                  />
                </TableCell>
                <TableCell colSpan={2}>
                  Investment Info
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Tokens Sold
                </TableCell> 
                <TableCell>
                  {propInfo.tokenInfo.totalSold}
                </TableCell>
                <TableCell>
                  Total Investment
                </TableCell>
                <TableCell>
                  {propInfo.investmentInfo.totalInvestment}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  # available
                </TableCell>
                <TableCell>
                  {propInfo.tokenInfo.totalAvailable
                    - propInfo.tokenInfo.totalSold}
                </TableCell>
                <TableCell>
                  $ / Token
                </TableCell>
                <TableCell>
                  {`$ ${+(propInfo.investmentInfo.totalInvestment
                  / propInfo.investmentInfo.totalTokens).toFixed(2)}`}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
