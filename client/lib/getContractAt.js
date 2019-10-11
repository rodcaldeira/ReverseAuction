const getContractInstanceAt = async (web3, contractDef, address) => {
    // create the instance
    const instance = new web3.eth.Contract(
      contractDef.abi,
      address
    )
    return instance
  }
  
  export default getContractInstanceAt
  