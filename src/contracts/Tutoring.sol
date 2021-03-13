pragma solidity ^0.5.0;

contract Tutoring {
    string public name = "Tutoring";
    address public owner;

    uint public problemCount = 0;
    mapping(uint => Problem) public problemList;

    enum ProblemState {Open, InProgress, PendingValidation, Resolved}

    enum Category {Math, Physics, Chemistry, Geography, History}

    struct Problem {
        uint key;
        Category category;
        string description;
        string descriptionHash;
        string solution;
        string solutionHash;
        address createdBy;
        address assignedTo;
        ProblemState state;
        string rejectionReason;
    }


    constructor() public {
        owner = msg.sender;
    }

    function createProblem(Category _category, string memory _description, string memory _descriptionHash) public {
        problemList[problemCount] = Problem(
            problemCount,
            _category,
            _description,
            _descriptionHash,
            "",
            "",
            msg.sender,
            address(0x00),
            ProblemState.Open,
            ""
        );

        problemCount ++;
    }

    function assignProblem(uint key, address _to) public {
        Problem storage problem = problemList[key];

        require(problem.state == ProblemState.Open, "Problem must be in Open state to assign");
        require(problem.createdBy != _to, "You cannot solve your own issues! Let someone else!");

        problem.assignedTo = _to;
        problem.state = ProblemState.InProgress;
    }

    function resolveProblem(uint key, string memory _solution, string memory _solutionHash) public {
        Problem storage problem = problemList[key];

        require(problem.state == ProblemState.InProgress, "Problem must be in In progress state to assign");
        require(keccak256(bytes(_solution)) == keccak256(bytes("")), "Solution must not be empty!");

        problem.solution = _solution;
        problem.solutionHash = _solutionHash;
        problem.state = ProblemState.PendingValidation;
        problem.rejectionReason = "";
    }

    function approveSolution(uint key) public {
        Problem storage problem = problemList[key];

        require(problem.state != ProblemState.PendingValidation, "Problem must be in pending validation to reject");
        require(problem.createdBy == msg.sender, "Permission Denied!");

        problem.state = ProblemState.Resolved;
    }

    function rejectSolution(uint key, string memory _rejectionReason) public {
        Problem storage problem = problemList[key];

        require(problem.state != ProblemState.PendingValidation, "Problem must be in pending validation to reject");
        require(problem.createdBy == msg.sender, "Permission Denied!");
        require(keccak256(bytes(_rejectionReason)) != keccak256(bytes("")), "Rejection reason must not be empty");

        problem.rejectionReason = _rejectionReason;
        problem.state = ProblemState.InProgress;
    }
}
