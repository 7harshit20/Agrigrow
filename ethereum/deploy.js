const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider')
const { abi, evm } = require('./build/AgrigrowRoot.json');
const path = require('path');
if (process.env.NODE_ENV !== 'production') require('dotenv').config({ path: path.resolve(__dirname, '../', '.env') });

let provider;
try {
    provider = new HDWalletProvider(process.env.mnemonic, process.env.infura_endpoint);
} catch (error) {
    console.log('Variable not set.', error);
    process.exit(1);
}

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Deploying from account with address: ', accounts[0]);


    const result = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object })
        .send({ from: accounts[0], gas: '1000000' });

    console.log('Contract deployed to', result.options.address);
    provider.engine.stop();
};
deploy();

