## DAR Swap App

This is a DEX (Decentralized Exchange) using ERC20 standard. Implemented using the following stack:

- Frontend
  - Next.js v12.0.8
  - React v17.0.2
  - MUI Material v5.2.8
- Backend
  - Solidity v0.8.11
  - Truffle v5.4.29 (Ethereum development framework)
  - Ganache v2.5.4

![alt text](https://raw.githubusercontent.com/darelleglovo/DAR-ethereum-dex-app/main/public/readme.gif)

## DAR Token

Is an ERC20 token just named before.. well.. my name 😆
It is not deployed on mainnet

## Getting Started

First, connect your MetaMask and run Ganache.
Make sure that `truffle-config.js` and your MetaMask is configured with your local Ganache network configuration.
Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Automated Test

For unit test, run the following command:

```bash
truffle test
```

