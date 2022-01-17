# Repository demonstrating Algorand blockchain & React.js application integration

There are a few environment variables you need before running this locally.

I would recommend filling out the `TestNet` values while running locally but if you define the `MainNet` or `BetaNet` values, they are supported.

1. The following will need to be defined for each net in an `env` file:
  - `ALGOD_SERVER_URL`
  - `INDEXER_SERVER_URL`
  - `PURESTAKE_API_KEY`
    - This API key can be managed in your PureStake account
2. Within the repo directory, install node packages with `npm install`
3. Start the node server & launch the application on port 3000 with `npm start`