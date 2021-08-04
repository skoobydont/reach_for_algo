import './App.css';
import * as reach from '@reach-sh/stdlib/ALGO';
import { useRef } from 'react';

function App() {
  const account = useRef();
  const balance = useRef();

  // helpers
  const getAccount = async () => {
    account.current = await reach.getDefaultAccount();
    console.log('account current: ', account.current);
  }
  const getBalance = async () => {
    /**
     * balanceOf returns in microalgos
     */
    let rawBalance = await reach.balanceOf(account.current);
    /**
     * format microalgos to Algos
     */
    balance.current = reach.formatCurrency(rawBalance, 4);
    console.log('balance current: ', balance.current);
  }
  /**
   * Connect to Wallet
   * @async
   * @fires getAccount
   * @fires getBalance
   */
  const connectWallet = async () => {
    await getAccount();
    await getBalance();
  }
  return (
    <div className="App">
      <button onClick={connectWallet}>connect wallet</button>
    </div>
  );
}

export default App;
