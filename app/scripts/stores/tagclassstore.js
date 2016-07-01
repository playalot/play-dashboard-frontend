var Reflux = require('reflux');
var $ = require('jquery');
var _ = require('lodash');
var TagClassActions = require('../actions/tagclassactions');

var TagClassStore = Reflux.createStore({
    listenables: [TagClassActions],

    init: function() {
      this.classifications = {};
    },
    getInitialState: function() {
      if (_.isEmpty(this.classifications)) {
        this.onFetchClassifications();
      }
      return this.classifications;
  	},
    onFetchClassifications: function() {
      $.ajax({
          url: '/api/classifications',
          dataType: 'json',
          context: this,
          success: function(data) {
            _.each(data, function(c){
              this.classifications[c.id] = c;
            }.bind(this));
            this.trigger(this.classifications);
          }.bind(this)
      });
    }
});

module.exports = TagClassStore;
