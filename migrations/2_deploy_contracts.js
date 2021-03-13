const Tutoring = artifacts.require('Tutoring')

module.exports = async function(deployer, network, accounts) {

  // Deploy Tutoring
  await deployer.deploy(Tutoring)
  const tutoring = await Tutoring.deployed()

}
