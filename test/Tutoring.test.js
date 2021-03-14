const { assert } = require('chai');

const Tutoring = artifacts.require('Tutoring')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Tutoring', ([owner, author]) => {
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
      await tutoring.assignProblem(0, { from: author })
      problem = await tutoring.problemList(0)
    })

    it('problem assigned', async () => {
      assert.equal(problem.state, 1)
      assert.equal(problem.assignedTo, author)
    })
  })

  describe('Assign problem from not Open state', async () => {
    let problem;
    before(async () => {
      await tutoring.assignProblem(0, { from: author }).should.be.rejected
      problem = await tutoring.problemList(0)
    })

    it('problem not assigned', async () => {
      assert.equal(problem.assignedTo, author)
      assert.equal(problem.state, 1)
    })
  })

  describe('Assign problem to the owner itself', async () => {
    let problem, createdBy;
    before(async () => {
      await tutoring.createProblem(1, "TestDescription2", "TestDescriptionHash2")
      createdBy = await tutoring.problemList(1).createdBy
      await tutoring.assignProblem(1, { from: createdBy }).should.be.rejected
      problem = await tutoring.problemList(1)
    })

    it('problem not assigned', async () => {
      assert.equal(problem.assignedTo, 0x0000000000000000000000000000000000000000)
      assert.equal(problem.state, 0)
    })
  
  })

  describe('Resolve problem: empty solution, In Progress state', async () => {
    before(async () => {
      await tutoring.resolveProblem(0, "", "Solution_Image").should.be.rejected
    })
  })

  describe('Resolve problem: good solution, In Progress state', async () => {
    let problem;
    before(async () => {
      await tutoring.resolveProblem(0, "Solution", "Solution_Image")
      problem = await tutoring.problemList(0)
    })

    it('problem resolved', async () => {
      assert.equal(problem.solution, "Solution")
      assert.equal(problem.solutionHash, "Solution_Image")
      assert.equal(problem.state, 2)
      assert.equal(problem.rejectionReason, "")
    })
  })

  describe('Resolve problem: good solution, not In Progress state', async () => {
    it("text", async () => {
      await tutoring.resolveProblem(0, "Solution", "Solution_Image").should.be.rejected
    })
  })

  describe('Approve solution', async () => {
    let problem;
    before(async () => {
      await tutoring.approveSolution(0)
      problem = await tutoring.problemList(0)
    })

    it('approved solution', async () => {
      assert.equal(problem.state, 3)
    })
  })

  describe('Approve solution: not Pending Validation state', async () => {
    it("text", async () => {
      await tutoring.approveSolution(0).should.be.rejected
    })
  })

  describe('Approve solution: not same user who created it', async () => {
    it("text3", async () => {
      await tutoring.createProblem(3, "TestDescription3", "TestDescriptionHash3")
      await tutoring.assignProblem(2, { from: author })
      await tutoring.resolveProblem(2, "Solution", "Solution image")
      await tutoring.approveSolution(2, { from: author }).should.be.rejected
    })
  })

  describe('Reject solution, empty message', async () => {
     it("Text2", async () => {
        await tutoring.createProblem(3, "TestDescription4", "TestDescriptionHash4")
        await tutoring.assignProblem(3, { from: author })
        await tutoring.resolveProblem(3, "Solution", "Solution image")
        await tutoring.rejectSolution(3, "").should.be.rejected
    })
  })

  describe('Reject solution, good message, same user who created', async () => {
    it("text", async () => {
        await tutoring.rejectSolution(3, "Message", { from: author }).should.be.rejected
    })
  })

  describe('Reject solution, message present', async () => {
    let problem;
    before(async () => {
        await tutoring.rejectSolution(3, "Bad teacher", {from:owner})
        problem = await tutoring.problemList(3)
    })

    it('solution rejected', async () => {
      assert.equal(problem.rejectionReason, "Bad teacher")
      assert.equal(problem.state, 0)
      assert.equal(problem.solution, "")
      assert.equal(problem.solutionHash, "")
    })
  })

})