export default (attr, encrypt = true) => {
  switch (attr) {
    case 'ssn':
      return process.env.REACT_APP_SSN_ENCRYPT_KEY;
    case 'fName':
      return process.env.REACT_APP_FNAME_ENCRYPT_KEY;
    case 'lName':
      return process.env.REACT_APP_LNAME_ENCRYPT_KEY;
    case 'email':
      return process.env.REACT_APP_EMAIL_ENCRYPT_KEY;
    case 'phone':
      return process.env.REACT_APP_PHONE_ENCRYPT_KEY;
    case 'address':
      return process.env.REACT_APP_ADDRESS_ENCRYPT_KEY;
    case 'street':
      return process.env.REACT_APP_STREET_ENCRYPT_KEY;
    case 'street2':
      return process.env.REACT_APP_STREET2_ENCRYPT_KEY;
    case 'city':
      return process.env.REACT_APP_CITY_ENCRYPT_KEY;
    case 'state':
      return process.env.REACT_APP_STATE_ENCRYPT_KEY;
    case 'zip':
      return process.env.REACT_APP_ZIP_ENCRYPT_KEY; 
    case 'attribute':
      return process.env.REACT_APP_ATTRIBUTE_ENCRYPT_KEY;
    default:
      return null;
    }
}