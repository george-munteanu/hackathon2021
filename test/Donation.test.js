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
      await donation.donate()
      balance = await donation.getBalance({value: ammount})
      
      assert.isAtLeast(balance, ammount);
    })
  })
})