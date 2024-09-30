const sha256 = require('crypto-js/sha256')
const ecLib = require('elliptic').ec
const ec = new ecLib('secp256k1') // curve name

class Transaction {
    constructor(from, to, amount) {
        this.from = from
        this.to = to
        this.amount = amount
    }

    computeHash() {
        return sha256(this.from + this.to + this.amount).toString()
    }

    sign(key) {
        this.signature = key.sign(this.computeHash(), 'base64').toDER('hex')
    }

    Validate() {
        // from incentive
        if (this.from === '') {
            return true
        }
        const publicKey = ec.keyFromPublic(this.from, 'hex')
        return publicKey.verify(this.computeHash(), this.signature)
    }
}

class Block {
    constructor(transactions, previousHash) {
        this.transactions = transactions
        this.previousHash = previousHash
        this.nounce = 1
        this.timestamp = Date.now()
        this.hash = this.computeHash()
    }

    computeHash() {
        return sha256(JSON.stringify(this.transactions)
            + this.previousHash
            + this.nounce
            + this.timestamp
        ).toString()
    }

    getAnswer(difficulty) {
        let answer = ''
        for (let i = 0; i < difficulty; i++) {
            answer = answer + '0'
        }
        return answer
    }
    //compute hash satisfying the difficulty of the chain
    mine(difficulty) {
        this.validateTransactions()
        while (true) {
            this.hash = this.computeHash()
            if (this.hash.substring(0, difficulty) !== this.getAnswer(difficulty)) {
                this.nounce++
            } else {
                break
            }
        }
        console.log('complete mining!', this.hash)
    }

    validateTransactions() {
        for (let transaction of this.transactions) {
            if (!transaction.Validate()) {
                console.log('invalid transaction from Block transactions, false transaction!')
                return false
            }
        }
        return true
    }
}

class Chain {
    constructor() {
        this.chain = [this.bigBang()]
        this.transactionsPool = []
        this.minerReward = 50
        this.difficulty = 3
    }

    bigBang() {
        let genesisBlock = new Block('ancestor', '')
        return genesisBlock
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    //add transaction to transactionPoll
    addTransaction(transaction) {
        if (!transaction.Validate()) {
            throw new Error('invalid transaction')
        }
        console.log('valid transaction')
        this.transactionsPool.push(transaction)
    }

    addBlockToChain(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.mine(this.difficulty)
        this.chain.push(newBlock)
    }

    mineTransactionPoll(minerRewardAddress) {
        //incentive
        const minerRewardTransaction = new Transaction('', minerRewardAddress, this.minerReward)
        this.transactionsPool.push(minerRewardTransaction)

        //mine
        const newBlock = new Block(this.transactionsPool, this.getLatestBlock().hash)
        newBlock.mine(this.difficulty)

        this.chain.push(newBlock)
        this.transactionsPool = []
    }

    //for each Block need to validate the compute hash ?= hash(prevent data be changed)
    //check previousHash ?= previous Block.hash(prevent the chain broke)
    validateChain() {
        if (this.chain.length === 1) {
            if (this.chain[0].hash === this.chain[0].computeHash()) {
                return true
            } else {
                return false
            }
        }

        for (let i = 1; i < this.chain.length; i++) {
            let toValidateBlock = this.chain[i]
            if (!toValidateBlock.validateTransactions()) {
                console.log('illegal transactions')
                return false
            }
            if (toValidateBlock.hash !== toValidateBlock.computeHash()) {
                console.log('data has been changed')
                return false
            }
            if (toValidateBlock.previousHash !== this.chain[i - 1].hash) {
                console.log('the chain is broken')
                return false
            }

        }
        return true
    }
}


const CowCoin = new Chain()

const keyPairSender = ec.genKeyPair()
const privateKeySender = keyPairSender.getPrivate('hex')
const publicKeySender = keyPairSender.getPublic('hex')

const keyPairReceiver = ec.genKeyPair()
const privateKeyReceiver = keyPairReceiver.getPrivate('hex')
const publicKeyReceiver = keyPairReceiver.getPublic('hex')

const t1 = new Transaction(publicKeySender, publicKeyReceiver, 10)
t1.sign(keyPairSender)
console.log(t1)
console.log(t1.Validate())

// t1.amount = 20
CowCoin.addTransaction(t1)
CowCoin.mineTransactionPoll(publicKeyReceiver)
console.log(CowCoin.chain)
console.log(CowCoin.chain[1].transactions)
// const t2 = new Transaction('addr2', 'addr1', 5)

// CowCoin.addTransaction(t1)
// CowCoin.addTransaction(t2)

// console.log(CowCoin)
// CowCoin.mineTransactionPoll('addr3')
// console.log(CowCoin)
// console.log(CowCoin.chain[1])
// console.log(CowCoin.chain[1].transactions)


// let newchain = new Chain()
// // console.log(newchain)
// newchain.addBlockToChain(new Block('lsr1'))
// newchain.addBlockToChain(new Block('lsr2'))

// console.log(newchain)





// let newBlock = new Block('lsr', '')
// console.log(newBlock)