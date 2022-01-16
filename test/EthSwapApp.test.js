const Token = artifacts.require("Token");
const EthSwapApp = artifacts.require("EthSwapApp");

require("chai").use(require("chai-as-promised")).should();

const tokens = (n) => {
  return web3.utils.toWei(n, "ether");
};
contract("EthSwapApp", (accounts) => {
  let token;
  let ethSwapApp;

  before(async () => {
    token = await Token.new();
    ethSwapApp = await EthSwapApp.new(token.address);
    await token.transfer(ethSwapApp.address, tokens("1000000"));
  });

  describe("Token deployment", async () => {
    it("contract has a name", async () => {
      const name = await token.name();
      assert.equal(name, "DApp Token");
    });
  });

  describe("EthSwapApp deployment", async () => {
    it("contract has a name", async () => {
      const name = await ethSwapApp.name();
      assert.equal(name, "EthSwapApp Instant Exchange");
    });

    it("contract has token", async () => {
      balance = await token.balanceOf(ethSwapApp.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  describe("buyTokens()", async () => {
    let result;
    let investor = accounts[1];
    before(async () => {
      // purchase token before each test
      result = await ethSwapApp.buyTokens({
        from: investor,
        value: web3.utils.toWei("1", "ether"),
      });
    });

    it("Allows user to instantly purchase tokens from EthSwapApp for a fixed price", async () => {
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("100"));

      // ethSwapApp token balance reduced by 100
      ethSwapTokenBalance = await token.balanceOf(ethSwapApp.address);
      assert.equal(ethSwapTokenBalance.toString(), tokens("999900"));

      // and ethSwapApp eth balance increased by 1
      ethSwapEthBalance = await web3.eth.getBalance(ethSwapApp.address);
      assert.equal(
        ethSwapEthBalance.toString(),
        web3.utils.toWei("1", "ether")
      );

      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100").toString());
      assert.equal(event.rate.toString(), "100");
    });
  });

  describe("sellTokens()", async () => {
    let result;
    let investor = accounts[1];

    before(async () => {
      // investor must approve the purchase
      await token.approve(ethSwapApp.address, tokens("100"), {
        from: investor,
      });
      // investor sells token
      result = await ethSwapApp.sellTokens(tokens("100"), { from: investor });
    });

    it("Allows user to instantly sell tokens to EthSwapApp for a fixed price", async () => {
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("0"));

      // ethSwapApp token balance increased by 100
      ethSwapTokenBalance = await token.balanceOf(ethSwapApp.address);
      assert.equal(ethSwapTokenBalance.toString(), tokens("1000000"));

      // and ethSwapApp eth balance reduced by 1
      ethSwapEthBalance = await web3.eth.getBalance(ethSwapApp.address);
      assert.equal(
        ethSwapEthBalance.toString(),
        web3.utils.toWei("0", "ether")
      );

      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100").toString());
      assert.equal(event.rate.toString(), "100");

      // Fail test: investor can't sell more tokens than they have
      await ethSwapApp.sellTokens(tokens("500"), { from: investor }).should.be
        .rejected;
    });
  });
});
