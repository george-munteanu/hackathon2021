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

  describe('Create problem', async () => {
    let problemCount;
    before(async () => {
      await tutoring.createProblem()
      problemCount = await tutoring.problemCount()
    })

    it('problem created', async () => {
      assert.equal(problemCount, 1)
    })
  })
})