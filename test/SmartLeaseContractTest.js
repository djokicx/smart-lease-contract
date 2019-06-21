var SmartLeaseContract = artifacts.require("./SmartLeaseContract.sol");

contract('SmartLeaseContract', function(accounts) {
    let contractInstance;
    

    it('initializes with three tenants', function() {
        return SmartLeaseContract.deployed().then(function(instance) {
            contractInstance = instance;
            return contractInstance.TENANT_CAPACITY();
        }).then(function(capacity) {
            assert.equal(capacity, 3);
        });
    });

    it('proposes a written contract', function() {
        return contractInstance.proposeWrittenContract("https://ipfs.io/ipfs/QmYaXiNQT8qhsw2nN86yhRgSUaA8uit8DXaQFZuEcweuTz")
        .then(function(receipt) {
            assert.equal(receipt.logs[0].event, "WrittenContractProposed");
        });
    });

    it('1st Tenant Added Successfully' , function(){
        return contractInstance.assignTenant(accounts[1],1000,2000,{from:accounts[0]})
        .then(function(receipt){
            assert.equal(receipt.logs[0].event, "TenantAssigned");
        })
    });

    it('2nd Tenant Added Successfully' , function(){
        return contractInstance.assignTenant(accounts[2],1000,2000,{from:accounts[0]})
        .then(function(receipt){
            assert.equal(receipt.logs[0].event, "TenantAssigned");
        })
    });

    it('Duplicate tenants are not allowed.' , function(){
        return contractInstance.assignTenant(accounts[2],1000,2000,{from:accounts[0]})
        .then(function(receipt){
            throw("Duplicate tenants shouldn't not allowed.");
        }).catch(function(e){
            assert.equal(e.reason,"Duplicate tenants are not allowed.");
        })
    });

    it('Landlord is not allowed to be a tenant at the same time.' , function(){
        return contractInstance.assignTenant(accounts[0],1000,2000,{from:accounts[0]})
        .then(function(receipt){
            throw("Landlord  cannot be allowed to be a tenant at the same time.");
        }).catch(function(e){
            assert.equal(e.reason,"Landlord is not allowed to be a tenant at the same time.");
        })
    });

    it('3nd Tenant Added Successfully' , function(){
        return contractInstance.assignTenant(accounts[3],1000,2000,{from:accounts[0]})
        .then(function(receipt){
            assert.equal(receipt.logs[0].event, "TenantAssigned");
        })
    });

    it('The rental unit is fully occupied.' , function(){
        return contractInstance.assignTenant(accounts[4],1000,2000,{from:accounts[0]})
        .then(function(receipt){
            throw("The rental unit is fully occupied.");
        }).catch(function(e){
            assert.equal(e.reason,"The rental unit is fully occupied.");
        })
    });

    it('1st Tenant Signed the contract.' , function(){
        return contractInstance.signContract({from:accounts[1]})
        .then(function(receipt){
            assert.equal(receipt.logs[0].event, "TenantSigned");
        })
    });

    it("Tenant shouldn't be able to sign the contract twice." , function(){
        return contractInstance.signContract({from:accounts[1]})
        .then(function(receipt){
            throw("Tenant cannot sign the contract twice.");
        }).catch(function(e){
            assert.equal(e.reason,"The tenant has already signed the contract");
        })
    });

    it("Transaction Value should be same as Deposit Amount." , function(){
        return contractInstance.payDeposit({from:accounts[1],value:2000})
        .then(function(receipt){
            assert.equal(receipt.logs[0].event, "DepositPayed");
        })
    });

    it("Cannot Pay for deposit twice." , function(){
        return contractInstance.payDeposit({from:accounts[1],value:2000})
        .then(function(receipt){
            throw("The tenant has already paid the deposit");
        }).catch(function(e){
            assert.equal(e.reason,"The tenant has already paid the deposit");
        })
    });

    it('2st Tenant Signed the contract.' , function(){
        return contractInstance.signContract({from:accounts[2]})
        .then(function(receipt){
            assert.equal(receipt.logs[0].event, "TenantSigned");
        })
    });

    it("Transaction Value cannot be less than Deposit Amount." , function(){
        return contractInstance.payDeposit({from:accounts[2],value:1000})
        .then(function(receipt){
            throw("Amount of provided deposit does not match the amount of required deposit");
        }).catch(function(e){
            assert.equal(e.reason,"Amount of provided deposit does not match the amount of required deposit");
        })
    });

    it("Tenant must sign the contract before paying Deposit amount." , function(){
        return contractInstance.payDeposit({from:accounts[3],value:2000})
        .then(function(receipt){
            throw("Tenant must sign the contract before invoking this functionality");
        }).catch(function(e){
            assert.equal(e.reason,"Tenant must sign the contract before invoking this functionality");
        })
    });
})
