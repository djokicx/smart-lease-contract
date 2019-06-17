pragma solidity ^0.5.0;

contract SmartLeaseContract {

    event WrittenContractProposed(uint timestamp, string ipfsHash);
    event TenantAssigned(uint timestamp, address tenantAddress, uint rentAmount, uint depositAmount);
    event TenantSigned(uint timestamp, address tenantAddress);
    event DepositPayed(uint timestamp, address tenantAddress, uint amount);

    struct Tenant {
        uint rentAmount;
        uint depositAmount;
        bool hasSigned;
        bool hasPaidDeposit;

        bool initialized;
    }

    mapping(address => Tenant) public addressToTenant;
    Tenant[] public tenants;

    address payable public landlordAddress;
    string public writtenContractIpfsHash;

    uint8 public tenantOccupancy = 0;

    uint deposit;
    uint8 public TENANT_CAPACITY;
    

    // inheritance would be an issue with external constructors
    constructor(uint8 _capacity) public {
        require(msg.sender != address(0), "Landlord address must not be zero!");
        landlordAddress = msg.sender;

        TENANT_CAPACITY = _capacity;
        tenants.length = TENANT_CAPACITY;
    }

    modifier onlyTenant() {
        require(addressToTenant[msg.sender].initialized == true, "Only a tenant can invoke this functionality");
        _;
    }

    modifier onlyLandlord() {
        require(msg.sender == landlordAddress, "Only the landlord can invoke this functionality");
        _;
    }

    modifier isContractProposed() {
        require(!(isSameString(writtenContractIpfsHash, "")), "The written contract has not been proposed yet");
        _;
    }

    modifier hasSigned() {
        require(addressToTenant[msg.sender].hasSigned = true, "Tenant must sign the contract before invoking this functionality");
        _;
    }

    function proposeWrittenContract(string calldata _writtenContractIpfsHash) external onlyLandlord {

        // Update written contract ipfs hash
        writtenContractIpfsHash = _writtenContractIpfsHash;

        emit WrittenContractProposed(block.timestamp, _writtenContractIpfsHash);

        // Revoke previous signatures
        for(uint8 i = 0; i < tenants.length; i++) {
            if(tenants[i].initialized == true) {
                tenants[i].hasSigned = false;
            }
        }
    }

    function assignTenant(address _tenantAddress, uint _rentAmount, uint _depositAmount) external onlyLandlord isContractProposed {
        // require room in the house
        require(tenantOccupancy <= TENANT_CAPACITY, "The rental unit is fully occupied.");
        
        // inspect address
        require(_tenantAddress != address(0), "Tenant address must not be zero!");
        require(_tenantAddress != landlordAddress, "Landlord is not allowed to be a tenant at the same time.");
        require(addressToTenant[_tenantAddress].initialized == true, "Duplicate tenants are not allowed.");

        tenants.push(Tenant(_rentAmount, _depositAmount, false, false, true));

        addressToTenant[_tenantAddress] = tenants[tenantOccupancy];
        tenantOccupancy++;

        emit TenantAssigned(block.timestamp, _tenantAddress, _rentAmount, _depositAmount);
    }

    function signContract() external onlyTenant isContractProposed {
        require(addressToTenant[msg.sender].hasSigned == false, "The tenant has already signed the contract");

        // Tenant signed
        addressToTenant[msg.sender].hasSigned = true;

        emit TenantSigned(block.timestamp, msg.sender);
    }

    function payDeposit() external payable onlyTenant hasSigned {
        require(msg.value == addressToTenant[msg.sender].depositAmount,
            "Amount of provided deposit does not match the amount of required deposit");

        require(addressToTenant[msg.sender].hasPaidDeposit == false, "The tenant has already paid the deposit");

        deposit += msg.value;
        addressToTenant[msg.sender].hasPaidDeposit = true;

        emit DepositPayed(block.timestamp, msg.sender, msg.value);
    }


  function isSameString(string memory string1, string memory string2) private pure returns (bool) {
    return keccak256(abi.encodePacked(string1)) == keccak256(abi.encodePacked(string2));
  }
}