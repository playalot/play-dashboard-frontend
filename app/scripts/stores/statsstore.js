var Reflux = require('reflux');
var $ = require('jquery');
var Router = require('react-router');
var StatsActions = require('../actions/statsactions');

var StatsStore = Reflux.createStore({
    listenables: [StatsActions],

    init: function() {
      this.stats = {};
    },
    getInitialState: function() {
      if (!this.stats.posts) {
        this.updateStats();
      }
      return this.stats;
    },
    updateStats: function() {
      $.ajax({
          url: '/api/stats',
          dataType: 'json',
          context: this,
          success: function(data) {
            this.stats = data;
            this.trigger(this.stats);
          }
      });
    }
});

module.exports = StatsStore;
