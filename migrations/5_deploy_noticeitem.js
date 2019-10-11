const NoticeItem = artifacts.require('./NoticeItem');

module.exports = function (deployer) {
  deployer.deploy(NoticeItem);
}
