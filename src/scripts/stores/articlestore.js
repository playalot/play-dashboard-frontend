var Reflux = require('reflux');
var $ = require('jquery');
var _ = require('lodash');
var ArticleActions = require('../actions/articleactions');

var ArticleListStore = Reflux.createStore({
    listenables: [ArticleActions],

    init: function() {
      this.articles = [];
      this.filter = '';
      this.timestamp = '';
    },
    getInitialState: function() {
  		if (this.articles.length === 0) {
        this.onFetchArticleList(this.filter);
      }
      return this.articles;
  	},
    onFetchArticleList: function(filter) {
      if (filter !== null && filter !== this.filter) {
        this.articles = [];
        this.filter = filter.trim();
        this.timestamp = '';
      }
      var sourceUrl = '/api/articles'

      var param = [];
      if (this.timestamp !== '' && this.timestamp !== null) {
        param.push('ts=' + this.timestamp);
      }
      if (this.filter !== '') {
        param.push('filter=' + this.filter);
      }

      var paramStr = param.join('&');
      if (paramStr !== '') {
          sourceUrl = sourceUrl + '?' + paramStr;
      }
      $.ajax({
          url: sourceUrl,
          dataType: 'json',
          context: this,
          success: function(data) {
            console.log('fetch articles complete');
            if (data.articles.length === 0 && this.timestamp !== '') {
              alert('no more');
            } else {
              this.articles = this.articles.concat(data.articles);
              this.timestamp = data.nextTs;
              this.trigger(this.articles);
            }
          }
      });
    },
    onToggleArticlePublish: function(id) {
      var foundArticle = _.find(this.articles, function(article) {
          return article.id === id;
      });
      if (foundArticle) {
        $.ajax({
          url: '/api/article/'+id+'/publish',
          type: 'POST',
          data: JSON.stringify({ recommend: !foundArticle.isRecommended }),
          contentType: 'application/json; charset=utf-8',
          success: function() {
            foundArticle.isPub = !foundArticle.isPub;
            this.trigger(this.articles);
          }.bind(this)
        });
      }
    }
});

module.exports = ArticleListStore;
