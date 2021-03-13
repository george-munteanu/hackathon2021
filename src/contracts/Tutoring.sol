pragma solidity ^0.5.0;

contract Tutoring {
    string public name = "Tutoring";
    address public owner;

    uint public problemCount = 0;
    mapping(uint => Problem) public problemList;

    enum ProblemState {Open, InProgress, Resolved}

    struct Problem {
        uint key;
        string id;
        string title;
        string description;
        string solution;
        address poster;
        address assignedTo;
        ProblemState state;
    }


    constructor() public {
        owner = msg.sender;
    }

    function createProblem(string memory _id, string memory _title, string memory _description) public {
        problemList[problemCount] = Problem(
            problemCount,
            _id,
            _title,
            _description,
            "",
            msg.sender,
            address(0x00),
            ProblemState.Open
        );

        problemCount ++;
    }

    function assignProblem(uint key, address _to ) public returns(bool result) {
        Problem storage problem = problemList[key];

        if(problem.state == ProblemState.Open) {
            problem.assignedTo = _to;
            problem.state = ProblemState.InProgress;

            return true;
        }
        return false;
    }
}
