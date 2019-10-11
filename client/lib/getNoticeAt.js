import web3 from './web3';
import Notice from './contracts/Notice.json';

export default (address) => {
    return new web3.eth.Contract(
        Notice.abi,
        address
    );
};