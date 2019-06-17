var SmartLeaseContract = artifacts.require("./SmartLeaseContract.sol");

contract('SmartLeaseContract', function(accounts) {
    let contractInstance;

    it('initializes with three tenants', function() {
        return SmartLeaseContract.deployed().then(function(instance) {
            return instance.TENANT_CAPACITY();
        }).then(function(capacity) {
            assert.equal(capacity, 3);
        });
    });

    it('proposes a written contract', function() {
        return SmartLeaseContract.deployed().then(function(instance) {
            contractInstance = instance;
            return instance.proposeWrittenContract("https://ipfs.io/ipfs/QmYaXiNQT8qhsw2nN86yhRgSUaA8uit8DXaQFZuEcweuTz")
        }).then(function(receipt) {
            assert.equal(receipt.logs[0].event, "WrittenContractProposed");
        });
    });
})
