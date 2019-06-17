# Smart Lease Contract
<img  src="https://img.shields.io/badge/language-solidity-green.svg"  alt="Language"  /> <img  src="https://img.shields.io/badge/license-MIT-9cf.svg"  alt="License"  />

A smart lease contract hosted on Ethereum using Truffle v5.0.15, Solidity v0.5.0 (solc-js) & Web3.js v1.0.0.

The idea behind this smart contract is to be a replacement (for now a supplement) to the oldschool, paper written lease contract. It provides all the functionalities of a lease contract and allows the terms to be changed dinamically. This makes it far more robust and flexible to change of agreements.

## Install
Make sure you have [npm](https://nodejs.org/en/download/) installed on your machine. Node package manager comes bundled with node.js.

Then install truffle:
```
npm install truffle -g
```
Download your personal, test Ethereum blockchain [Ganache](https://www.trufflesuite.com/ganache) (desktop app). 

You can also install the Ganache command line version if you prefer:
```
npm install ganache-cli -g
```

## Functionality Roadmap

### Initialize contract

The landlord deploys the contract to the network and passes the occupancy limit of the rental unit.

### Submit written contract

The reason to have a written version of the contract is to be able to still exist in the legal framework. Perhaps one day this will not be necessary.

The contract is uploaded as a PDF to IPFS and it's hash reference is updated on the smart contract by the landlord. Storing large files on the Ethereum network is expensive - this way we have a reference to the file, but it's stored on a different system.

### Assigning tenants

Only after the written contract is proposed, the landlord is able to assign tenants. In the assignment, the landlord must specify tenant's wallet address, the rent and the deposit associated with the tenant.

### Contract signing

Each tenant has access to the proposed terms. After carefully reviewing the terms, the tenant is able to sign the contract.

After the tenant has entered the rental agreement, he can pay his deposit.
