import web3 from './web3';
import NoticeItem from './contracts/NoticeItem.json';

export default (address) => {
    return new web3.eth.Contract(
        NoticeItem.abi,
        address
    );
};