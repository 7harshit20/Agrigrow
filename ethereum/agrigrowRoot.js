const { abi } = require('./build/AgrigrowRoot.json');
const web3 = require('./web3');

module.exports = new web3.eth.Contract(abi, '0x2F96E6AdfA1d4680D2ff96302A27aB15808bD76c');