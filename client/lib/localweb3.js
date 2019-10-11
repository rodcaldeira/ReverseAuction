import Web3 from 'web3';

let local_web3;
const provider = new Web3.providers.HttpProvider(
    'http://localhost:7545'
);

local_web3 = new Web3(provider);

local_web3.eth.accounts.privateKeyToAccount('b043f8a3e051b8fdb0f15b5be8bb3b1a72c480aa8a6bbb473a5adfcaf56afa15');


export default local_web3;