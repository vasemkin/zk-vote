pragma circom 2.0.0;

include "CommitmentHasher.circom";
include "MerkleTreeChecker.circom";

template Verifier(levels) {
    signal input nullifier;
    signal input secret;
    signal input score;
    signal input pathElements[levels];
    signal input pathIndices[levels];
    signal output nullifierHash;
    signal output scoreOutput;
    signal output root;

    component commitmentHasher = CommitmentHasher();
    component merkleTreeChecker = MerkleTreeChecker(levels);

    commitmentHasher.nullifier <== nullifier;
    commitmentHasher.secret <== secret;
    commitmentHasher.score <== score;

    merkleTreeChecker.leaf <== commitmentHasher.commitment;
    for (var i = 0; i < levels; i++) {
        merkleTreeChecker.pathElements[i] <== pathElements[i];
        merkleTreeChecker.pathIndices[i] <== pathIndices[i];
    }

    nullifierHash <== commitmentHasher.nullifierHash;
    scoreOutput <== commitmentHasher.scoreOutput;
    root <== merkleTreeChecker.root;
}

component main = Verifier(20);