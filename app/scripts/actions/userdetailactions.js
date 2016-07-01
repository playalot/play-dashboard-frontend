var Reflux = require('reflux');

var UserDetailActions = Reflux.createActions([
    'fetchUserDetailInfo',
    'fetchUserPosts',
    'updateUserId',
    'setActive',
    'updateUserInfo',
    'refreshUserCount',
    'changeForm'
]);

module.exports = UserDetailActions;
