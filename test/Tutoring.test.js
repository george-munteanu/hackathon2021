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
    await tutoring.createProblem(1, "TestDescription", "TestDescriptionHash")
    
  })

  describe('Create problem', async () => {
    let problemCount, problem;
    before(async () => {
      problemCount = await tutoring.problemCount()
      problem = await tutoring.problemList(0)
    })

    it('problem created', async () => {
      assert.equal(problemCount, 1)
      assert.equal(problem.category, 1)
      assert.equal(problem.description, "TestDescription")
      assert.equal(problem.descriptionHash, "TestDescriptionHash")
      assert.equal(problem.solution, "")
      assert.equal(problem.assignedTo, "0x0000000000000000000000000000000000000000")
      assert.equal(problem.state, 0)

    })
  })

  describe('Assign problem from Open state', async () => {
    let problem;
    before(async () => {
      await tutoring.assignProblem(0, "0x1100110011001100110011001100110011001100")
      problem = await tutoring.problemList(0)
    })

    it('problem assigned', async () => {
      assert.equal(problem.assignedTo, 0x1100110011001100110011001100110011001100)
      assert.equal(problem.state, 1)
    })
  })

  describe('Assign problem from not Open state', async () => {
    let problem;
    before(async () => {
      await tutoring.assignProblem(0, "0x1100110011001100110011001100110011001100").should.be.rejected
      problem = await tutoring.problemList(0)
    })

    it('problem assigned', async () => {
      assert.equal(problem.assignedTo, 0x1100110011001100110011001100110011001100)
      assert.equal(problem.state, 1)
    })


    describe('Assign problem to the owner itself', async () => {
      let problem, createdBy;
      before(async () => {
        await tutoring.createProblem(1, "TestDescription2", "TestDescriptionHash2")
        createdBy = await tutoring.problemList(1).createdBy
        await tutoring.assignProblem(1, createdBy).should.be.rejected
        problem = await tutoring.problemList(1)
      })
  
      it('problem assigned', async () => {
        assert.equal(problem.assignedTo, 0x0000000000000000000000000000000000000000)
        assert.equal(problem.state, 0)
      })
    
    })
  })
})