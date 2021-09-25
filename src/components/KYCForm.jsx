import React from 'react';
// MUI
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
/*
  ssn: int,
  fname: string,
  lname: string,
  email: string,
  phone: float,
  address: obj: {
    street: string,
    street2: string | null,
    city: string,
    state: string (abbrv),
    zip: float,
  }
*/
const KYCForm = (props) => {
  const {
    ssn,
    handleSSN,
    fName,
    handleFName,
    lName,
    handleLName,
    email,
    handleEmail,
    phone,
    handlePhone,
    address,
    handleAddress,
    handleSubmit,
  } = props;
  
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="SSN"
        value={ssn}
        onChange={handleSSN}
        />
      <TextField
        label="First Name"
        value={fName}
        onChange={handleFName}
        />
      <TextField
        label="Last Name"
        value={lName}
        onChange={handleLName}
        />
      <TextField
        label="Email"
        value={email}
        onChange={handleEmail}
      />
      <TextField
        label="Phone"
        value={phone}
        onChange={handlePhone}
      />
      <TextField
        label="Street"
        value={address?.street}
        onChange={(e) => handleAddress(e, 'street')}
      />
      <TextField
        label="Street 2"
        value={address?.street2}
        onChange={(e) => handleAddress(e, 'street2')}
      />
      <TextField
        label="City"
        value={address?.city}
        onChange={(e) => handleAddress(e, 'city')}
      />
      <TextField
        label="State"
        value={address?.state}
        onChange={(e) => handleAddress(e, 'state')}
      />
      <TextField
        label="Zip"
        value={address?.zip}
        onChange={(e) => handleAddress(e, 'zip')}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
      >
        Submit
      </Button>
    </form>
  )
}

export default KYCForm;
