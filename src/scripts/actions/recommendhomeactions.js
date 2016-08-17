var Reflux = require('reflux');

var HomeAdActions = Reflux.createActions([
    'fetchHomeAdList',
    'deleteHomeAd'
]);

module.exports = HomeAdActions;
