const getNoticeInstance = async (web3, contractDefNotice, address) => {
    // create the instance
    const instance = new web3.eth.Contract(
      contractDefNotice.abi,
      address
    )
    return instance
  }
  
  export default getNoticeInstance
  