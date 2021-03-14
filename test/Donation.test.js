const { assert } = require('chai');

const Donation = artifacts.require('Donation')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('User', ([owner, author]) => {
  let donation;

  before(async () => {
    // Load Contracts
    donation = await Donation.new()
  })

  describe('Donate something', async () => {
    let balance, ammount = 1000;
    it("donation success", async () => {
      await donation.donate({value: web3.utils.toWei("0.1", 'ether')})
      balance = await donation.getBalance()
      assert.isAtLeast(balance.toString(), web3.utils.toWei("0.1", 'ether'));
    })
  })
})