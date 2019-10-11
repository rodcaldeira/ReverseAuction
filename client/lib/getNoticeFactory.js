import contractDefNoticeFactory from './contracts/NoticeFactory.json'
import web3 from './web3';

// create the instance
const instance = new web3.eth.Contract(
  contractDefNoticeFactory.abi,
  "0x3e82b106d67e2c492e472822bdba3ef58918571d"
)

export default instance;

