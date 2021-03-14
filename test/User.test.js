const { assert } = require('chai');

const User = artifacts.require('User')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('User', ([owner, author]) => {
  let user;

  before(async () => {
    // Load Contracts
    user = await User.new()
    await user.addUser("0x0000000000000000000000000000000000000001")
  })

  describe('Add new user', async () => {
    let userCount, addedUser;
    before(async () => {
      await user.addUser("0x0000000000000000000000000000000000000002")
      userCount = await user.userCount()
      addedUser = await user.userList(1)
    })

    it('user added', async () => {
      assert.equal(userCount, 2)
      assert.equal(addedUser, 0x0000000000000000000000000000000000000002)
    })
  })

  describe('Add existing user', async () => {
    let userCount;
    it("user not added", async () => {
      await user.addUser("0x0000000000000000000000000000000000000002").should.be.rejected
      userCount = await user.userCount()
      
      assert.equal(userCount, 2);
    })
  })

  describe('Remove inexistent user', async () => {
    let userCount;
    before(async () => {
      await user.removeUser("0x0000000000000000000000000000000000000003").should.be.rejected
      userCount = await user.userCount()
    })

    it('user not removed', async () => {
      assert.equal(userCount, 2)
    })
  })

  describe('Remove existent user', async () => {
    let userCount;
    before(async () => {
      await user.removeUser("0x0000000000000000000000000000000000000002")
      userCount = await user.userCount()
    })

    it('user removed', async () => {
      assert.equal(userCount, 1)
    })
  })
})