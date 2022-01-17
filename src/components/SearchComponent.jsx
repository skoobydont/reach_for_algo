import React from 'react';
import PropTypes from 'prop-types';
// MUI
import { makeStyles } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
// Icons
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
  searchIcon: {
    marginRight: theme.spacing(1),
  },
}));

const SearchComponent = (props) => {
  const {
    searchValue,
    handleValueChange,
  } = props;
  const classes = useStyles();
  return (
    <InputBase
      placeholder="Search…"
      value={searchValue}
      inputProps={{ 'aria-label': 'search' }}
      onChange={(e) => handleValueChange(e.target.value)}
      startAdornment={(
        <SearchIcon color="primary" className={classes.searchIcon} />
      )}
      endAdornment={(
        <IconButton
          onClick={() => handleValueChange('')}
          style={{
            visibility: searchValue?.length > 0
              ? 'visible' : 'hidden'
          }}
        >
          <CancelIcon
            color="primary"
            fontSize="small"
          />
        </IconButton>
      )}
    />
  );
};

SearchComponent.propTypes = {
  searchValue: PropTypes.string,
  handleValueChange: PropTypes.func,
};

SearchComponent.defaultProps = {
  searchValue: '',
  handleValueChange: () => null,
};

export default SearchComponent;
