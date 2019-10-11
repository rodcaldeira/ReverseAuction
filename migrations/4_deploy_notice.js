const Notice = artifacts.require('./Notice');

module.exports = function (deployer) {
  deployer.deploy(Notice);
}
