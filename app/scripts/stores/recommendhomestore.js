var Reflux = require('reflux');
var $ = require('jquery');
var _ = require('lodash');
var HomeAdActions = require('../actions/recommendhomeactions');

var HomeAdStore = Reflux.createStore({
    listenables: [HomeAdActions],
    init: function() {
      this.homeads = [];
    },
    getInitialState: function() {
      if (this.homeads.length === 0) {
        this.onFetchHomeAdList();
      }
      return this.homeads;
    },
    onFetchHomeAdList: function() {
      var sourceUrl = '/api/recommend/homeads';
      $.ajax({
          url: sourceUrl,
          dataType: 'json',
          context: this,
          success: function(data) {
              console.log('fetch complete');
              this.homeads = data.items;
              this.trigger(this.homeads);
          }
      });
    },
    onDeleteHomeAd: function(id) {
      $.ajax({
        url: '/api/recommend/'+id,
        type: 'DELETE',
        success: function() {
          console.log('delete HomeAd ' + id);
          this.updateList(_.filter(this.homeads, function(ad){
            return ad.id !== id;
          }));
        }.bind(this)
      });
    },
    updateList: function(list){
      this.homeads = list;
      this.trigger(this.homeads);
    }
});

module.exports = HomeAdStore;
