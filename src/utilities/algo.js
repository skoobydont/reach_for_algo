const waitForConfirmation = async (algodClient, trxId) => {
  let lastRound = (await algodClient.status().do())['last-round'];
  while (true) {
    const pendingInfo = await algodClient.pendingTransactionInformation(trxId).do();
    if (pendingInfo['confirmed-round'] !== null && pendingInfo['confirmed-round'] > 0) {
      // transaction completed
      console.log(`Transaction confirmed in round ${pendingInfo['confirmed-round']}`);
      return pendingInfo;
    }
    lastRound += 1;
    await algodClient.statusAfterBlock(lastRound).do();
  }
};

module.exports = {
  waitForConfirmation,
};
