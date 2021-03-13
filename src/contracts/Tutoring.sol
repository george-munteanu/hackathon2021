pragma solidity ^0.5.0;

contract Tutoring {
    string public name = "Tutoring";
    address public owner;

    Problem[] public problemList;

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

    function createProblem() public {
        problemList.push(
            Problem({id:"1", title:"test", description:"tests", solution:"", poster:0xc2b0f50c3557C0Ff1E3Aec9172F4A22DB54c5640, state:ProblemState.Open}));
    }
}
