const Token = artifacts.require("Token");
const EthSwapApp = artifacts.require("EthSwapApp");

module.exports = async function (deployer) {
  await deployer.deploy(Token);
  const token = await Token.deployed();

  await deployer.deploy(EthSwapApp, token.address);
  const ethSwap = await EthSwapApp.deployed();

  await token.transfer(ethSwap.address, "1000000000000000000000000");
};
