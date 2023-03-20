//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Voting {
    //COUNTER UTIL
    using Counters for Counters.Counter;

    Counters.Counter public _voterId;
    Counters.Counter public _candidateId;

    //CANDIDATE STRUCT
    struct Candidate {
        uint256 candId;
        string candName;
        string candImage;
        uint256 voteCount;
        address candAddress;
        string candIpfs;
    }

    event CandidateCreate(
        uint256 candId,
        string candName,
        string candImage,
        uint256 voteCount,
        address candAddress,
        string candIpfs
    );

    //VOTER STRUCT
    struct Voter {
        uint256 voterId;
        string voterName;
        string voterImage;
        uint256 voterAllowed;
        bool hasVoted;
        uint256 voteDecision;
        address voterAddress;
        string voterIpfs;
    }

    event VoterCreated(
        uint256 voterId,
        string voterName,
        string voterImage,
        uint256 voterAllowed,
        bool hasVoted,
        uint256 voteDecision,
        address voterAddress,
        string voterIpfs
    );

    //VOTING ORGANISER ADDRESS
    address public votingOrganiser;

    //CANDIDATES
    address[] public candidatesAddress;
    mapping(address => Candidate) public candidates;

    //VOTERS
    address[] public votersAddress;
    address[] public votedVoters;
    mapping(address => Voter) public voters;

    //CONSTRUCTOR
    constructor() {
        votingOrganiser = msg.sender;
    }

    //CANDIDATE FUNCTIONS
    function addCandidate(
        address _address,
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public {
        require(
            votingOrganiser == msg.sender,
            "Only organiser can create candidate"
        );

        _candidateId.increment();

        uint256 idNumber = _candidateId.current();

        Candidate storage candidate = candidates[_address];

        candidate.candName = _name;
        candidate.candId = idNumber;
        candidate.candImage = _image;
        candidate.voteCount = 0;
        candidate.candAddress = _address;
        candidate.candIpfs = _ipfs;

        candidatesAddress.push(_address);

        emit CandidateCreate(
            idNumber,
            _name,
            _image,
            candidate.voteCount,
            _address,
            _ipfs
        );
    }

    function getCandidateList() public view returns (address[] memory) {
        return candidatesAddress;
    }

    function getCandidateCount() public view returns (uint256) {
        return candidatesAddress.length;
    }

    function getCandidateData(
        address _address
    )
        public
        view
        returns (
            string memory,
            uint256,
            string memory,
            uint256,
            address,
            string memory
        )
    {
        return (
            candidates[_address].candName,
            candidates[_address].candId,
            candidates[_address].candImage,
            candidates[_address].voteCount,
            candidates[_address].candAddress,
            candidates[_address].candIpfs
        );
    }

    //VOTER FUNCTIONS
    function addVoter(
        address _address,
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public {
        require(
            votingOrganiser == msg.sender,
            "Only organiser can create voter"
        );

        _voterId.increment();

        uint256 idNumber = _voterId.current();

        Voter storage voter = voters[_address];

        require(voter.voterAllowed == 0);

        voter.voterId = idNumber;
        voter.voterName = _name;
        voter.voterImage = _image;
        voter.voterAllowed = 1;
        voter.hasVoted = false;
        voter.voteDecision = 0;
        voter.voterAddress = _address;
        voter.voterIpfs = _ipfs;

        votersAddress.push(_address);

        emit VoterCreated(
            idNumber,
            _name,
            _image,
            voter.voterAllowed,
            voter.hasVoted,
            voter.voteDecision,
            _address,
            _ipfs
        );
    }

    function getVotedVoterList() public view returns (address[] memory) {
        return votedVoters;
    }

    function getVoterList() public view returns (address[] memory) {
        return votersAddress;
    }

    function getVoterCount() public view returns (uint256) {
        return votersAddress.length;
    }

    function getVoterData(
        address _address
    )
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            uint256,
            bool,
            address,
            string memory
        )
    {
        return (
            voters[_address].voterId,
            voters[_address].voterName,
            voters[_address].voterImage,
            voters[_address].voterAllowed,
            voters[_address].hasVoted,
            voters[_address].voterAddress,
            voters[_address].voterIpfs
        );
    }

    function castVote(
        address _candidateAddress,
        uint256 _candidateVoteId
    ) external {
        Voter storage voter = voters[msg.sender];
        require(!voter.hasVoted, "You have already voted");
        require(voter.voterAllowed != 0, "You have no right to voteDecision");

        voter.hasVoted = true;
        voter.voteDecision = _candidateVoteId;

        votedVoters.push(msg.sender);

        candidates[_candidateAddress].voteCount += voter.voterAllowed;
    }
}
