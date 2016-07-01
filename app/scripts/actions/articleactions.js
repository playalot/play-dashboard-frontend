var Reflux = require('reflux');

var ArticleActions = Reflux.createActions([
    'fetchArticleList',
    'toggleArticlePublish'
]);

module.exports = ArticleActions;
