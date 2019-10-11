import React from 'react'
import getWeb3 from './getWeb3'
import getContract from './getContract'
import contractDefinition from './contracts/SimpleStorage.json'
import contractDefNoticeFactory from './contracts/NoticeFactory.json'
import contractDefNotice from './contracts/Notice.json'
import contractDefNoticeItem from './contracts/NoticeItem.json'

export default class Web3Container extends React.Component {
  state = { web3: null, accounts: null, contract: null, abi_notice: null, abi_notice_item: null };

  async componentDidMount () {
    try {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      // const accounts = await web3.eth.getAccounts()
      const contract = await getContract(web3, contractDefNoticeFactory)
      this.setState({ web3, accounts, contract, contractDefNotice, contractDefNoticeItem })
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.log(error)
    }
  }

  render () {
    const { web3, accounts, contract, contractDefNotice, contractDefNoticeItem } = this.state

    return web3 && accounts
      ? this.props.render({ web3, accounts, contract, contractDefNotice, contractDefNoticeItem })
      : this.props.renderLoading()
  }
}
