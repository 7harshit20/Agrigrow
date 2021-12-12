const Web3 = require('web3');

let web3;
if (typeof window.web3 !== 'undefined') {
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
} else {
    console.log('no metamask');
    alert('Please install metamask to continue');
    const provider = new Web3.providers.HttpProvider(process.env.infura_endpoint);
    web3 = new Web3(provider);
}

module.exports = web3;