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
      problem = await tutoring.problemList(0)
    })

    it('problem created', async () => {
      assert.equal(problemCount, 1)
      assert.equal(problem.id, "1")
      assert.equal(problem.title, "TestTitle")
      assert.equal(problem.description, "TestDescription")
      assert.equal(problem.solution, "")
      assert.equal(problem.assignedTo, "0x0000000000000000000000000000000000000000")
      assert.equal(problem.state, 0)

    })
  })

  describe('Assign problem', async () => {
    let problemCount, problem;
    before(async () => {
      await tutoring.createProblem("1", "TestTitle", "TestDescription")
      await tutoring.assignProblem(0, "0x1100110011001100110011001100110011001100")
      problem = await tutoring.problemList(0)
    })

    it('problem assigned', async () => {
      assert.equal(problem.assignedTo, 0x1100110011001100110011001100110011001100)
      assert.equal(problem.state, 1)
    })
  })
})