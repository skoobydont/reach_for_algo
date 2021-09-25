import React, { useState } from 'react';
// MUI
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
// Custom
import KYCForm from '../components/KYCForm';
import encryptThis, { encryptObj } from '../utilities/encryptAttr';
import getAttrKey from '../utilities/getAttrKey';

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
  const [isEncrypting, setIsEncrypting] = useState(false);
  // state handlers
  const handleSSN = (e) => setSSN(e.target.value);
  const handleFName = (e) => setFName(e.target.value);
  const handleLName = (e) => setLName(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePhone = (e) => setPhone(e.target.value);
  const handleAddress = (e, attr) => setAddress({ ...address, [attr]: e.target.value });
  const handleIsEncrypting = (val) => setIsEncrypting(val);
  /**
   * Handle Form Submit
   * @param {Object} e event obj
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    handleIsEncrypting(true);
    console.log('the state', {
      ssn,
      fName,
      lName,
      email,
      phone,
      address,
    });
    const theStateRn = {
      ssn,
      fName,
      lName,
      email,
      phone,
      address,
    };
    // encrypt address obj
    const eAddr = encryptObj(theStateRn.address);
    const eAddrStringified = JSON.stringify(eAddr);
    const eAddrES = encryptThis(eAddrStringified, getAttrKey('object'));
    const encryptPayload = {
      ...theStateRn,
      address: eAddrES,
    };
    // console.log('encrypt address res with state', encryptPayload);
    const eState = encryptObj(encryptPayload);
    // console.log('all toghet now', eState);
    const eSString = JSON.stringify(eState);
    // console.log('the string to encrypt ', eSString);
    const encryptedStringifiedObj = encryptThis(eSString, getAttrKey('object'));
    console.log('all done', encryptedStringifiedObj);
    console.log('okeeeeeee now lets try to decode as well');
    const decryptStr = encryptThis(encryptedStringifiedObj, getAttrKey('object'), false);
    const decryptObj = JSON.parse(decryptStr);
    const dRes = encryptObj(decryptObj, false);
    console.log('the decrypted result', dRes);
    console.log('decrypting the address attr');
    const dAddr = encryptThis(dRes?.address, getAttrKey('object'), false);
    // console.log('d addr ? ', dAddr);
    // console.log('json parse', JSON.parse(dAddr));
    const dAddrParsed = JSON.parse(dAddr);
    const dAddrObj = encryptObj(dAddrParsed, false);
    console.log('the decrypted addr', dAddrObj);
    handleIsEncrypting(false);
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
          {isEncrypting ? <LinearProgress /> : (
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
          )}
        </>
      )}
    </div>
  );
}

export default ProfilePage;
