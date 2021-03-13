pragma solidity ^0.5.0;

contract Tutoring {
    string public name = "Tutoring";
    address public owner;

    uint public problemCount = 0;
    mapping(uint => Problem) public problemList;

    enum ProblemState {Open, InProgress, Resolved}

    struct Problem {
        string id;
        string title;
        string description;
        string solution;
        address poster;
        ProblemState state;
    }

    constructor() public {
        owner = msg.sender;
    }

    function createProblem(string memory _id, string memory _title, string memory _description) public {
        problemCount ++;

        problemList[problemCount] = Problem(
            _id,
            _title,
            _description,
            "",
            msg.sender,
            ProblemState.Open
        );
    }
}
