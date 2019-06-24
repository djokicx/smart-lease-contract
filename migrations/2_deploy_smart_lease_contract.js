const SmartLeaseRegistry = artifacts.require("SmartLeaseRegistry");

// const tenantCapacity = require("../config.js").tenantCapacity;

module.exports = function(deployer) {
  deployer.deploy(SmartLeaseRegistry);
};
