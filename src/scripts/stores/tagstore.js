var Reflux = require('reflux');
var $ = require('jquery');
var _ = require('lodash');
var TagActions = require('../actions/tagactions');

var TagStore = Reflux.createStore({
    listenables: [TagActions],

    init: function() {
      this.tags = [];
      this.selectedClassification = null;
      this.page = 0;
      this.filter = '';
    },
    getInitialState: function() {
      if (this.tags.length === 0) {
        this.onFetchTags(this.filter);
      }
      return this.tags;
  	},
    onFetchTags: function(filter) {
      if (filter !== null && filter !== this.filter) {
        this.filter = filter.trim();
        this.page = 0;
      }

      var sourceUrl = '/api/tags?page=' + this.page;
      if (this.selectedClassification !== null && this.selectedClassification !== '') {
        sourceUrl = sourceUrl + '&class=' + this.selectedClassification;
      }
      if (this.filter.length > 0) {
        sourceUrl = sourceUrl + '&filter=' + this.filter;
      }
      $.ajax({
          url: sourceUrl,
          dataType: 'json',
          context: this,
          success: function(data) {
            if (this.page === 0) {
              this.tags = data.tags;
            } else {
              this.tags = this.tags.concat(data.tags);
            }
            if (data.tags.length === 0 && this.page > 0) {
              alert('no more');
            } else {
              this.page = this.page + 1;
            }
            this.trigger(this.tags);
          }
      });
    },
    onSetTagClassification: function(tid, cid) {
      var foundTag = _.find(this.tags, function(t) {
        return t.id === tid;
      });
      if (foundTag) {
        $.ajax({
          url: '/api/tag/'+tid+'/class/'+cid,
          type: 'POST',
          success: function() {
            foundTag.cls.push(cid);
            this.updateList(this.tags);
          }.bind(this)
        });
      }
    },
    onRemoveTagClassification: function(tid, cid) {
      var foundTag = _.find(this.tags, function(tag) {
        return tag.id === tid;
      });
      if (foundTag) {
        $.ajax({
          url: '/api/tag/'+tid+'/class/'+cid,
          type: 'DELETE',
          success: function() {
            foundTag.cls = _.filter(foundTag.cls, function(c) {
              return c !== cid;
            });
            this.updateList(this.tags);
          }.bind(this)
        });
      }
    },
    onRecommendTag: function(id) {
      $.ajax({
          url: '/api/recommend/home/'+id+'?type=tag',
          type: 'POST',
          dataType: 'json',
          context: this,
          success: function(data) {
          }
      });
    },
    onDeleteTag: function(id) {
      var foundTag = _.find(this.tags, function(tag) {
        return tag.id === id;
      });
      if (foundTag) {
        $.ajax({
            url: '/api/tag/'+id,
            type: 'DELETE',
            success: function(data) {
              this.updateList(_.filter(this.tags, function(tag){
                return tag.id !== id;
              }));
            }.bind(this)
        });
      }
    },
    updateList: function(list){
      this.tags = list;
      this.trigger(this.tags);
    }
});

module.exports = TagStore;
