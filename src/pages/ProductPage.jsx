import React, { useState } from 'react';
import { useHistory } from 'react-router';
// MUI Core
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
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
// Lab
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
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
  subheader: {
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(1),
    marginTop: theme.spacing(4),
  },
  topMobile: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const ProductPage = () => {
  const history = useHistory();
  const classes = useStyles();
  const [expandTL, setExpandTL] = useState('');
  const propInfo = history?.location?.state?.activeProperty;
  /**
   * Mobile? maxWidth: 415px
   * @type {boolean} - is the current viewpoint mobile?
   */
  const mobile = useMediaQuery('(max-width:415px)');
  /**
   * Handle Expanding Timeline Accordions
   * @param {int} panel panel index
   * @fires setExpandTL to new panel or close
   */
  const handleExpandTL = (panel) => (e, newE) => setExpandTL(newE ? panel : false);
  // console.log('prop info', propInfo);
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
        <div className={
          mobile ? classes.mobileTop : classes.top
        }>
          <div className={classes.imgs}>
            {/* TODO: img file paths: meh good enough for now */}
            {propInfo?.images ? (
              <>
                <img
                  src={`${process.env.REACT_APP_URL_BASE}/${propInfo?.images?.[0]?.path}`}
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
          <h4 className={classes.subheader}>Quick Numbers</h4>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell noWrap>
                  <b>Token Info</b>
                </TableCell>
                <TableCell>
                  <Chip
                    label={propInfo?.status}
                    color={propInfo?.status !== 'sold out'
                      ? 'primary' : 'secondary'}
                  />
                </TableCell>
                <TableCell colSpan={2}>
                  <b>Investment Info</b>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  # Sold
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
                  # Available
                </TableCell>
                <TableCell>
                  {propInfo.tokenInfo.totalAvailable
                    - propInfo.tokenInfo.totalSold}
                </TableCell>
                <TableCell>
                  $ / Token
                </TableCell>
                <TableCell>
                  {`$${+(propInfo.investmentInfo.totalInvestment
                    / propInfo.investmentInfo.totalTokens).toFixed(2)}`}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div>
          <h4 className={classes.subheader}>Project Timeline</h4>
          <Timeline>
            {Array.isArray(propInfo?.projectTimeline) ? (
              propInfo.projectTimeline?.sort((a, b) => 
                new Date(a.date) < new Date(b.date)
              )?.map((tl, i) => (
                <TimelineItem>
                  <TimelineOppositeContent>
                    {tl?.date}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot
                      color={i === 0
                        ? 'secondary' : 'primary'}
                    />
                    {i !== propInfo.projectTimeline.length - 1
                      ? <TimelineConnector /> : null}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Accordion
                      square
                      expanded={expandTL === i}
                      onChange={handleExpandTL(i)}
                    >
                      <AccordionSummary>
                        <b>{tl?.title}</b>
                      </AccordionSummary>
                      <AccordionDetails>
                        {tl?.description}
                      </AccordionDetails>
                    </Accordion>
                  </TimelineContent>
                </TimelineItem>
              ))
            ) : null}
          </Timeline>
        </div>
        <div>
          <h4 className={classes.subheader}>More Numbers</h4>
          <Table size="small">
            {propInfo?.financialInfo ? (
              Object.keys(propInfo.financialInfo).sort().map(f => (
                <TableRow>
                  <TableCell>{f}</TableCell>
                  <TableCell>{propInfo.financialInfo[f]}</TableCell>
                </TableRow>
              ))
            ) : null}
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
