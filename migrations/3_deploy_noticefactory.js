const NoticeFactory = artifacts.require('./NoticeFactory');

module.exports = function (deployer) {
  deployer.deploy(NoticeFactory);
}
