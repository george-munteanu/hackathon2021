const { assert } = require('chai');

const Donation = artifacts.require('Donation')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('User', ([owner, donor]) => {
  let donation;

  before(async () => {
    // Load Contracts
    donation = await Donation.new()
  })

  describe('Donate something', async () => {
    let balance, ammount = 1000;
    it("donation success", async () => {

      let oldOwnerBalance
      oldOwnerBalance = await web3.eth.getBalance(owner)
      oldOwnerBalance = new web3.utils.BN(oldOwnerBalance)


      await donation.donate({value: web3.utils.toWei("0.1", 'Ether'), from: donor})

      let newOwnerBalance
      newOwnerBalance = await web3.eth.getBalance(owner)
      newOwnerBalance = new web3.utils.BN(newOwnerBalance)

      let donationAmount
      donationAmount = web3.utils.toWei('0.1', 'Ether')
      donationAmount = new web3.utils.BN(donationAmount)

      const expectedBalance = oldOwnerBalance.add(donationAmount)

      assert.equal(newOwnerBalance.toString(), expectedBalance.toString())

    })
  })
})