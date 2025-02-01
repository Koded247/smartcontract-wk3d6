// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClassRegistration {
    address public admin;
    
    struct Student {
        uint256 id;
        string name;
        bool isRegistered;
    }
    
    mapping(uint256 => Student) private students;
    uint256[] private studentIds;
    
    event StudentRegistered(uint256 id, string name);
    event StudentRemoved(uint256 id);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
    }
    
    function registerStudent(uint256 _id, string memory _name) public onlyAdmin {
        require(!students[_id].isRegistered, "Student ID already registered");
        students[_id] = Student(_id, _name, true);
        studentIds.push(_id);
        emit StudentRegistered(_id, _name);
    }
    
    function removeStudent(uint256 _id) public onlyAdmin {
        require(students[_id].isRegistered, "Student ID not found");
        delete students[_id];
        emit StudentRemoved(_id);
    }
    
    function getStudent(uint256 _id) public view returns (string memory name, bool isRegistered) {
        require(students[_id].isRegistered, "Student not found");
        return (students[_id].name, students[_id].isRegistered);
    }
    
    function getAllStudents() public view returns (uint256[] memory) {
        return studentIds;
    }
}
