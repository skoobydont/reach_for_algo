/**
 * Wait For Transaction Confirmation
 * @async
 * @param {Object} algodClient instance of algod client
 * @param {String | Number} trxId transaction id to look for
 * @returns {Object} the confirmation response object
 */
const waitForConfirmation = async (algodClient, trxId) => {
  let lastRound = (await algodClient.status().do())['last-round'];
  while (true) {
    const pendingInfo = await algodClient.pendingTransactionInformation(trxId).do();
    if (pendingInfo['confirmed-round'] !== null && pendingInfo['confirmed-round'] > 0) {
      // transaction completed at pendingInfo['confirmed-round']
      return pendingInfo;
    }
    lastRound += 1;
    await algodClient.statusAfterBlock(lastRound).do();
  }
};
/**
 * Create Opt In Transaction Object
 * @async
 * @param {Object} algosdk 
 * @param {String} sender address string
 * @param {Object} params suggested params
 * @param {Object} asset asset to opt into
 * @returns {Promise} transfer transaction object
 */
 const createOptInTrx = async (algosdk, sender, params, asset) => {
  try {
    // for opt-in, sender & recipient will be the same address
    const send = sender;
    const recipient = send;
    // We set revocationTarget to undefined as this is not a clawback operation
    const revocationTarget = undefined;
    // CloseReaminerTo is set to undefined as we are not closing out an asset
    const closeRemainderTo = undefined;
    const amount = 0;
    // Construct transaction object
    return await algosdk.makeAssetTransferTxnWithSuggestedParams(
      send,
      recipient,
      closeRemainderTo,
      revocationTarget,
      amount,
      undefined,
      asset?.index,
      params,
    );
  } catch (e) {
    console.error(e);
  }
};
/**
 * Get Algod Server Url
 * @param {String} ledger ledger option
 * @returns {String} appropriate string process env value if present
 */
const getAlgoServer = (ledger, env) => {
  console.log(`get the algo server for ledger: ${ledger} | env: ${env.REACT_APP_TESTNET_ALGOD_SERVER_URL}`);
  switch(ledger) {
    case 'MainNet':
      return env.REACT_APP_MAINNET_ALGOD_SERVER_URL;
    case 'TestNet':
      return env.REACT_APP_TESTNET_ALGOD_SERVER_URL;
    case 'BetaNet':
      return env.REACT_APP_BETANET_ALGOD_SERVER_URL;
    default:
      return '';
  }
}
/**
 * Get Indexer Server Url
 * @param {String} ledger ledger option
 * @returns {String} appropriate string process env value if present
 */
const getIndexerServer = (ledger, env) => {
  switch(ledger) {
    case 'MainNet':
      return env.REACT_APP_MAINNET_INDEXER_SERVER_URL;
    case 'TestNet':
      return env.REACT_APP_TESTNET_INDEXER_SERVER_URL;
    case 'BetaNet':
      return env.REACT_APP_BETANET_INDEXER_SERVER_URL;
    default:
      return '';
  }
}
/**
 * Get Appropriate PureStake API Key
 * @param {String} ledger ledger option
 * @returns {String} appropriate string process env value if present
 */
const getPureStakeAPIToken = (ledger, env) => {
  switch(ledger) {
    case 'MainNet':
      return env.REACT_APP_MAINNET_PURESTAKE_API_KEY;
    case 'TestNet':
      return env.REACT_APP_TESTNET_PURESTAKE_API_KEY;
    case 'BetaNet':
      return env.REACT_APP_BETANET_PURESTAKE_API_KEY;
    default:
      return '';
  }
}

export {
  waitForConfirmation,
  createOptInTrx,
  getAlgoServer,
  getIndexerServer,
  getPureStakeAPIToken,
};
