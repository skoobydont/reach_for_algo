# Getting Started with Reach & Algorand

## Setup
***ensure you configure a wallet with AglorandSigner prior & keep the mnemonic handy***

1. open your favorite command-line interface tool
2. `cd` to where you keep your fun projects
3. clone the repository: `git clone https://github.com/skoobydont/reach_for_algo.git`
4. go into `src` dir: `cd /reach_for_algo/src`
5. within the `src` dir, run `REACH_CONNECTOR_MODE=ALGO ./reach devnet`
  a. this will standup our devnet docker container
  b. **Must have `make`, `docker`, & `docker-compose` installed**
6. once the devnet is up, open a separate cli window
7. navigate to the `/reach_for_algo` directory
8. within the main directory, run `npm i; npm start`
  a. this will install dependencies & start the dev server
9. navigate to `localhost:3000/` to view the application
10. you can now enter your mnemonic phrase to connect your wallet to the devnet

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
