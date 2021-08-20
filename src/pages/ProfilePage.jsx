import * as reach from '@reach-sh/stdlib/ALGO';
import { useRef, useState } from 'react';

const ProfilePage = () => {
  const account = useRef();
  const balance = useRef();
  const fundAmount = useRef();
  const [refresh, setRefresh] = useState(false);

  // helpers
  /**
   * Fund Wallet With TestNet Algo
   * @async
   * @fires setRefresh
   */
  const fundWallet = async () => {
    setRefresh(true);
    const faucet = await reach.getFaucet();
    await reach.transfer(
      faucet,
      account.current,
      reach.parseCurrency(fundAmount.current),
    );
    await getBalance();
    setRefresh(false);
  }
  /**
   * Get Account
   * @async
   * @returns {Promise} set current account to result of reach.getDefaultAccount()
   */
  const getAccount = async () => account.current = await reach.getDefaultAccount();
  const getBalance = async () => {
    /**
     * balanceOf returns in microalgos
     */
    const rawBalance = await reach.balanceOf(account.current);
    /**
     * format microalgos to Algos & assign to current balance
     */
    balance.current = reach.formatCurrency(rawBalance, 4);
  }
  /**
   * Connect to Wallet
   * @async
   * @fires getAccount
   * @fires getBalance
   * @fires setRefresh
   */
  const connectWallet = async () => {
    await getAccount();
    setRefresh(true);
    await getBalance();
    setRefresh(false);
  }
  return (
    <div>
      {refresh ? <div>Loading</div> : (
        <>
          <button onClick={connectWallet}>connect wallet</button>
          {account.current ? (
            <>
              {balance.current !== null
                ? <div>Current Balance: {`${balance.current}`}</div>
                : null}
              <br />
              <input title="Fund Amount" onChange={e => fundAmount.current = e.target.value} />
              <button onClick={fundWallet}>fund wallet</button>
            </>
          ) : <div>No Wallet Connected</div>}
        </>
      )}
    </div>
  );
}

export default ProfilePage;
