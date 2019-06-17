const SmartLeaseContract = artifacts.require("SmartLeaseContract");

const tenantCapacity = require("../config.js").tenantCapacity;

module.exports = function(deployer) {
  deployer.deploy(SmartLeaseContract, tenantCapacity);
};
