import React, { useState } from 'react';
import Cryptr from 'cryptr';
// MUI
import Typography from '@material-ui/core/Typography';
// Custom
import KYCForm from '../components/KYCForm';

const ProfilePage = (props) => {
  const {
    account,
    balance,
    fundAmount,
    connectWallet,
    fundWallet,
    refresh,
  } = props;
  // state
  const [ssn, setSSN] = useState('');
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({
    street: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
  });
  // handlers
  const handleSSN = (e) => setSSN(e.target.value);
  const handleFName = (e) => setFName(e.target.value);
  const handleLName = (e) => setLName(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePhone = (e) => setPhone(e.target.value);
  const handleAddress = (e, attr) => setAddress({ ...address, [attr]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('the state', {
      ssn,
      fName,
      lName,
      email,
      phone,
      address,
    });
    // for each attr, encrypt
  };
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
  // console.log('pfol page props', props);
  return (
    <div>
      {refresh ? <div>Loading</div> : (
        <>
          {account?.current ? (
            <>
              {balance?.current !== null
                ? <div>Current Balance: {`${balance.current}`}</div>
                : null}
              <br />
              <input title="Fund Amount" onChange={e => fundAmount.current = e.target.value} />
              <button onClick={fundWallet}>fund wallet</button>
            </>
          ) : (
            <>
              <div>No Wallet Connected</div>
              <button onClick={connectWallet}>connect wallet</button>
            </>
          )}
          <Typography>Encrypt some text</Typography>
          <KYCForm
            ssn={ssn}
            handleSSN={handleSSN}
            fName={fName}
            handleFName={handleFName}
            lName={lName}
            handleLName={handleLName}
            email={email}
            handleEmail={handleEmail}
            phone={phone}
            handlePhone={handlePhone}
            address={address}
            handleAddress={handleAddress}
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
}

export default ProfilePage;
