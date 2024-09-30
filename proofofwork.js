// make sure every ten minutes a new block can be add to the chain

const sha256 = require('crypto-js/sha256')

console.log(sha256('lsr').toString())
// console.log(sha256('abc1').toString())
//ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad

function proofOfWork() {
    let data = 'lsr'
    let x = 1
    while (true) {
        if (sha256(data + x).toString().substring(0, 4) !== '0000') {
            x = x + 1;
        } else {
            console.log(sha256(data + x).toString())
            console.log(x)
            break
        }
    }
}

proofOfWork()

