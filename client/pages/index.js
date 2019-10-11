import React, { Component } from 'react';
import { Card, Button, Accordion, Icon } from 'semantic-ui-react';
// import Link from 'next/link';
import { Link } from '../routes';
import Layout from '../components/Layout';
import factory from '../lib/getNoticeFactory'
import web3 from '../lib/web3';
import localweb3 from '../lib/localweb3';
import contractDefNoticeFactory from '../lib/contracts/NoticeFactory.json'
import contractDefNotice from '../lib/contracts/Notice.json'
import contractDefNoticeItem from '../lib/contracts/NoticeItem.json'
import getContractInstanceAt from '../lib/getContractAt';
import NoticeInfo from '../components/NoticeInfo';
import getNoticeAt from '../lib/getNoticeAt';

class NoticesIndex extends Component {
  state = { accordion_active_index: 0 }


  static async getInitialProps() {
    const notices = await factory.methods.getNotices().call();
    // const address = factory
    const local_accounts = await localweb3.eth.getAccounts();
    const accounts = await web3.eth.getAccounts();
    const actual_blocknumber = await web3.eth.getBlockNumber();
    
    let notice_summary = [];
    for (const address of notices) {
      let metamask = accounts[0];
      let notice_instance = getNoticeAt(address);
      let notice_owner = notice_instance.methods.notice_owner().call();
      let i_publish_bn = await notice_instance.methods.i_publish_bn().call();
      let notice_status = await notice_instance.methods.noticeStatus().call();
      let _open_session_bn = await notice_instance.methods.i_open_session_bn().call();
      let _start_eminent = await notice_instance.methods.getInstanceStartEminent().call();
      let pdfref;
      let status = 0;
      try {
        pdfref = await notice_instance.methods.getLastNoticeInfo().call();
      } catch (err) {
        pdfref = 'Not defined'
      }
      if ((metamask == notice_owner) || (i_publish_bn <= actual_blocknumber) || (notice_status !== '0')) {
        
        if (notice_status == 0) { // config
          status = 0;
        } else if ((notice_status >= 1) && (notice_status < 4)) { // running
          if ((i_publish_bn <= actual_blocknumber) && (_open_session_bn > actual_blocknumber)) {
            status = 1;
          } else if ((_open_session_bn <= actual_blocknumber) && (_start_eminent > actual_blocknumber)) {
            status = 2;
          } else if (_start_eminent < actual_blocknumber) {
            status = 3;
          }
        } else { // ended
          status = 4;
        } 
        notice_summary.push( { address, pdfref, status });
      }
    }


    return { notices, local_accounts, actual_blocknumber, notice_summary }
  }
  renderNotices() {
      const items = this.props.notice_summary.map((element, i) => {
        return {
          header: element.address,
          description: (<NoticeInfo address={element.address} ipfs={element.pdfref} status={element.status} />),
          fluid: true
        }
      });
      return <Card.Group items={items} />;
    
  }

  render() {
    return (
      <Layout>
        <div>
          <p></p>
          <h3>Notices</h3>
          {this.renderNotices()}
        </div>
      </Layout>
    );
  }
}

  
export default NoticesIndex;
// export default () =>
//   <div>
//     <h1>Home</h1>
//     <p>Note that Web3 is not loaded for this page.</p>
//     <div><Link href='/dapp'><a>My Dapp</a></Link></div>
//     <div><Link href='/accounts'><a>My Accounts</a></Link></div>
//   </div>


// class NoticeIndex extends Component {
//   state = { web3: null, accounts: null, contract: null, abi_notice: null, abi_notice_item: null, notices_addresses: [] };
//   async componentDidMount () {
//     try {
//       const web3 = await getWeb3()
//       const accounts = await web3.eth.getAccounts()
//       const contract = await getContract(web3, contractDefNoticeFactory)
//       const notices_addresses = await contract.methods.getNotices().call();
//       this.setState({ web3, accounts, contract, contractDefNotice, contractDefNoticeItem, notices_addresses })
      
//       var notice_at_config = [];
//       // run through every notice_address to check their status
//       notices_addresses.forEach(async (address) => {
//         // mount instance of contract
//         const notice_instance = await getContractInstanceAt(web3, contractDefNotice, address);
//         // check status of notice
//         const notice_status = await notice_instance.methods.noticeStatus().call();
//         console.log(typeof notice_status);
//         if (notice_status == "0") notice_at_config.push(address);
//       });

//       console.log("should remove all of this: " + notice_at_config);
//     } catch (error) {
//       alert(
//         `Failed to load web3, accounts, or contract. Check console for details.`
//       )
//       console.log(error)
//     }
//   }

//   renderNotices() {
//     const items = this.state.notices_addresses.map(address => {
//       return {
//         header: address,
//         description: (`${address}`),
//         fluid: true
//       }
//     });

//     return <Card.Group items={items} />;
//   }

//   render() {
//     return (
//       <Layout>
//         <div>
//           <h3>Notices</h3>
//           <Link route="/notices/new">
//             <a>
//               <Button floated="right" content="Create Notice" icon="add" primary />
//             </a>
//           </Link>
//           {this.renderNotices()}
//         </div>
//       </Layout>
//     );
//   }
// }

// export default NoticeIndex;

