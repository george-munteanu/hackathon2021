pragma solidity ^0.5.0;

contract User {
    
    address public owner;

    uint public userCount = 0;
    mapping(uint => address) public userList;
    //address[] public userList;

    constructor() public {
        owner = msg.sender;
    }

    function addUser(address _user) public {

        require(msg.sender == owner, "Permission denied!");

        for (uint i=0; i<userCount; i++) {
            address listUser = userList[i];
            require(listUser != _user, "User already exists");
        }

        userList[userCount] = _user;
        userCount++;
    }

    function removeUser(address _user) public {
        require(msg.sender == owner, "Permission denied!");

        bool found = false;
        for (uint i=0; i<userCount; i++) {
            address listUser = userList[i];
            if (listUser == _user) {
                found = true;
                delete userList[i];
                userCount--;
                break;
            }
        }

        require(found == true, "User not found!");
    }
}