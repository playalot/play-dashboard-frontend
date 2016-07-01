var Reflux = require('reflux');

var SkuActions = Reflux.createActions([
    'fetchSkus',
    'deleteSku',
    'toggleR18',
    'toggleRecommend',
    'addSku',
    'recommendToy'
]);

module.exports = SkuActions;
