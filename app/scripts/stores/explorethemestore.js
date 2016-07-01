var Reflux = require('reflux');
var $ = require('jquery');
var _ = require('lodash');
var ThemeActions = require('../actions/explorethemeactions');

var ThemeStore = Reflux.createStore({
    listenables: [ThemeActions],

    init: function() {
      this.themelist = [];
      this.page = 0;
    },
    getInitialState: function() {
      if (this.themelist.length === 0) {
        this.onFetchThemeList();
      }
      return this.themelist;
    },
    onFetchThemeList: function() {
      var sourceUrl = '/api/themes?page=' + this.page;
      $.ajax({
          url: sourceUrl,
          dataType: 'json',
          context: this,
          success: function(data) {
              console.log('fetch complete');
              this.themelist = this.themelist.concat(data.themes);
              if (data.themes.length === 0 && this.page > 0) {
                alert('no more');
              }
              this.page = this.page + 1;
              this.trigger(this.themelist);
          }
      });
    },
    onAddTheme: function() {
      $.ajax({
          url: '/api/recommend?place=theme',
          dataType: 'json',
          type: 'POST',
          context: this,
          success: function(data) {
            console.log(data);
            this.themelist.unshift(data);
            this.trigger(this.themelist);
          }
      });
    },
    onDeleteTheme: function(id) {
      $.ajax({
        url: '/api/recommend/'+id,
        type: 'DELETE',
        success: function() {
          console.log('delete Theme ' + id);
          this.updateList(_.filter(this.themelist, function(theme){
            return theme.id !== id;
          }));
        }.bind(this)
      });
    },
    updateList: function(list){
      this.themelist = list;
      this.trigger(this.themelist);
    }
});

module.exports = ThemeStore;
