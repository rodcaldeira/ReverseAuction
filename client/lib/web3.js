import Web3 from 'web3';

let web3;
let provider;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    window.web3.currentProvider.enable();
    provider = window.web3.currentProvider;
} else {
    provider = new Web3.providers.HttpProvider(
        'http://localhost:7545'
    );
}

web3 = new Web3(provider);

export default web3;