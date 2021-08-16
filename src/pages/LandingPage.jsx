import React, { useState } from 'react';
// MUI
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
// Custom
import SearchComponent from '../components/SearchComponent';
import exampleData from '../example-data.json';
import PropertyListComponent from '../components/PropertyListComponent';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '12px',
    paddingTop: '8px',
    justifyContent: 'center',
    '& .MuiInputBase-root': {
      margin: 'auto',
      maxWidth: theme.spacing(35),
    },
  },
}));

const LandingPage = () => {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [data, setData] = useState([...exampleData?.data]);
  console.log('tyhe daata', data);
  return (
    <div className={classes.root}>
      <Typography variant="subtitle1" color="primary">
        Real Estate For The Digital Age
      </Typography>
      <SearchComponent
        searchValue={search}
        handleValueChange={setSearch}
      />
      {data?.length > 0 && (
        <PropertyListComponent data={data} setData={setData} />
      )}
    </div>
  );
}
export default LandingPage;
