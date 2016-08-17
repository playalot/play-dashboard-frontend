var Reflux = require('reflux');

var UserActions = Reflux.createActions([
    'updateParams',
    'fetchUserList',
    'recommendUser',
    'toggleVerifyUser',
    'deletePost',
    'toggleRecommendPost',
    'toggleBlockPost',
    'deleteMark',
    'like',
    'unlike'
]);

module.exports = UserActions;
