pragma solidity ^0.5.16;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        string gnumber;
        uint voteCount;
    }

    //store accounts that have casted their vote
    mapping(address => bool) public voters;
    //store candidates
    mapping(uint => Candidate) public candidates;
    uint public totalCandidates;

    //event for voted
    event voted (
        uint indexed _candidateId
    );

    function addCandidate(string memory _name, string memory _gnumber) private {
        totalCandidates++;
        candidates[totalCandidates] = Candidate(totalCandidates, _name, _gnumber, 0);
    }

    function vote(uint _candidateId) public {
        //check that the voter is voting only once
        require(!voters[msg.sender]);
        //valid candidate is getting the vote
        require(_candidateId > 0 && _candidateId <= totalCandidates);
        //store when a voter votes 
        voters[msg.sender] = true;
        // updating the vote count of candidate 
        candidates[_candidateId].voteCount ++;
        //triggering the voted event
        emit voted(_candidateId);
    }

    constructor() public {
        addCandidate("Sravya", "G01328406");
        addCandidate("Vinuthna", "G01333348");
        addCandidate("Priyanka", "G01339921");
    }
}





