const Tutoring = artifacts.require('Tutoring')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Tutoring', ([owner, investor]) => {
  let tutoring;

  before(async () => {
    // Load Contracts
    tutoring = await Tutoring.new()
  })

  describe('Mock problem', async () => {
    it('problem created', async () => {
      const problemList = await tutoring.createProblem()
      assert.equal(problemlist.length, 1)
    })
  })
})
