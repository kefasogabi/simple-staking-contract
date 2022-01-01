var DappToken = artifacts.require("DappToken");
var DaiToken = artifacts.require("DaiToken");
var TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {
  
  // Deploy MOCK DAI Token
 await deployer.deploy(DaiToken);
 const daiToken = await DaiToken.deployed();

 // Deploy MOCK DAPP Token
 await deployer.deploy(DappToken);
 const dappToken = await DappToken.deployed();

  // Deploy TokenFarm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  // Transfer all tokens to TokenFarm (1 million)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000');

  //Transfer 100 MOCK Dai Token to an investor
  await daiToken.transfer(accounts[1], '100000000000000000000');
}