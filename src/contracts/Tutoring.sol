pragma solidity ^0.5.0;

contract Tutoring {
    string public name = "Tutoring";
    address public owner;
    string public ceva;

    constructor() public {
        owner = msg.sender;
    }

    
}
