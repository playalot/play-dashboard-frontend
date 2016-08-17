var Reflux = require('reflux');
var $ = require('jquery');
var _ = require('lodash');
var PostActions = require('../actions/postactions');

module.exports = Reflux.createStore({
    listenables: [PostActions],

    init: function() {
      this.posts = [];
      this.filter = '';
      this.query = '';
      this.timestamp = '';
    },
    getInitialState: function() {
      if (this.posts.length === 0) {
        this.onFetchPostList(this.filter, this.query);
      }
      return this.posts;
    },
    onFetchPostList: function(filter, query) {
      if (this.query !== query || this.filter !== filter) {
          this.filter = filter;
          this.query = query;
          this.timestamp = '';
          this.posts = [];
      }
      var sourceUrl = '/api/posts';

      var param = [];
      if (this.timestamp !== '' && this.timestamp !== null) {
        param.push('ts=' + this.timestamp);
      }
      if (this.filter !== '') {
        param.push('filter=' + this.filter);
      }
      if (this.query !== '') {
        param.push('query=' + this.query);
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
              console.log('fetch posts complete');
              if (data.posts.length === 0 && this.timestamp !== '') {
                alert('no more');
              } else {
                this.posts = this.posts.concat(data.posts);
                this.timestamp = data.nextTs;
                this.trigger(this.posts);
              }
          }
      });
    },
    onDeletePost: function(id) {
      $.ajax({
        url: '/api/post/'+id,
        type: 'DELETE',
        success: function() {
          console.log('delete post ' + id);
          this.updateList(_.filter(this.posts, function(post){
            return post.id !== id;
          }));
        }.bind(this)
      });
    },
    onToggleRecommendPost: function(id) {
      var foundPost = _.find(this.posts, function(post) {
          return post.id === id;
      });
      if (foundPost) {
        console.log(foundPost);
        $.ajax({
          url: '/api/post/'+id+'/recommend',
          type: 'POST',
          data: JSON.stringify({ recommend: !foundPost.isRecommended }),
          contentType: 'application/json; charset=utf-8',
          success: function() {
            console.log('toggle recommend post ' + id);
            foundPost.isRecommended = !foundPost.isRecommended;
            this.updateList(this.posts);
          }.bind(this)
        });
      }
    },
    onToggleBlockPost: function(id) {
      var foundPost = _.find(this.posts, function(post) {
            return post.id === id;
      });
      if (foundPost) {
        $.ajax({
          url: '/api/post/'+id+'/block',
          type: 'POST',
          data: JSON.stringify({ block: !foundPost.isBlocked }),
          contentType: 'application/json; charset=utf-8',
          success: function() {
            console.log('toggle block post ' + id);
            foundPost.isBlocked = !foundPost.isBlocked;
            this.updateList(this.posts);
          }.bind(this)
        });
      }
    },
    onToggleR18Post: function(id) {
      var foundPost = _.find(this.posts, function(post) {
            return post.id === id;
      });
      if (foundPost) {
        $.ajax({
          url: '/api/post/'+id+'/r18',
          type: 'POST',
          data: JSON.stringify({ r18: !foundPost.isR18 }),
          contentType: 'application/json; charset=utf-8',
          success: function() {
            console.log('toggle r18 post ' + id);
            foundPost.isR18 = !foundPost.isR18;
            this.updateList(this.posts);
          }.bind(this)
        });
      }
    },
    onSetPostClassification: function(pid, cid) {
      var foundPost = _.find(this.posts, function(p) {
        return p.id === pid;
      });
      if (foundPost) {
        $.ajax({
          url: '/api/post/'+pid+'/class/'+cid,
          type: 'POST',
          success: function() {
            foundPost.cls.push(cid);
            this.updateList(this.posts);
          }.bind(this)
        });
      }
    },
    onRemovePostClassification: function(pid, cid) {
      var foundPost = _.find(this.posts, function(p) {
        return p.id === pid;
      });
      if (foundPost) {
        $.ajax({
          url: '/api/post/'+pid+'/class/'+cid,
          type: 'DELETE',
          success: function() {
            foundPost.cls = _.filter(foundPost.cls, function(c) {
              return c !== cid;
            });
            this.updateList(this.posts);
          }.bind(this)
        });
      }
    },
    onAddSku: function(pid, sid) {
      var foundPost = _.find(this.posts, function(p) {
        return p.id === pid;
      });
      if (foundPost) {
        $.ajax({
          url: '/api/post/'+pid+'/sku/'+sid,
          type: 'POST',
          success: function(sku) {
            foundPost.sku = sku;
            console.log(sku);
            this.updateList(this.posts);
          }.bind(this)
        });
      }
    },
    onAddTag: function(pid, text) {
      var foundPost = _.find(this.posts, function(p) {
        return p.id === pid;
      });
      if (foundPost) {
        $.ajax({
          url: '/api/post/'+pid+'/tag/'+text,
          type: 'POST',
          success: function(tag) {
            foundPost.tags.push(tag);
            this.updateList(this.posts);
          }.bind(this)
        });
      }
    },
    onRemoveTag: function(pid, tid) {
      var foundPost = _.find(this.posts, function(p) {
        return p.id === pid;
      });
      if (foundPost) {
        $.ajax({
          url: '/api/post/'+pid+'/tag/'+tid,
          type: 'DELETE',
          success: function() {
            foundPost.tags = _.filter(foundPost.tags, function(t) {
              return t.id !== tid;
            });
            this.updateList(this.posts);
          }.bind(this)
        });
      }
    },
    updateList: function(list){
      this.posts = list;
      this.trigger(this.posts);
    }
});
