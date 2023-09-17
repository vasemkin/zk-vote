// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import { ZKTree } from "./ZKTree.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { IVerifier } from "./ZKTree.sol";
import { IHasher } from "./MerkleTreeWithHistory.sol";

contract ZKVote is Ownable, ZKTree {
    enum Phaze {
        INITIAL,
        COMMIT,
        REVEAL,
        FINALIZED
    }

    Phaze public phaze = Phaze.INITIAL;
    address public validator;

    bytes32 private _proposal;

    uint64 private _votingStarted;
    uint64 private _judgeCount;
    uint64 private _totalScore;
    uint64 private _reveals;

    uint256 private _duration;

    mapping(address => bool) private _judges;
    mapping(address => bytes32) private _scores;

    event VotingStarted(address validator);
    event VotingEnded(uint256 score);

    constructor(
        uint32 _levels,
        IHasher _hasher,
        IVerifier _verifier
    ) ZKTree(_levels, _hasher, _verifier) {}

    modifier onlyJudge() {
        require(isJudge(msg.sender), "JP: Not a judge");
        _;
    }

    modifier onlyPhaze(Phaze _phaze) {
        require(phaze == _phaze, "JP: Wrong phase");
        _;
    }

    modifier onlyOneVote() {
        require(_scores[msg.sender] == 0x00, "JP: Only one vote");
        _;
    }

    /// @notice             Starts the commit phaze
    /// @param  proposal    Proposal IPFS hash
    /// @param  judges      Array of addresses that are able to set scores
    function init(bytes32 proposal, address[] calldata judges, uint256 duration) public onlyPhaze(Phaze.INITIAL) onlyOwner {
        _proposal = proposal;
        uint64 judgeCount = uint64(judges.length);


        for (uint256 i; i < judgeCount;) {
            _judges[judges[i]] = true;

            unchecked {
                ++i;
            }
        } 

        _judgeCount = judgeCount;
        _votingStarted = uint64(block.timestamp);
        _duration = duration;
        phaze = Phaze.COMMIT;

        emit VotingStarted(msg.sender);
    }

    /// @notice                 Judge commits a score, effectively storing his vote
    /// @param  commitment      MiMCSponge(nullifier,secret,score)
    function commitScore(uint256 commitment) public onlyPhaze(Phaze.COMMIT) onlyJudge onlyOneVote {
        bytes32 _commitment = bytes32(commitment);
        _scores[msg.sender] = _commitment;
        _commit(_commitment);
    }

    /// @notice             Starts the reveal phaze
    function startReveal() public {
        require(block.timestamp > (_votingStarted + _duration - 1), "JP: Commit phaze timer");
        phaze = Phaze.REVEAL;
    }

    /// @notice             Judge reveals the score from a private account
    function revealScore(
        uint256 score,
        uint256 nullifierHash,
        uint256 _root,
        uint[2] memory _proof_a,
        uint[2][2] memory _proof_b,
        uint[2] memory _proof_c
    ) public onlyPhaze(Phaze.REVEAL) {    
        require(_scoreInRange(score), "JP: Reveal failed");

        _nullify(
            bytes32(nullifierHash),
            bytes32(score),
            bytes32(_root),
            _proof_a,
            _proof_b,
            _proof_c
        );

        unchecked {
            ++_reveals;
        }

        _totalScore = _totalScore + uint64(score);
    }

    /// @notice             Starts the final phaze
    function finalize() public {
        require(_judgeCount == _reveals, "JP: Not all judges revealed");
        phaze = Phaze.FINALIZED;

        emit VotingEnded(getMedian());
    }

    /// @notice             Returns the median score
    function getMedian() onlyPhaze(Phaze.FINALIZED) public view returns (uint256) {
        return (_totalScore / _reveals);
    }

    /// @notice             Judge helper
    function isJudge(address _address) public view returns (bool) {
        return _judges[_address];
    }

    /// @notice             Validates if the score is the same as the commited hash
    function _validScoreHash(uint256 score, uint256 nullifier) private view returns (bool) {
        return (keccak256(abi.encodePacked(score, nullifier)) == _scores[msg.sender]);
    }

    /// @notice             Validates if the score is in range
    /// @dev                checking for score > 0 is not necessary since uintx
    function _scoreInRange(uint256 score) private pure returns (bool) {
        return (score < 11);
    }
}
