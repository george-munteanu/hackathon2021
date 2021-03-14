pragma solidity ^0.5.0;

contract Donation {
    
    address payable public owner;

    constructor() public {
        owner = msg.sender;
    }

    function donate() public payable {
        address(owner).transfer(msg.value);
    }
}