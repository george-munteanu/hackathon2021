const Tutoring = artifacts.require('Tutoring')
const User = artifacts.require('User')

module.exports = async function(deployer, network, accounts) {

  // Deploy Tutoring
  await deployer.deploy(Tutoring)
  const tutoring = await Tutoring.deployed()

  // Deploy User
  await deployer.deploy(User)
  const user = await User.deployed()
}
