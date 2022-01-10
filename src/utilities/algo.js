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
}

module.exports = {
  waitForConfirmation,
  createOptInTrx,
};
