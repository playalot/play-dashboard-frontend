var Reflux = require('reflux');

var BannerActions = Reflux.createActions([
    'fetchBannerList',
    'addBanner',
    'deleteBanner'
]);

module.exports = BannerActions;
