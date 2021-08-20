
const ProfilePage = (props) => {
  const {
    account,
    balance,
    fundAmount,
    connectWallet,
    fundWallet,
    refresh,
  } = props;

  
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
        </>
      )}
    </div>
  );
}

export default ProfilePage;
