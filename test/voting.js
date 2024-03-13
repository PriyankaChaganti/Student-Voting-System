var Voting = artifacts.require("./Voting.sol");

contract("Voting", function(accounts){
    var votingInstance;
    
    it("initializes with 3 candidates", function() {
        return Voting.deployed().then(function(instance) {
            return instance.totalCandidates();
        }).then(function(count) {
            assert.equal(count, 3);
        });
    });

    it("initializes the candidates with right values", function() {
        return Voting.deployed().then(function(instance) {
            votingInstance = instance;
            return votingInstance.candidates(1);
        }).then(function(candidate) {
            assert.equal(candidate[0], 1, "ID is correct");
            assert.equal(candidate[1], "Sravya", "The name is correct");
            assert.equal(candidate[2], "G01328406", "The G# is correct");
            assert.equal(candidate[3], 0, "Vote count is correct");
            return votingInstance.candidates(2);
        }).then(function(candidate) {
            assert.equal(candidate[0], 2, "ID is correct");
            assert.equal(candidate[1], "Vinuthna", "The name is correct");
            assert.equal(candidate[2], "G01333348", "The G# is correct");
            assert.equal(candidate[3], 0, "Vote count is correct");
            return votingInstance.candidates(3);
        }).then(function(candidate) {
            assert.equal(candidate[0], 3, "ID is correct");
            assert.equal(candidate[1], "Priyanka", "The name is correct");
            assert.equal(candidate[2], "G01339921", "The G# is correct");
            assert.equal(candidate[3], 0, "Vote count is correct");
        });
    });

    it("allow a voter to cast their vote in the election", function() {
        return Voting.deployed().then(function(instance) {
            votingInstance = instance;
            candidateId = 1;
            return votingInstance.vote(candidateId, {from: accounts[0]});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, "event was triggered");
            assert.equal(receipt.logs[0].event, "voted", "type of event matches");
            assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "candidate is correct");
            return votingInstance.voters(accounts[0]);
        }).then(function(voted) {
            assert(voted, "voter has voted");
            return votingInstance.candidates(candidateId);
        }).then(function(candidate) {
            var voteCount = candidate[3];
            assert.equal(voteCount, 1, "vote count is incremented");
        })
    });

    it("Exception for invalid candidates", function() {
        return Voting.deployed().then(function(instance) {
            votingInstance = instance;
            return votingInstance.vote(5, {from: accounts[1] })
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, "error must contain the substring revert");
            return votingInstance.candidates(1)
        }).then(function(candidate1) {
            var voteCount = candidate1[3];
            assert.equal(voteCount, 1, "Candidate 1 has zero votes");
            return votingInstance.candidates(2);
        }).then(function(candidate2) {
            var voteCount = candidate2[3];
            assert.equal(voteCount, 0, "Candidate 2 has zero votes");
            return votingInstance.candidates(3);
        }).then(function(candidate3) {
            var voteCount = candidate3[3];
            assert.equal(voteCount, 0, "Candidate 3 has zero votes");
        });
    });

    it("Exception for voting twice", function() {
        return Voting.deployed().then(function(instance) {
            votingInstance = instance;
            candidateId = 2;
            votingInstance.vote(candidateId, {from: accounts[1] });
            return votingInstance.candidates(candidateId);
        }).then(function(candidate) {
            var voteCount = candidate[3];
            assert.equal(voteCount, 1, "gets the first vote");
            //trying to vote once again
            return votingInstance.vote(candidateId, {from: accounts[1] });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, "error must contain the word revert");
            return votingInstance.candidates(1);
        }).then(function(candidate1) {
            var voteCount = candidate1[3];
            assert.equal(voteCount, 1, "candidate 1 doesn't have any votes yet");
            return votingInstance.candidates(2);
        }).then(function(candidate2) {
            var voteCount = candidate2[3];
            assert.equal(voteCount, 1, "candidate 2 doesn't have any votes yet");
            return votingInstance.candidates(3);
        }).then(function(candidate3) {
            var voteCount = candidate3[3];
            assert.equal(voteCount, 1, "candidate 3 doesn't have any votes yet");
        });
    });
});