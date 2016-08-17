var Reflux = require('reflux');

var PostActions = Reflux.createActions([
    'fetchPostList',
    'deletePost',
    'toggleRecommendPost',
    'toggleBlockPost',
    'toggleR18Post',
    'setPostClassification',
    'removePostClassification',
    'addSku',
    'addTag',
    'removeTag',
    'deleteMark',
    'addMark',
    'like',
    'unlike'
]);

module.exports = PostActions;
