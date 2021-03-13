const { assert } = require('chai');

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
    let problemCount, problem;
    before(async () => {
      await tutoring.createProblem("1", "TestTitle", "TestDescription")
      problemCount = await tutoring.problemCount()
      problem = await tutoring.problemList(1)
    })

    it('problem created', async () => {
      assert.equal(problemCount, 1)
      assert.equal(problem.id(), "1")
      assert.equal(problem.title(), "TestTitle")
      assert.equal(problem.description(), "TestDescription")
      assert.equal(problem.solution(), "")
      assert.equal(problem.state(), "Open")
    })
  })
})