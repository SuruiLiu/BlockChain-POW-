# Blockchain Implementation in JavaScript

This project is a simple blockchain implementation written in JavaScript. It demonstrates core blockchain concepts such as transactions, mining, and chain validation.

## Features
- **Transaction Handling**: Create and sign transactions using elliptic curve cryptography (via the Elliptic library).
- **Block Creation**: Blocks store transactions and link to the previous block, forming a chain.
- **Mining**: Blocks are mined by solving a proof-of-work challenge based on difficulty.
- **Chain Validation**: The blockchain validates the integrity of each block and its transactions.
- **Miner Rewards**: Miners are rewarded with cryptocurrency for successfully mining a block.

## Dependencies
- `crypto-js`: For SHA256 hashing to secure blocks and transactions.
- `elliptic`: For elliptic curve cryptography (used to sign and verify transactions).

## Files
- `main.js`: Contains the main blockchain logic, including `Block`, `Transaction`, and `Chain` classes.
- `proofOfWork.js`: Manages mining logic and proof-of-work challenges.
- `package.json`: Contains dependencies and project details.

## How It Works

1. **Transactions**: 
   - Transactions are signed by the sender's private key and verified using their public key.
   
2. **Blocks**:
   - Blocks group transactions and reference the hash of the previous block, forming a chain.
   
3. **Mining**:
   - Miners solve a proof-of-work puzzle by finding a hash with a required number of leading zeros.
   - Once mined, the block is added to the chain and the miner receives a reward.
   
4. **Validation**:
   - The blockchain can be validated to ensure each block and transaction is untampered by checking hashes.

## Usage

1. **Install dependencies**:
   ```bash
   npm install
2. **Run the project**:
   ```bash
   node main.js
## Example Code

Here's how to create a transaction, sign it, add it to the blockchain, and mine it:

```js
// Generate key pairs for sender and receiver
const keyPairSender = ec.genKeyPair();
const publicKeySender = keyPairSender.getPublic('hex');
const keyPairReceiver = ec.genKeyPair();
const publicKeyReceiver = keyPairReceiver.getPublic('hex');

// Create and sign a new transaction
const transaction = new Transaction(publicKeySender, publicKeyReceiver, 10);
transaction.sign(keyPairSender);

// Add the transaction to the blockchain and mine the block
CowCoin.addTransaction(transaction);
CowCoin.mineTransactionPoll(publicKeyReceiver);

// Display the blockchain and its transactions
console.log(CowCoin.chain);
console.log(CowCoin.chain[1].transactions);

```

## License

This project is licensed under the MIT License. The MIT License is a permissive free software license that allows for reuse within proprietary software, provided that all copies include the original license and copyright notice. 

For more details, see the [LICENSE](LICENSE) file included in this repository.
