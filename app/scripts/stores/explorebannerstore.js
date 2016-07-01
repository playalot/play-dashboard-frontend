var Reflux = require('reflux');
var $ = require('jquery');
var _ = require('lodash');
var BannerActions = require('../actions/explorebanneractions');

var BannerStore = Reflux.createStore({
    listenables: [BannerActions],

    init: function() {
      this.bannerlist = [];
    },
    getInitialState: function() {
      if (this.bannerlist.length === 0) {
        this.onFetchBannerList();
      }
      return this.bannerlist;
    },
    onFetchBannerList: function() {
      var sourceUrl = '/api/banners';
      $.ajax({
          url: sourceUrl,
          dataType: 'json',
          context: this,
          success: function(data) {
              console.log('fetch complete');
              this.bannerlist = data.banners;
              this.trigger(this.bannerlist);
          }
      });
    },
    onAddBanner: function() {
      $.ajax({
          url: '/api/recommend?place=banner',
          dataType: 'json',
          type: 'POST',
          context: this,
          success: function(data) {
            console.log(data);
            this.bannerlist.unshift(data);
            this.trigger(this.bannerlist);
          }
      });
    },
    onDeleteBanner: function(id) {
      $.ajax({
        url: '/api/recommend/'+id,
        type: 'DELETE',
        success: function() {
          console.log('delete Banner ' + id);
          this.updateList(_.filter(this.bannerlist, function(banner){
            return banner.id !== id;
          }));
        }.bind(this)
      });
    },
    updateList: function(list){
      this.bannerlist = list;
      this.trigger(this.bannerlist);
    }
});

module.exports = BannerStore;
